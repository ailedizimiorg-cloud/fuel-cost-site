// app/fuel-cost/[country]/[city]/page.tsx
import { getFuelPrices, generateDescription, getComparisonData } from "@/lib/fuel-api";
import Calculator from "@/components/Calculator";
import { notFound } from 'next/navigation';

export default async function FuelPage({ params }: { params: { country: string; city: string } }) {
  const { country, city } = params;
  
  // URL'den gelen ülke adının 2 harfli ISO kodu olduğunu varsayıyoruz (örn: "tr", "us")
  // Bu kod, veritabanı sorgusu için doğrudan kullanılacak.
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
  
  // SEO için açıklama ve karşılaştırma verilerini oluşturuyoruz.
  // İlk geçerli fiyatı bulup onu kullanıyoruz.
  const primaryPrice = prices.gasoline_price || prices.diesel_price || prices.lpg_price || prices.electric_price || 0;
  const currencySymbol = prices.currency_symbol || prices.currency || "$";
  const description = generateDescription(city, primaryPrice, currencySymbol);
  const comparisons = await getComparisonData(city, country);
  console.log("Comparisons:", comparisons);

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
          'name': `How much does it cost to drive 1km in ${city}?`,
          'acceptedAnswer': { '@type': 'Answer', 'text': description }
        }
      ]
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <h1 className="text-5xl font-semibold tracking-[-2.4px] mb-8 text-white">Current Fuel Prices in {city.toUpperCase()}, {country.toUpperCase()} - Guide</h1>
      
      <p className="text-lg text-gray-400 mb-10">{description}</p>

      {/* Calculator bileşenine tüm fiyatları gönderiyoruz */}
      <Calculator initialPrices={prices} />

      <h2 className="text-2xl font-semibold mt-12 mb-6 text-white">Price Comparisons</h2>
      <table className="w-full text-left bg-gray-800 border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-4 text-white">Location</th>
            <th className="p-4 text-white">Price ({currencySymbol})</th>
          </tr>
        </thead>
        <tbody>
          {comparisons.map((c) => (
            <tr key={c.city} className="border-t border-gray-700">
              <td className="p-4 text-gray-300">{c.city}</td>
              <td className="p-4 text-gray-300">{currencySymbol}{c.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
