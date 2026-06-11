// app/fuel-cost/[lang]/[city]/page.tsx
// Path-based language with localized slugs: /yakit-maliyeti/tr/istanbul (rewritten from middleware)
import { getFuelPrices } from "@/lib/fuel-api";
import { generateDescription, getComparisonData } from "@/lib/seo-utils";
import {
  generateBreadcrumbSchema,
  generateProductSchemas,
  generateMultiFaqSchema,
  generateWebAppSchema,
} from "@/lib/seo-schema";
import Calculator from "@/components/Calculator";
import CitySearch from "@/components/CitySearch";
import { notFound } from "next/navigation";
import { translate, translations, getLanguage, countryToLanguage } from "@/lib/i18n";
import { Metadata } from "next";
import { createAdminClient } from "@/lib/supabaseClient";
import { getLocalizedUrl, getLocalizedSegment, allLanguages, routeTranslations } from "@/lib/route-translations";

const baseUrl = "https://fuelcost.info";

// Look up city globally by slug to get its country code
async function findCityCountry(city: string): Promise<string | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('cities')
    .select('country_code')
    .eq('slug', city.toLowerCase())
    .limit(1)
    .single();
  if (error || !data) return null;
  return data.country_code;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}): Promise<Metadata> {
  const { lang, city } = await params;
  const country = await findCityCountry(city);
  if (!country) return { title: "Fuel Prices Tracker" };

  const prices = await getFuelPrices(country, city);
  if (!prices) return { title: "Fuel Prices Tracker" };

  const primaryPrice =
    prices.gasoline_price || prices.diesel_price || prices.lpg_price || prices.electric_price || 0;
  const currencySymbol = prices.currency_symbol || prices.currency || "$";
  const description = generateDescription(city, primaryPrice, currencySymbol, country, lang);

  const translatedTitle = translate(lang, "title", {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: country.toUpperCase(),
  });

  const canonicalUrl = `${baseUrl}${getLocalizedUrl(lang, city.toLowerCase())}`;
  // Remove the current lang from the list for alternates
  const otherLangs = allLanguages.filter(l => l !== lang);

  const languageAlternates: Record<string, string> = {};
  otherLangs.forEach((l) => {
    languageAlternates[l] = `${baseUrl}${getLocalizedUrl(l, city.toLowerCase())}`;
  });
  languageAlternates["x-default"] = `${baseUrl}${getLocalizedUrl("en", city.toLowerCase())}`;

  return {
    title: translatedTitle,
    description,
    keywords: [
      `${city.toLowerCase()} fuel prices`,
      `${country.toUpperCase()} fuel prices`,
      "gasoline prices","diesel prices","LPG prices",
      "EV charging costs","fuel cost calculator",
    ],
    alternates: { canonical: canonicalUrl, languages: languageAlternates },
    openGraph: {
      title: translatedTitle,
      description,
      url: canonicalUrl,
      siteName: "FuelCost.info",
      locale: lang === "tr" ? "tr_TR" : `${lang}_${lang.toUpperCase()}`,
      type: "website",
      images: [{ url: `${baseUrl}/og-image.svg`, width: 1200, height: 630, alt: `${translatedTitle} - FuelCost.info` }],
    },
    twitter: {
      card: "summary_large_image",
      title: translatedTitle,
      description,
      images: [`${baseUrl}/og-image.svg`],
    },
  };
}

interface ComparisonCity {
  city: string;
  countryCode: string;
  price: number;
  currencySymbol: string;
  convertedPrice: number | null;
  targetCurrencySymbol: string;
}

export default async function FuelPage({
  params,
}: {
  params: Promise<{ lang: string; city: string }>;
}) {
  const { lang, city } = await params;

  // Find country from city slug
  const country = await findCityCountry(city);
  if (!country) notFound();

  const prices = await getFuelPrices(country, city);
  const hasPrices =
    prices &&
    (prices.gasoline_price != null || prices.diesel_price != null ||
     prices.lpg_price != null || prices.electric_price != null);
  if (!hasPrices) notFound();

  const currentLang = lang;

  const primaryPrice =
    prices.gasoline_price || prices.diesel_price || prices.lpg_price || prices.electric_price || 0;
  const currencySymbol = prices.currency_symbol || prices.currency || "$";
  const description = generateDescription(city, primaryPrice, currencySymbol, country, currentLang);
  const comparisons: ComparisonCity[] = await getComparisonData(
    city, country,
    prices.currency_code || undefined,
    prices.currency_symbol || undefined
  );

  const cityCap = city.charAt(0).toUpperCase() + city.slice(1);
  const countryUpper = country.toUpperCase();
  const canonicalUrl = `${baseUrl}${getLocalizedUrl(currentLang, city.toLowerCase())}`;
  const translatedTitle = translate(currentLang, "title", { city: cityCap, country: countryUpper });

  // Structured Data
  const breadcrumbSchema = generateBreadcrumbSchema(country, city, baseUrl);
  const productSchemas = generateProductSchemas(city, country, prices, baseUrl);
  const faqSchema = generateMultiFaqSchema([
    {
      question: translate(currentLang, "faqQ1", { city: cityCap, country: countryUpper }),
      answer: translate(currentLang, "faqA1", { city: cityCap, country: countryUpper, currency: currencySymbol, gasoline: (prices.gasoline_price || 0).toFixed(2), diesel: (prices.diesel_price || 0).toFixed(2), lpg: (prices.lpg_price || 0).toFixed(2), electric: (prices.electric_price || 0).toFixed(2) }),
    },
    {
      question: translate(currentLang, "faqQ2", { city: cityCap, country: countryUpper }),
      answer: translate(currentLang, "faqA2", { city: cityCap, country: countryUpper, currency: currencySymbol }),
    },
    {
      question: translate(currentLang, "faqQ3", { city: cityCap, country: countryUpper }),
      answer: translate(currentLang, "faqA3", { city: cityCap, country: countryUpper }),
    },
    {
      question: translate(currentLang, "faqQ4", { city: cityCap, country: countryUpper }),
      answer: translate(currentLang, "faqA4", { city: cityCap, country: countryUpper }),
    },
  ]);
  const webAppSchema = generateWebAppSchema(
    "FuelCost.info - Fuel Price Tracker",
    `Real-time fuel prices and cost analysis for ${cityCap}, ${countryUpper}. Compare gasoline, diesel, LPG, and EV charging costs with currency conversion.`,
    canonicalUrl
  );

  const relatedCities = comparisons.slice(0, 5).filter(Boolean);

  const ft: { key: string; label: string }[] = [];
  const ftLabels: Record<string, string> = (translations[getLanguage(currentLang)]?.["fuelTypes"] || translations["en"]?.["fuelTypes"] || {}) as Record<string, string>;
  if (prices.gasoline_price != null && prices.gasoline_price > 0)
    ft.push({ key: "gasoline", label: ftLabels["gasoline_price"] || "Gasoline" });
  if (prices.diesel_price != null && prices.diesel_price > 0)
    ft.push({ key: "diesel", label: ftLabels["diesel_price"] || "Diesel" });
  if (prices.lpg_price != null && prices.lpg_price > 0)
    ft.push({ key: "lpg", label: ftLabels["lpg_price"] || "LPG" });
  if (prices.electric_price != null && prices.electric_price > 0)
    ft.push({ key: "electric", label: ftLabels["electric_price"] || "Electricity" });

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-[#1c1917]">
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {productSchemas.map((s, i) => (
        <script key={`p-${i}`} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[#a8a29e] font-mono">
          <li><a href="/" className="hover:text-[#57534e] transition-colors">FuelCost.info</a></li>
          <li aria-hidden="true">/</li>
          <li><span className="text-[#57534e]">{countryUpper}</span></li>
          <li aria-hidden="true">/</li>
          <li className="text-[#57534e] font-medium" aria-current="page">{cityCap}</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#e7e5e4] pb-6">
        <div className="w-full">
          <CitySearch lang={currentLang} className="w-full md:max-w-xs" />
        </div>
      </div>

      {/* H1 */}
      <h1 className="text-4xl md:text-5xl font-semibold tracking-[-2.4px] mb-6 text-[#1c1917]">
        {translatedTitle}
      </h1>

      <p className="text-base text-[#57534e] mb-8 leading-relaxed">{description}</p>

      <Calculator initialPrices={prices} countryCode={country} lang={currentLang} />

      <h2 className="text-2xl font-semibold mt-16 mb-4 text-[#1c1917]">
        {translate(currentLang, "priceComparisons") || "Fuel Type Comparison"}
      </h2>
      <p className="text-sm text-[#57534e] mb-6 leading-relaxed">
        {translate(currentLang, "offersDesc", {
          city: cityCap,
          fuelList: ft.map((f, i) => {
            if (i === 0) return f.label;
            if (i === ft.length - 1) return translate(currentLang, "and") + f.label;
            return ", " + f.label;
          }).join("")
        })}
      </p>

      {/* Price Comparisons Table */}
      <h2 className="text-2xl font-semibold mt-12 mb-6 text-[#1c1917]">
        {translate(currentLang, "priceComparisons")}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left bg-white border border-[#e7e5e4] rounded-xl overflow-hidden shadow-sm">
          <thead className="bg-[#f5f4f0] border-b border-[#e7e5e4]">
            <tr>
              <th className="p-4 text-[#44403c] font-semibold">{translate(currentLang, "location")}</th>
              <th className="p-4 text-[#44403c] font-semibold">{translate(currentLang, "originalPrice")}</th>
              <th className="p-4 text-[#44403c] font-semibold">
                {translate(currentLang, "convertedPrice", { localCurrency: prices.currency_symbol || prices.currency || "$" })}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((c: ComparisonCity) => {
              const cityName = c.city.split(" (")[0].toLowerCase().replace(/\s+/g, "-");
              const href = getLocalizedUrl(countryToLanguage[c.countryCode] || "en", cityName);
              return (
                <tr key={c.city} className="border-t border-[#e7e5e4] hover:bg-[#faf9f6]/80 transition-colors">
                  <td className="p-4 text-[#44403c]">
                    <a href={href} className="hover:text-emerald-700 hover:underline transition-colors">{c.city}</a>
                  </td>
                  <td className="p-4 text-[#57534e] font-mono">{c.currencySymbol}{c.price.toFixed(2)}</td>
                  <td className="p-4 text-emerald-700 font-mono font-semibold">
                    {c.convertedPrice != null
                      ? `${c.targetCurrencySymbol}${c.convertedPrice.toFixed(2)}`
                      : `${c.currencySymbol}${c.price.toFixed(2)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Related Cities */}
      {relatedCities.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-16 mb-6 text-[#1c1917]">
            {translate(currentLang, "priceComparisons")} — {translate(currentLang, "relatedCities")}
          </h2>
          <p className="text-sm text-[#57534e] mb-6 leading-relaxed">
            {translate(currentLang, "compareDesc", { city: cityCap })}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {relatedCities.map((c: ComparisonCity) => {
              const cityName = c.city.split(" (")[0].toLowerCase().replace(/\s+/g, "-");
              return (
                <a key={c.city} href={getLocalizedUrl(countryToLanguage[c.countryCode] || "en", cityName)}
                  className="block bg-[#faf9f6] border border-[#e7e5e4] rounded-xl p-4 hover:bg-[#f5f4f0] hover:border-[#d6d3d1] transition-all">
                  <div className="font-medium text-[#1c1917]">{c.city}</div>
                  <div className="text-xs text-[#a8a29e] mt-1 font-mono">
                    {c.currencySymbol}{c.price.toFixed(2)} / L
                  </div>
                </a>
              );
            })}
          </div>
        </>
      )}

      {/* FAQ */}
      <h2 className="text-2xl font-semibold mt-12 mb-6 text-[#1c1917]">
        {translate(currentLang, "faqTitle") || "Frequently Asked Questions"}
      </h2>
      <div className="space-y-4 mb-12">
        {["faqQ1","faqQ2","faqQ3","faqQ4"].map((qKey, idx) => {
          const aKey = `faqA${idx + 1}`;
          const q = translate(currentLang, qKey, { city: cityCap, country: countryUpper });
          const a = translate(currentLang, aKey, {
            city: cityCap, country: countryUpper,
            currency: currencySymbol,
            gasoline: (prices.gasoline_price || 0).toFixed(2),
            diesel: (prices.diesel_price || 0).toFixed(2),
            lpg: (prices.lpg_price || 0).toFixed(2),
            electric: (prices.electric_price || 0).toFixed(2),
          });
          return (
            <details key={qKey} className="group bg-[#faf9f6] border border-[#e7e5e4] rounded-xl p-5 open:bg-white transition-all">
              <summary className="font-semibold text-[#1c1917] cursor-pointer list-none flex items-center justify-between">
                <span>{q}</span>
                <span className="text-[#a8a29e] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-3 text-[#57534e] text-sm leading-relaxed">{a}</p>
            </details>
          );
        })}
      </div>
    </div>
  );
}
