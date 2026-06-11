import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About FuelCost.info — Our Mission & Data Sources",
  description: "FuelCost.info compares real-time gasoline, diesel, LPG, and EV charging prices across 48,000+ cities. Learn about our data sources, methodology, and mission to make fuel pricing transparent.",
  alternates: { canonical: "https://fuelcost.info/about" },
  openGraph: {
    title: "About FuelCost.info — Our Mission & Data Sources",
    description: "Learn about our data sources, methodology, and mission to make fuel pricing transparent worldwide.",
    url: "https://fuelcost.info/about",
    type: "website",
    images: [{ url: "https://fuelcost.info/og-image.svg", width: 1200, height: 630, alt: "FuelCost.info" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About FuelCost.info",
  description: "Compare real-time gasoline, diesel, LPG, and EV charging prices across 48,000+ cities worldwide.",
  url: "https://fuelcost.info/about",
  isPartOf: {
    "@type": "WebSite",
    name: "FuelCost.info",
    url: "https://fuelcost.info",
  },
};

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">FuelCost.info</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">About</span>
      </nav>

      <h1 className="text-4xl font-bold mb-4">About FuelCost.info</h1>
      <p className="text-lg text-gray-600 mb-10">
        Making global fuel prices transparent, accessible, and easy to compare — one city at a time.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Fuel prices affect every driver, every family budget, and every economy. Yet finding accurate,
          up-to-date fuel prices across different cities and countries is surprisingly difficult.
          FuelCost.info solves this problem by aggregating real-time fuel price data from official
          government sources and presenting it in a simple, comparable format.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Whether you are planning a road trip across Europe, comparing living costs between cities,
          or researching energy market trends, FuelCost.info gives you the data you need in seconds.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">What We Cover</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { title: "48,000+ Cities", desc: "Every major city worldwide, from New York to Istanbul to Tokyo." },
            { title: "4 Fuel Types", desc: "Gasoline, diesel, LPG (autogas), and electric vehicle charging costs." },
            { title: "160+ Currencies", desc: "Automatic conversion to your local currency with real-time exchange rates." },
            { title: "Daily Updates", desc: "Prices refreshed daily from official government and energy agency sources." },
            { title: "Eco-Score Ranking", desc: "Environmental impact rating based on CO₂ emissions per fuel type." },
            { title: "Cost Calculator", desc: "Built-in trip cost calculator with customizable consumption and distance." },
          ].map((item) => (
            <div key={item.title} className="border rounded-lg p-5">
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Data Sources & Methodology</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We aggregate fuel price data from multiple official sources to ensure accuracy and coverage:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li><strong>Eurostat</strong> — Weekly fuel price data for all EU member states, updated every Monday.</li>
          <li><strong>U.S. Energy Information Administration (EIA)</strong> — Weekly retail gasoline and diesel prices for all U.S. regions.</li>
          <li><strong>TheGlobalEconomy.com</strong> — Cross-validated fuel price indices for 150+ countries.</li>
          <li><strong>National Energy Ministries</strong> — Direct feeds from government price observatories where available.</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mb-4">
          Prices are normalized to a common unit (price per liter for liquid fuels, price per kWh for electricity)
          and converted to your chosen currency using real-time exchange rates. Our automated pipeline runs
          daily to ensure the data you see is always current.
        </p>
        <p className="text-sm text-gray-500 italic">
          Note: Prices may vary slightly from what you see at the pump due to local station-level pricing
          differences, temporary promotions, and exchange rate fluctuations. We recommend using our data
          for comparison and budgeting purposes rather than as a guaranteed pump price.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Why Compare Fuel Prices?</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            <strong>Cross-border travel:</strong> Fuel prices can vary by 50-100% between neighboring
            countries. Knowing where to fill up can save hundreds of euros on a single road trip.
          </p>
          <p>
            <strong>Cost of living comparison:</strong> When evaluating cities for relocation, fuel
            costs are a significant monthly expense that many comparison sites overlook.
          </p>
          <p>
            <strong>Fleet management:</strong> Logistics companies operating across multiple countries
            can optimize refueling stops to reduce operational costs.
          </p>
          <p>
            <strong>EV transition planning:</strong> Compare electricity vs. gasoline costs per kilometer
            to calculate the break-even point for switching to an electric vehicle.
          </p>
        </div>
      </section>

      <section className="border-t pt-10">
        <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          FuelCost.info is committed to:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
          <li><strong>Accuracy:</strong> We cross-validate data from multiple sources before publishing.</li>
          <li><strong>Transparency:</strong> Our data sources are publicly documented. No hidden adjustments.</li>
          <li><strong>Accessibility:</strong> All data is freely available, with no paywalls or subscription requirements.</li>
          <li><strong>Privacy:</strong> We collect minimal data. No accounts required. No tracking beyond standard analytics.</li>
        </ul>
      </section>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-lg font-medium mb-2">Start comparing fuel prices now</p>
        <Link href="/" className="text-blue-600 hover:underline font-medium">
          Search 48,000+ cities →
        </Link>
      </div>
    </main>
  );
}
