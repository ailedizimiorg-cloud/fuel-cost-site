import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to Use FuelCost.info — Complete Guide",
  description: "Step-by-step guide to comparing fuel prices, using the trip cost calculator, understanding eco-scores, and getting the most out of FuelCost.info.",
  alternates: { canonical: "https://fuelcost.info/how-to-use" },
  openGraph: {
    title: "How to Use FuelCost.info — Complete Guide",
    description: "Step-by-step guide to comparing fuel prices and using the trip cost calculator.",
    url: "https://fuelcost.info/how-to-use",
    type: "website",
    images: [{ url: "https://fuelcost.info/og-image.png", width: 1200, height: 630, alt: "FuelCost.info" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Use FuelCost.info",
  description: "Step-by-step guide to comparing fuel prices across 48,000+ cities worldwide.",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose a City", text: "Use the search bar on the homepage or browse by country to select any of 48,000+ cities." },
    { "@type": "HowToStep", position: 2, name: "Select Currency", text: "Prices are automatically shown in your local currency. Change currency using the dropdown." },
    { "@type": "HowToStep", position: 3, name: "Compare Fuel Types", text: "View side-by-side prices for gasoline, diesel, LPG, and EV charging." },
    { "@type": "HowToStep", position: 4, name: "Use the Calculator", text: "Enter distance and fuel consumption to calculate your trip cost for each fuel type." },
    { "@type": "HowToStep", position: 5, name: "Check Eco-Scores", text: "Compare environmental impact using the leaf-based eco-score rating system." },
  ],
};

export default function HowToUsePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">FuelCost.info</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">How to Use</span>
      </nav>

      <h1 className="text-4xl font-bold mb-4">How to Use FuelCost.info</h1>
      <p className="text-lg text-gray-600 mb-10">
        Get the most out of our fuel price comparison tool with this quick guide.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Step-by-Step Guide</h2>

        <div className="space-y-8">
          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-2">1. Find Your City</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Use the search bar on the homepage to find any city. Start typing and suggestions
              will appear instantly. You can search by city name or browse cities within a specific country.
            </p>
            <p className="text-sm text-gray-500">
              Tip: If your exact city is not listed, try the nearest major city — fuel prices
              are typically consistent within a 50-100 km radius.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-2">2. View Fuel Prices</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Each city page shows real-time prices for four fuel types: gasoline, diesel,
              LPG (autogas), and electric vehicle charging (per kWh). Prices are displayed in
              your local currency with automatic conversion.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
              <li>Green highlight = cheapest fuel type for that city</li>
              <li>Price per liter for liquid fuels, per kWh for electricity</li>
              <li>Tap any fuel card for detailed cost breakdown</li>
            </ul>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-2">3. Use the Trip Cost Calculator</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              The built-in calculator estimates your fuel cost for any trip. Enter:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600 mb-3">
              <li><strong>Distance</strong> — in kilometers or miles</li>
              <li><strong>Consumption</strong> — your car's fuel economy (L/100km or MPG)</li>
              <li><strong>Fuel type</strong> — gasoline, diesel, LPG, or electric</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              The calculator instantly shows your total trip cost and cost per kilometer/mile
              for all four fuel types side by side.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-2">4. Compare Cities Worldwide</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Each city page includes a global comparison table showing prices from 5 random
              cities around the world. This helps you understand how your city's prices compare
              globally.
            </p>
            <p className="text-sm text-gray-500">
              Tip: Prices vary dramatically — gasoline in Venezuela can be 50x cheaper than
              in Hong Kong. Use the comparison table to find extremes and patterns.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="font-semibold text-xl mb-2">5. Understand the Eco-Score</h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Our eco-score ranks each fuel type from 1-5 green leaves based on:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
              <li>CO₂ emissions per kilometer</li>
              <li>Cost efficiency (cost per km)</li>
              <li>Renewable energy share (for electricity)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              5 leaves = best environmental choice. EV charging from renewable-heavy grids
              typically scores highest, followed by LPG, then gasoline, then diesel.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12 border-t pt-10">
        <h2 className="text-2xl font-semibold mb-6">Tips & Tricks</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: "Bookmark Your City", desc: "Add your city page to browser bookmarks for one-click price checks every morning." },
            { title: "Cross-Border Trips", desc: "Checking both departure and destination cities? Open two tabs side by side." },
            { title: "Fleet Planning", desc: "Logistics managers: compare diesel vs LPG across your entire route for bulk savings." },
            { title: "EV vs Gas Math", desc: "Use the calculator to see exactly how many kilometers until an EV pays for itself." },
            { title: "Currency Switch", desc: "Prices auto-convert to your local currency. Change it manually if traveling abroad." },
            { title: "Offline Planning", desc: "Screenshot city pages before trips — prices are valid for 24 hours." },
          ].map((tip) => (
            <div key={tip.title} className="border rounded-lg p-4">
              <h3 className="font-semibold mb-1">{tip.title}</h3>
              <p className="text-gray-600 text-sm">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t pt-10">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            { q: "How often are prices updated?", a: "Fuel prices are updated daily through our automated multi-source pipeline. We aggregate data from Eurostat, the U.S. EIA, and national energy ministries." },
            { q: "Why are prices different from my local station?", a: "Our prices represent national/regional averages from official sources. Individual stations may charge slightly more or less due to location, brand, and promotions." },
            { q: "How does currency conversion work?", a: "We use real-time exchange rates refreshed every hour. Prices are converted automatically to your detected currency based on IP location." },
            { q: "Is there an API available?", a: "Not yet, but we are working on it. Subscribe to our blog for announcements." },
            { q: "Can I suggest a city or data source?", a: "Absolutely! Use our contact page to suggest additions. We add new cities and data sources regularly." },
            { q: "Is FuelCost.info free?", a: "Yes, completely free. No accounts, no subscriptions, no paywalls. We may add non-intrusive advertising to cover server costs." },
          ].map((faq, i) => (
            <div key={i}>
              <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
              <p className="text-gray-700 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-lg font-medium mb-2">Ready to compare fuel prices?</p>
        <Link href="/" className="text-blue-600 hover:underline font-medium">
          Go to homepage →
        </Link>
      </div>
    </main>
  );
}
