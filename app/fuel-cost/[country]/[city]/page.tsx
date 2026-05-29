// app/fuel-cost/[country]/[city]/page.tsx
import { getFuelPrices, getComparisonData } from "@/lib/fuel-api";
import { generateDescription } from "@/lib/seo-utils";
import {
  generateBreadcrumbSchema,
  generateProductSchemas,
  generateMultiFaqSchema,
  generateWebAppSchema,
} from "@/lib/seo-schema";
import Calculator from "@/components/Calculator";
import LanguageSelector from "@/components/LanguageSelector";
import CitySearch from "@/components/CitySearch";
import { notFound } from "next/navigation";
import { translate, getLanguage, getLanguageFromHeaders } from "@/lib/i18n";
import { Metadata } from "next";
import { headers } from "next/headers";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ country: string; city: string }>;
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { country, city } = await params;
  const { lang } = await searchParams;

  const prices = await getFuelPrices(country, city);
  if (!prices) {
    return { title: "Fuel Prices Tracker" };
  }

  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language") || "";
  const vercelCountry = headerList.get("x-vercel-ip-country") || "";
  const detectedLang = getLanguageFromHeaders(acceptLanguage, vercelCountry);
  const currentLang = lang || detectedLang || getLanguage(country);
  const primaryPrice =
    prices.gasoline_price ||
    prices.diesel_price ||
    prices.lpg_price ||
    prices.electric_price ||
    0;
  const currencySymbol = prices.currency_symbol || prices.currency || "$";
  const description = generateDescription(
    city, primaryPrice, currencySymbol, country, currentLang
  );

  const translatedTitle = translate(currentLang, "title", {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    country: country.toUpperCase(),
  });

  const baseUrl = "https://fuelcost.info";
  const canonicalUrl = `${baseUrl}/fuel-cost/${country}/${city}`;

  const languagesList = [
    "en","tr","de","fr","es","it","pt","ru","zh","ja","ko",
    "nl","pl","ar","id","vi","hi","uk","ro","sv","no","da","fi","el","cs",
  ];
  const languageAlternates: Record<string, string> = {};
  languagesList.forEach((l) => { languageAlternates[l] = `${canonicalUrl}?lang=${l}`; });
  languageAlternates["x-default"] = canonicalUrl;

  return {
    title: translatedTitle,
    description: description,
    keywords: [
      `${city.toLowerCase()} fuel prices`,
      `${country.toUpperCase()} fuel prices`,
      "gasoline prices","diesel prices","LPG prices",
      "EV charging costs","fuel cost calculator",
    ],
    alternates: { canonical: canonicalUrl, languages: languageAlternates },
    openGraph: {
      title: translatedTitle,
      description: description,
      url: canonicalUrl,
      siteName: "FuelCost.info",
      locale: currentLang === "tr" ? "tr_TR" : "en_US",
      type: "website",
      images: [{
        url: `${baseUrl}/og-image.png`,
        width: 1200, height: 630,
        alt: `${translatedTitle} - FuelCost.info`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: translatedTitle,
      description: description,
      images: [`${baseUrl}/og-image.png`],
    },
  };
}

interface ComparisonCity {
  city: string;
  price: number;
  currencySymbol: string;
  convertedPrice: number | null;
  targetCurrencySymbol: string;
}

export default async function FuelPage({
  params,
  searchParams,
}: {
  params: Promise<{ country: string; city: string }>;
  searchParams: Promise<{ lang?: string }>;
}) {
  const { country, city } = await params;
  const { lang } = await searchParams;

  const prices = await getFuelPrices(country, city);

  const hasPrices =
    prices &&
    (prices.gasoline_price != null ||
     prices.diesel_price != null ||
     prices.lpg_price != null ||
     prices.electric_price != null);

  if (!hasPrices) notFound();

  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language") || "";
  const vercelCountry = headerList.get("x-vercel-ip-country") || "";
  const detectedLang = getLanguageFromHeaders(acceptLanguage, vercelCountry);
  const currentLang = lang || detectedLang || getLanguage(country);

  const primaryPrice =
    prices.gasoline_price ||
    prices.diesel_price ||
    prices.lpg_price ||
    prices.electric_price ||
    0;
  const currencySymbol = prices.currency_symbol || prices.currency || "$";
  const description = generateDescription(
    city, primaryPrice, currencySymbol, country, currentLang
  );
  const comparisons: ComparisonCity[] = await getComparisonData(
    city, country,
    prices.currency_code || undefined,
    prices.currency_symbol || undefined
  );

  const cityCap = city.charAt(0).toUpperCase() + city.slice(1);
  const countryUpper = country.toUpperCase();
  const baseUrl = "https://fuelcost.info";
  const canonicalUrl = `${baseUrl}/fuel-cost/${country}/${city}`;
  const translatedTitle = translate(currentLang, "title", { city: cityCap, country: countryUpper });
  const translatedQuestion = translate(currentLang, "question", { city: cityCap });

  // Structured Data (JSON-LD)
  const breadcrumbSchema = generateBreadcrumbSchema(country, city);
  const productSchemas = generateProductSchemas(city, country, prices);
  const faqSchema = generateMultiFaqSchema([
    {
      question: `What is the cheapest fuel type in ${cityCap}, ${countryUpper}?`,
      answer: `Based on current prices in ${cityCap}, fuel costs vary. Gasoline is ${currencySymbol}${(prices.gasoline_price || 0).toFixed(2)}/L, diesel is ${currencySymbol}${(prices.diesel_price || 0).toFixed(2)}/L, LPG is ${currencySymbol}${(prices.lpg_price || 0).toFixed(2)}/L, and electricity is ${currencySymbol}${(prices.electric_price || 0).toFixed(2)}/kWh. Compare costs based on your vehicle using the calculator above.`,
    },
    {
      question: `How do fuel prices in ${cityCap} compare to other cities worldwide?`,
      answer: `Our global comparison tool shows fuel prices from ${cityCap} alongside 5 randomly selected cities from different countries, with all prices converted to ${currencySymbol} for easy comparison. Use the city search bar to explore any of 48,000+ cities.`,
    },
    {
      question: `Which fuel produces the least CO\u2082 emissions in ${cityCap}?`,
      answer: `Electric vehicles (EVs) produce the least CO\u2082 emissions per kilometer. Among fossil fuels, LPG produces approximately 1.51 kg CO\u2082 per liter, gasoline produces 2.31 kg CO\u2082/L, and diesel produces 2.68 kg CO\u2082/L. Our eco-comparison table ranks each fuel type by carbon footprint.`,
    },
  ]);
  const webAppSchema = generateWebAppSchema(
    "FuelCost.info - Fuel Price Tracker",
    `Real-time fuel prices and cost analysis for ${cityCap}, ${countryUpper}. Compare gasoline, diesel, LPG, and EV charging costs with currency conversion.`,
    canonicalUrl
  );

  // Build related cities internal links (first 5)
  const relatedCities = comparisons.slice(0, 5).filter(Boolean);

  // Determine available fuel types for this city
  const ft: { key: string; label: string }[] = [];
  const ftLabels: Record<string, string> = (translate(currentLang, "fuelTypes") || {}) as Record<string, string>;
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

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[#a8a29e] font-mono">
          <li>
            <a href="/" className="hover:text-[#57534e] transition-colors">FuelCost.info</a>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <a href={`/fuel-cost/${country.toLowerCase()}`}
              className="hover:text-[#57534e] transition-colors">{countryUpper}</a>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[#57534e] font-medium" aria-current="page">{cityCap}</li>
        </ol>
      </nav>

      {/* Header: Search + Language */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#e7e5e4] pb-6">
        <div className="w-full">
          <CitySearch lang={currentLang} className="w-full md:max-w-xs" />
        </div>
        <div className="flex-shrink-0">
          <LanguageSelector currentLang={currentLang} />
        </div>
      </div>

      {/* H1 Title */}
      <h1 className="text-4xl md:text-5xl font-semibold tracking-[-2.4px] mb-6 text-[#1c1917]">
        {translatedTitle}
      </h1>

      {/* SEO Description */}
      <p className="text-base text-[#57534e] mb-8 leading-relaxed">{description}</p>

      {/* Calculator */}
      <Calculator initialPrices={prices} countryCode={country} lang={currentLang} />

      {/* H2: Fuel Type Overview */}
      <h2 className="text-2xl font-semibold mt-16 mb-4 text-[#1c1917]">
        {translate(currentLang, "priceComparisons") || "Fuel Type Comparison"}
      </h2>
      <p className="text-sm text-[#57534e] mb-6 leading-relaxed">
        {cityCap} offers {ft.map((f, i) => (
          <span key={f.key}>
            {i > 0 && i === ft.length - 1 ? " and " : i > 0 ? ", " : ""}
            {f.label}
          </span>
        ))}.
        Each fuel type has different costs, efficiency, and environmental impact.
        Use the calculator above to estimate driving costs based on your distance and consumption.
      </p>

      {/* H2: Price Comparisons Table */}
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
              const countryCode = c.city.match(/\(([^)]+)\)$/)?.[1]?.toLowerCase() || "";
              const href = `/fuel-cost/${countryCode}/${cityName}`;
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

      {/* Related Cities - Internal Links */}
      {relatedCities.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold mt-16 mb-6 text-[#1c1917]">
            {translate(currentLang, "priceComparisons")} — Related Cities
          </h2>
          <p className="text-sm text-[#57534e] mb-6 leading-relaxed">
            Compare fuel prices in {cityCap} with other cities around the world:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {relatedCities.map((c: ComparisonCity) => {
              const cityName = c.city.split(" (")[0].toLowerCase().replace(/\s+/g, "-");
              const countryCode = c.city.match(/\(([^)]+)\)$/)?.[1]?.toLowerCase() || "";
              return (
                <a key={c.city} href={`/fuel-cost/${countryCode}/${cityName}`}
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

      {/* FAQ Section */}
      <h2 className="text-2xl font-semibold mt-12 mb-6 text-[#1c1917]">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4 mb-12">
        <details className="group bg-[#faf9f6] border border-[#e7e5e4] rounded-xl p-5 open:bg-white transition-all">
          <summary className="font-semibold text-[#1c1917] cursor-pointer list-none flex items-center justify-between">
            <span>What is the cheapest fuel type in {cityCap}, {countryUpper}?</span>
            <span className="text-[#a8a29e] group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p className="mt-3 text-[#57534e] text-sm leading-relaxed">
            Based on current prices in {cityCap}, fuel costs vary significantly:
            Gasoline is {currencySymbol}{(prices.gasoline_price || 0).toFixed(2)}/L,
            diesel is {currencySymbol}{(prices.diesel_price || 0).toFixed(2)}/L,
            LPG is {currencySymbol}{(prices.lpg_price || 0).toFixed(2)}/L,
            and electricity is {currencySymbol}{(prices.electric_price || 0).toFixed(2)}/kWh.
            Electric vehicles typically offer the lowest per-kilometer cost, especially when charged at home.
          </p>
        </details>

        <details className="group bg-[#faf9f6] border border-[#e7e5e4] rounded-xl p-5 open:bg-white transition-all">
          <summary className="font-semibold text-[#1c1917] cursor-pointer list-none flex items-center justify-between">
            <span>How do fuel prices in {cityCap} compare to other cities?</span>
            <span className="text-[#a8a29e] group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p className="mt-3 text-[#57534e] text-sm leading-relaxed">
            Our global comparison table shows fuel prices from 5 randomly selected cities worldwide,
            with prices converted to {currencySymbol} for easy comparison. Fuel prices vary significantly
            between countries due to taxes, subsidies, and supply chain differences.
            Use the search bar to explore any of 48,000+ cities in our database.
          </p>
        </details>

        <details className="group bg-[#faf9f6] border border-[#e7e5e4] rounded-xl p-5 open:bg-white transition-all">
          <summary className="font-semibold text-[#1c1917] cursor-pointer list-none flex items-center justify-between">
            <span>Which fuel has the lowest CO₂ emissions in {cityCap}?</span>
            <span className="text-[#a8a29e] group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p className="mt-3 text-[#57534e] text-sm leading-relaxed">
            Electric vehicles produce the lowest CO₂ emissions per kilometer, especially when charged
            with renewable energy. Among fossil fuels, LPG produces approximately 1.51 kg CO₂/L
            (vs. 2.31 kg for gasoline and 2.68 kg for diesel). Our eco-score ranks each fuel type
            with green leaves based on combined cost efficiency and carbon footprint.
          </p>
        </details>

        <details className="group bg-[#faf9f6] border border-[#e7e5e4] rounded-xl p-5 open:bg-white transition-all">
          <summary className="font-semibold text-[#1c1917] cursor-pointer list-none flex items-center justify-between">
            <span>How accurate and up-to-date are these fuel prices?</span>
            <span className="text-[#a8a29e] group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p className="mt-3 text-[#57534e] text-sm leading-relaxed">
            Fuel prices are updated daily through our automated multi-source pipeline.
            We aggregate data from official sources including Eurostat (EU), the U.S. Energy
            Information Administration (EIA), and TheGlobalEconomy.com. Currency exchange
            rates are refreshed in real-time to ensure accurate local price conversions.
          </p>
        </details>
      </div>
    </div>
  );
}
