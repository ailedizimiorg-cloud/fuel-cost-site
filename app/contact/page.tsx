import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us — FuelCost.info",
  description: "Contact FuelCost.info for questions, suggestions, data corrections, city requests, partnership inquiries, or press.",
  alternates: { canonical: "https://fuelcost.info/contact" },
  openGraph: {
    title: "Contact Us — FuelCost.info",
    description: "Get in touch with the FuelCost.info team for any questions or suggestions.",
    url: "https://fuelcost.info/contact",
    type: "website",
    images: [{ url: "https://fuelcost.info/og-image.svg", width: 1200, height: 630, alt: "FuelCost.info" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact FuelCost.info",
  description: "Contact FuelCost.info for questions, suggestions, and data corrections regarding fuel price comparisons across 48,000+ cities worldwide.",
  url: "https://fuelcost.info/contact",
  isPartOf: {
    "@type": "WebSite",
    name: "FuelCost.info",
    url: "https://fuelcost.info",
  },
};

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">FuelCost.info</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Contact</span>
      </nav>

      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg text-gray-600 mb-10">
        Questions, suggestions, or corrections? We'd love to hear from you.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">General Inquiries</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            For general questions about FuelCost.info, how to use the site, or any other
            non-urgent matters.
          </p>
          <p className="text-gray-700">
            Email:{" "}
            <a href="mailto:contact@fuelcost.info" className="text-blue-600 hover:underline font-medium">
              contact@fuelcost.info
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-2">Response time: within 48 hours</p>
        </section>

        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Data Corrections</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Found an incorrect fuel price, missing city, or outdated information? Let us know.
            Please include the city name, fuel type, and the correct information if available.
          </p>
          <p className="text-gray-700">
            Email:{" "}
            <a href="mailto:data@fuelcost.info" className="text-blue-600 hover:underline font-medium">
              data@fuelcost.info
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-2">Response time: within 24 hours</p>
        </section>

        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Partnerships & Press</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Interested in partnering with FuelCost.info? Media inquiries, data licensing,
            API access, or collaboration proposals.
          </p>
          <p className="text-gray-700">
            Email:{" "}
            <a href="mailto:partners@fuelcost.info" className="text-blue-600 hover:underline font-medium">
              partners@fuelcost.info
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-2">Response time: within 2 business days</p>
        </section>

        <section className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">City & Feature Requests</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Suggest a new city for our database, request a new feature, or vote on upcoming
            improvements.
          </p>
          <p className="text-gray-700">
            Email:{" "}
            <a href="mailto:suggestions@fuelcost.info" className="text-blue-600 hover:underline font-medium">
              suggestions@fuelcost.info
            </a>
          </p>
          <p className="text-sm text-gray-500 mt-2">All suggestions reviewed weekly</p>
        </section>
      </div>

      <section className="border-t pt-10">
        <h2 className="text-2xl font-semibold mb-6">Before You Contact Us</h2>
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Many questions can be answered faster by checking these pages:
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { href: "/faq", label: "FAQ", desc: "Answers to common questions" },
              { href: "/how-to-use", label: "How to Use", desc: "Step-by-step guide" },
              { href: "/about", label: "About Us", desc: "Data sources and methodology" },
              { href: "/privacy", label: "Privacy Policy", desc: "Data handling and cookies" },
              { href: "/terms", label: "Terms of Service", desc: "Usage terms and disclaimers" },
              { href: "/blog", label: "Blog", desc: "Fuel price trends and analysis" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <h3 className="font-semibold text-blue-600">{link.label}</h3>
                <p className="text-sm text-gray-500">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
