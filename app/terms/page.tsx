import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — FuelCost.info",
  description: "Terms of service for FuelCost.info: acceptable use, disclaimers, intellectual property, third-party links, and limitation of liability.",
  alternates: { canonical: "https://fuelcost.info/terms" },
  openGraph: {
    title: "Terms of Service — FuelCost.info",
    description: "Our terms of service covering acceptable use, disclaimers, and liability.",
    url: "https://fuelcost.info/terms",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">FuelCost.info</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Terms of Service</span>
      </nav>

      <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 8, 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using FuelCost.info, you accept and agree to be bound by these
            Terms of Service. If you do not agree with any part of these terms, you must not
            use our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
          <p>
            FuelCost.info provides a free fuel price comparison tool that displays real-time
            gasoline, diesel, LPG, and electric vehicle charging prices across 48,000+ cities
            worldwide. The service includes a trip cost calculator, eco-score ratings, and
            a fuel price blog. All features are provided on an "as is" and "as available" basis.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Accuracy Disclaimer</h2>
          <p className="mb-3">
            While we source our fuel price data from official government agencies (Eurostat,
            U.S. EIA, national energy ministries) and update it daily, we cannot guarantee
            100% accuracy at all times. Fuel prices at individual stations may vary due to:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Station-level pricing strategies and brand premiums</li>
            <li>Temporary promotions, discounts, and loyalty programs</li>
            <li>Time-of-day pricing at some stations</li>
            <li>Local taxes and fees not reflected in national averages</li>
            <li>Exchange rate fluctuations between updates</li>
          </ul>
          <p className="mt-3">
            FuelCost.info is a comparison and research tool, not a definitive source for
            pump prices. Always verify prices at your local station before making purchasing
            decisions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Use automated scripts, bots, or scrapers to extract data from the website</li>
            <li>Attempt to bypass rate limits or access controls</li>
            <li>Use the website for any unlawful purpose</li>
            <li>Interfere with or disrupt the website's operation</li>
            <li>Misrepresent your location to manipulate price data</li>
            <li>Redistribute our fuel price data without attribution and permission</li>
          </ul>
          <p className="mt-3">
            We reserve the right to block access to any user violating these terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Intellectual Property</h2>
          <p className="mb-3">
            The FuelCost.info website, including its design, logo, code, and original content
            (blog posts, guides, eco-score methodology), is protected by copyright and
            intellectual property laws.
          </p>
          <p>
            Fuel price data itself is factual information sourced from public government
            databases and is not subject to our copyright. However, our compilation,
            organization, and presentation of this data is protected. You may reference and
            quote our content with proper attribution and a link back to FuelCost.info.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Third-Party Links and Content</h2>
          <p>
            Our website may contain links to third-party websites (e.g., Google Ads, government
            data sources). We do not control and are not responsible for the content, privacy
            policies, or practices of any third-party sites. Clicking on third-party links is
            at your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, FuelCost.info and its operators
            shall not be liable for any direct, indirect, incidental, consequential, or punitive
            damages arising from: your use or inability to use the website, inaccuracies in
            fuel price data, decisions made based on information provided on the website,
            or interruptions or errors in service. Your sole remedy for dissatisfaction with
            the website is to stop using it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Advertising and Monetization</h2>
          <p>
            FuelCost.info displays advertisements through Google AdSense. We do not endorse
            any advertised products or services. Advertisements are clearly distinguished from
            our content. We reserve the right to modify our monetization approach at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Service at any time. Changes will be
            posted on this page with an updated date. Your continued use of the website after
            changes constitutes acceptance of the modified terms. We recommend reviewing this
            page periodically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Termination</h2>
          <p>
            We may terminate or suspend your access to FuelCost.info immediately, without prior
            notice, for any violation of these Terms of Service. All provisions that by their
            nature should survive termination will survive, including ownership provisions,
            warranty disclaimers, and limitations of liability.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">11. Governing Law</h2>
          <p>
            These Terms shall be governed by the laws applicable to the jurisdiction where the
            website operator resides, without regard to conflict of law provisions. Any disputes
            shall be resolved through binding arbitration where required by applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">12. Contact</h2>
          <p>
            For questions about these Terms of Service, visit our{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
