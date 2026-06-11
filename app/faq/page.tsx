import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — FuelCost.info",
  description: "Answers to common questions about fuel prices, our data sources, accuracy, currency conversion, and how to use FuelCost.info effectively.",
  alternates: { canonical: "https://fuelcost.info/faq" },
  openGraph: {
    title: "Frequently Asked Questions — FuelCost.info",
    description: "Answers to common questions about fuel prices, data sources, and using FuelCost.info.",
    url: "https://fuelcost.info/faq",
    type: "website",
    images: [{ url: "https://fuelcost.info/og-image.svg", width: 1200, height: 630, alt: "FuelCost.info" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How often are fuel prices updated on FuelCost.info?", acceptedAnswer: { "@type": "Answer", text: "Fuel prices are updated daily through our automated multi-source pipeline. We aggregate data from Eurostat (EU), U.S. Energy Information Administration (EIA), and national energy ministries." } },
    { "@type": "Question", name: "Where does FuelCost.info get its data?", acceptedAnswer: { "@type": "Answer", text: "We collect fuel price data from official government sources including Eurostat for EU countries, the U.S. EIA for American prices, TheGlobalEconomy.com for global coverage, and direct feeds from national energy price observatories." } },
    { "@type": "Question", name: "How accurate are the prices shown?", acceptedAnswer: { "@type": "Answer", text: "Our data comes from official government sources and is generally accurate to within 2-5% of actual pump prices. However, individual stations may vary due to location, brand markup, and temporary promotions. Use our data for comparison and budgeting." } },
    { "@type": "Question", name: "How does currency conversion work?", acceptedAnswer: { "@type": "Answer", text: "We use real-time exchange rates refreshed every hour. When you visit a city page, prices automatically convert to your local currency based on your IP location. You can manually override the currency." } },
    { "@type": "Question", name: "Is FuelCost.info free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes, FuelCost.info is completely free. No account registration, no subscription fees, no paywalls. We display non-intrusive advertisements to cover operational costs." } },
    { "@type": "Question", name: "How many cities are in the database?", acceptedAnswer: { "@type": "Answer", text: "Our database contains over 48,000 cities worldwide, covering every country and territory. We continuously add new cities and update existing data." } },
    { "@type": "Question", name: "What fuel types do you track?", acceptedAnswer: { "@type": "Answer", text: "We track gasoline (petrol), diesel, LPG (autogas/liquefied petroleum gas), and electric vehicle charging costs (per kWh). This covers the four most common vehicle energy sources worldwide." } },
    { "@type": "Question", name: "What is the eco-score?", acceptedAnswer: { "@type": "Answer", text: "The eco-score ranks each fuel type from 1 to 5 green leaves based on CO₂ emissions per kilometer, cost efficiency, and renewable energy share (for electricity). More leaves indicate a better environmental choice." } },
    { "@type": "Question", name: "Can I suggest a city or data source?", acceptedAnswer: { "@type": "Answer", text: "Yes! Visit our Contact page to suggest new cities, report inaccuracies, or recommend additional data sources. We review all suggestions." } },
    { "@type": "Question", name: "Do you have an API?", acceptedAnswer: { "@type": "Answer", text: "A public API is under development. Subscribe to our blog or check back for announcements. In the meantime, all data is freely accessible on the website." } },
  ],
};

export default function FaqPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">FuelCost.info</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">FAQ</span>
      </nav>

      <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
      <p className="text-lg text-gray-600 mb-10">
        Everything you need to know about FuelCost.info, our data, and how to get the most out of our fuel price comparison tool.
      </p>

      <div className="space-y-8">
        {[
          {
            q: "How often are fuel prices updated?",
            a: "Fuel prices are updated daily through our automated multi-source pipeline. We aggregate data from Eurostat (EU weekly bulletins, published every Monday), the U.S. Energy Information Administration (EIA weekly retail prices), TheGlobalEconomy.com, and direct feeds from national energy ministries. The data pipeline runs automatically every 24 hours."
          },
          {
            q: "Where does the data come from?",
            a: "We source fuel price data exclusively from official government and intergovernmental organizations: Eurostat for all 27 EU member states plus EFTA countries, the U.S. Energy Information Administration for American states and regions, TheGlobalEconomy.com for cross-validated global price indices covering 150+ countries, and national energy price observatories where direct API feeds are available. We do not scrape unofficial sources or user-submitted data."
          },
          {
            q: "How accurate are the prices?",
            a: "Since our data comes from official government sources, accuracy is generally within 2-5% of actual pump prices at major station chains. However, individual stations can vary by 5-15% due to: location (highway vs. city center), brand premium (Shell vs. discount chains), temporary promotions and loyalty card discounts, and local taxes that differ within countries (e.g., U.S. state taxes). Use our data for comparison, budgeting, and trend analysis rather than as a guaranteed pump price."
          },
          {
            q: "How does currency conversion work?",
            a: "Exchange rates are updated in real-time from open financial data feeds. When you visit a city page, we detect your likely currency based on IP geolocation and automatically convert all prices. You can manually change the currency using the dropdown on any city page. The conversion uses the mid-market rate — the rate banks use when trading among themselves — which is the fairest possible rate."
          },
          {
            q: "Is the site really free?",
            a: "Yes, completely free. No account registration required. No subscription tiers. No paywalls on any feature — you can search every city, use the trip calculator, and view all fuel types without paying anything. We display non-intrusive Google AdSense advertisements to cover server hosting and data pipeline costs. We will never sell your data or require payment for basic access."
          },
          {
            q: "Which countries and cities are covered?",
            a: "Our database covers 48,000+ cities across every country and territory in the world — from Afghanistan to Zimbabwe. Major cities have the most complete data (all four fuel types with daily updates). Smaller cities may show regional or national averages for some fuel types. We continuously expand coverage and add new data sources."
          },
          {
            q: "What fuel types do you track?",
            a: "We track four vehicle energy sources: Gasoline (petrol, benzin) — the most common fuel worldwide, Diesel (motorin, gasoil) — popular in Europe and for commercial vehicles, LPG (autogas, GPL) — liquefied petroleum gas, widely used in Turkey, Poland, Italy, and South Korea, and Electric vehicle charging — price per kWh for home and public charging, where data is available. We plan to add CNG (compressed natural gas) in a future update."
          },
          {
            q: "How does the eco-score work?",
            a: "The eco-score rates each fuel type from 1 to 5 green leaves (🍃) based on three factors: CO₂ emissions per kilometer driven (primary weight), cost per kilometer (secondary weight, because expensive clean fuel is still inaccessible), and renewable share in the electricity grid (for EV charging only). The formula: more leaves = better combined environmental and economic score. Typically EV charging scores highest (4-5 leaves), followed by LPG (3-4), gasoline (2-3), and diesel (1-2).",
          },
          {
            q: "How does the trip cost calculator work?",
            a: "Enter your trip distance (km or miles) and your vehicle's fuel consumption (L/100km, km/L, or MPG). The calculator multiplies distance × consumption rate × fuel price to give you a total trip cost for each fuel type. It also shows cost per kilometer/mile and highlights the cheapest option. For EVs, consumption is measured in kWh/100km and multiplied by the electricity price."
          },
          {
            q: "Can I contribute or suggest improvements?",
            a: "We welcome suggestions. Use our Contact page to: suggest new cities for coverage, report outdated or incorrect prices, recommend additional official data sources, or request new features (API access, mobile app, new fuel types). All suggestions are reviewed by our team."
          },
          {
            q: "Do you track historical price trends?",
            a: "We are actively building a historical price database. Currently, city pages show current daily prices. Our blog publishes trend analysis and long-term price comparisons. A historical price chart feature is on our roadmap — check the blog for updates."
          },
          {
            q: "What about fuel taxes and subsidies?",
            a: "The prices shown on FuelCost.info are the final consumer prices including all applicable taxes (VAT, excise duties, carbon taxes) and subsidies. This gives you the real cost at the pump. Countries with high fuel taxes (e.g., Netherlands, Norway) will naturally show higher prices, while subsidized markets (e.g., Venezuela, Saudi Arabia) will show significantly lower prices."
          },
        ].map((faq, i) => (
          <div key={i} className="border-b pb-6 last:border-b-0">
            <h2 className="font-semibold text-xl mb-3">{faq.q}</h2>
            <p className="text-gray-700 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-lg font-medium mb-2">Didn't find your answer?</p>
        <Link href="/contact" className="text-blue-600 hover:underline font-medium">
          Contact us →
        </Link>
      </div>
    </main>
  );
}
