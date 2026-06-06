import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — FuelCost.info",
  description: "FuelCost.info privacy policy: what data we collect, how we use it, cookies, Google AdSense, analytics, and your rights under GDPR.",
  alternates: { canonical: "https://fuelcost.info/privacy" },
  openGraph: {
    title: "Privacy Policy — FuelCost.info",
    description: "Our privacy policy covering data collection, cookies, and your rights.",
    url: "https://fuelcost.info/privacy",
    type: "website",
    images: [{ url: "https://fuelcost.info/og-image.png", width: 1200, height: 630, alt: "FuelCost.info" }],
  },
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">FuelCost.info</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Privacy Policy</span>
      </nav>

      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: June 8, 2026</p>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p>
            FuelCost.info ("we," "our," or "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website. By using FuelCost.info, you consent to
            the data practices described in this policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
          <h3 className="text-xl font-medium mt-4 mb-2">2.1 Automatically Collected Information</h3>
          <p>
            When you visit FuelCost.info, our servers automatically collect certain information,
            including: your IP address (used only for approximate city-level geolocation to show
            local fuel prices and currency), browser type and version, device type and operating
            system, pages visited and time spent on each page, and referring URL. This information
            is standard for virtually all websites and is used to improve our service.
          </p>
          <h3 className="text-xl font-medium mt-4 mb-2">2.2 Information You Do NOT Provide</h3>
          <p>
            FuelCost.info does not require user accounts or registration. We do not collect:
            names, email addresses, phone numbers, payment information, social media profiles,
            or any other personally identifiable information (PII).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Cookies and Tracking Technologies</h2>
          <p className="mb-3">
            We use cookies and similar tracking technologies for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Essential cookies:</strong> Required for the website to function (currency preference, language detection).</li>
            <li><strong>Analytics cookies:</strong> Google Analytics helps us understand how visitors use the site — pages visited, time on site, country-level geography.</li>
            <li><strong>Advertising cookies:</strong> Google AdSense displays advertisements and uses cookies to serve relevant ads based on browsing history.</li>
          </ul>
          <p className="mt-3">
            You can disable cookies in your browser settings. Note that some features may not
            function properly without essential cookies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Third-Party Services</h2>

          <h3 className="text-xl font-medium mt-4 mb-2">4.1 Google AdSense</h3>
          <p className="mb-3">
            We use Google AdSense to display advertisements. Google uses cookies to serve ads
            based on your prior visits to our website and other websites. Google's use of
            advertising cookies enables it and its partners to serve ads based on your visit
            to our site and/or other sites on the Internet.
          </p>
          <p>
            You may opt out of personalized advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline">Google Ads Settings</a>.
            Alternatively, you can opt out of third-party vendor cookies at{" "}
            <a href="https://www.aboutads.info/" className="text-blue-600 hover:underline">www.aboutads.info</a>.
          </p>

          <h3 className="text-xl font-medium mt-4 mb-2">4.2 Google Analytics</h3>
          <p>
            We use Google Analytics to understand website traffic and usage patterns. Google
            Analytics collects anonymized data including page views, session duration, bounce
            rate, and geographic location at country/city level. No personally identifiable
            information is transmitted to Google Analytics. You can opt out of Google Analytics
            by installing the{" "}
            <a href="https://tools.google.com/dlpage/gaoptout" className="text-blue-600 hover:underline">Google Analytics Opt-out Browser Add-on</a>.
          </p>

          <h3 className="text-xl font-medium mt-4 mb-2">4.3 Supabase</h3>
          <p>
            Our fuel price data and blog content are stored on Supabase, a cloud database
            platform. Supabase does not have access to your browsing data. Their privacy policy
            is available at{" "}
            <a href="https://supabase.com/privacy" className="text-blue-600 hover:underline">supabase.com/privacy</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. How We Use Your Information</h2>
          <p>We use automatically collected information to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Detect your approximate location to show relevant fuel prices and currency</li>
            <li>Improve website performance and user experience</li>
            <li>Analyze traffic patterns and popular content</li>
            <li>Prevent fraud and abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Data Retention</h2>
          <p>
            IP addresses used for geolocation are processed in real-time and not stored permanently.
            Analytics data is retained by Google Analytics for 26 months by default. We do not
            maintain separate logs of personally identifiable information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Your Rights (GDPR & CCPA)</h2>
          <p className="mb-3">
            If you are a resident of the European Economic Area (EEA) or California, you have
            certain data protection rights:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Right to access:</strong> Request a copy of data we hold about you.</li>
            <li><strong>Right to rectification:</strong> Correct any inaccurate data.</li>
            <li><strong>Right to erasure:</strong> Request deletion of your data.</li>
            <li><strong>Right to object:</strong> Object to processing of your personal data.</li>
            <li><strong>Right to data portability:</strong> Request transfer of your data.</li>
          </ul>
          <p className="mt-3">
            Since we collect minimal data (only IP-based geolocation and standard analytics),
            exercising these rights is straightforward. Contact us with any requests.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">8. Children's Privacy</h2>
          <p>
            FuelCost.info does not knowingly collect information from children under 13. If
            you believe a child has provided us with personal information, contact us immediately
            and we will delete it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on
            this page with an updated "Last updated" date. We encourage you to review this
            policy periodically.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">10. Contact Us</h2>
          <p>
            For questions about this Privacy Policy or to exercise your data rights, visit our{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
