// app/fuel-cost/[country]/[city]/page.tsx
import { getFuelPrices, generateDescription, getComparisonData } from "@/lib/fuel-api";
import Calculator from "@/components/Calculator";
import LanguageSelector from "@/components/LanguageSelector";
import CitySearch from "@/components/CitySearch";
import { notFound } from 'next/navigation';
import { translate, getLanguage, getLanguageFromHeaders } from "@/lib/i18n";
import { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ country: string; city: string }>; 
  searchParams: Promise<{ lang?: string }> 
}): Promise<Metadata> {
  const { country, city } = await params;
  const { lang } = await searchParams;

  const prices = await getFuelPrices(country, city);
  if (!prices) {
    return {
      title: "Fuel Prices Tracker",
    };
  }

  // Detect language from headers if no explicit lang param is present
  const headerList = await headers();
  const acceptLanguage = headerList.get('accept-language') || '';
  const vercelCountry = headerList.get('x-vercel-ip-country') || '';
  const detectedLang = getLanguageFromHeaders(acceptLanguage, vercelCountry);
  const currentLang = lang || detectedLang || getLanguage(country);
  const primaryPrice = prices.gasoline_price || prices.diesel_price || prices.lpg_price || prices.electric_price || 0;
  const currencySymbol = prices.currency_symbol || prices.currency || "$";
  const description = generateDescription(city, primaryPrice, currencySymbol, country, currentLang);

  const translatedTitle = translate(currentLang, 'title', {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: country.toUpperCase(),
  });

  const baseUrl = "https://fuelcost.info";
  const canonicalUrl = `${baseUrl}/fuel-cost/${country}/${city}`;

  const languagesList = ['en', 'tr', 'de', 'fr', 'es', 'it'];
  const languageAlternates: { [key: string]: string } = {};

  languagesList.forEach((l) => {
    languageAlternates[l] = `${canonicalUrl}?lang=${l}`;
  });
  languageAlternates['x-default'] = canonicalUrl;

  return {
    title: translatedTitle,
    description: description,
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates,
    }
  };
}

export default async function FuelPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ country: string; city: string }>; 
  searchParams: Promise<{ lang?: string }> 
}) {
  const { country, city } = await params;
  const { lang } = await searchParams;
  
  // URL'den gelen ülke adının 2 harfli ISO kodu olduğunu varsayıyoruz (örn: "tr", "us")
  const prices = await getFuelPrices(country, city);
  console.log("Prices:", prices);

  // Fiyatlar bulunamazsa veya hiç dolu veri yoksa 404 sayfası göster
  const hasPrices = prices && (
    prices.gasoline_price !== null ||
    prices.diesel_price !== null ||
    prices.lpg_price !== null ||
    prices.electric_price !== null
  );

  if (!hasPrices) {
    notFound();
  }
  
  // Belirlenen geçerli dili çözüyoruz (varsayılan ülke kodu, manuel ise lang veya header tespiti)
  const headerList = await headers();
  const acceptLanguage = headerList.get('accept-language') || '';
  const vercelCountry = headerList.get('x-vercel-ip-country') || '';
  const detectedLang = getLanguageFromHeaders(acceptLanguage, vercelCountry);
  const currentLang = lang || detectedLang || getLanguage(country);

  // SEO için açıklama ve karşılaştırma verilerini oluşturuyoruz.
  const primaryPrice = prices.gasoline_price || prices.diesel_price || prices.lpg_price || prices.electric_price || 0;
  const currencySymbol = prices.currency_symbol || prices.currency || "$";
  const description = generateDescription(city, primaryPrice, currencySymbol, country, currentLang);
  const comparisons = await getComparisonData(
    city, 
    country, 
    prices.currency_code || undefined, 
    prices.currency_symbol || undefined
  );
  console.log("Comparisons:", comparisons);

  const translatedTitle = translate(currentLang, 'title', {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: country.toUpperCase(),
  });

  const translatedQuestion = translate(currentLang, 'question', {
    city: city.charAt(0).toUpperCase() + city.slice(1),
  });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'FuelCost Tracker',
    'applicationCategory': 'UtilitiesApplication',
    'mainEntity': {
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': translatedQuestion,
          'acceptedAnswer': { '@type': 'Answer', 'text': description }
        }
      ]
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-[#1c1917]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      {/* Üst Kısım: Dil Seçici ve Şehir Arama */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#e7e5e4] pb-6">
        <CitySearch lang={currentLang} className="w-full md:max-w-xs" />
        <LanguageSelector currentLang={currentLang} />
      </div>

      <h1 className="text-5xl font-semibold tracking-[-2.4px] mb-8 text-[#1c1917]">
        {translatedTitle}
      </h1>
      
      <p className="text-lg text-[#57534e] mb-10 leading-relaxed">{description}</p>

      {/* Calculator bileşenine tüm fiyatları, ülke kodunu ve geçerli dili gönderiyoruz */}
      <Calculator initialPrices={prices} countryCode={country} lang={currentLang} />

      <h2 className="text-2xl font-semibold mt-12 mb-6 text-[#1c1917]">
        {translate(currentLang, 'priceComparisons')}
      </h2>
      <table className="w-full text-left bg-white border border-[#e7e5e4] rounded-xl overflow-hidden shadow-sm">
        <thead className="bg-[#f5f4f0] border-b border-[#e7e5e4]">
          <tr>
            <th className="p-4 text-[#44403c] font-semibold">
              {translate(currentLang, 'location')}
            </th>
            <th className="p-4 text-[#44403c] font-semibold">
              {translate(currentLang, 'originalPrice')}
            </th>
            <th className="p-4 text-[#44403c] font-semibold">
              {translate(currentLang, 'convertedPrice', { localCurrency: prices.currency_symbol || prices.currency || '$' })}
            </th>
          </tr>
        </thead>
        <tbody>
          {comparisons.map((c) => (
            <tr key={c.city} className="border-t border-[#e7e5e4] hover:bg-[#faf9f6]/80 transition-colors">
              <td className="p-4 text-[#44403c]">{c.city}</td>
              <td className="p-4 text-[#57534e] font-mono">
                {c.currencySymbol}{c.price.toFixed(2)}
              </td>
              <td className="p-4 text-emerald-700 font-mono font-semibold">
                {c.convertedPrice !== null ? (
                  `${c.targetCurrencySymbol}${c.convertedPrice.toFixed(2)}`
                ) : (
                  `${c.currencySymbol}${c.price.toFixed(2)}`
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
