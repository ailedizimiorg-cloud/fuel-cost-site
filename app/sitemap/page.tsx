import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sitemap — FuelCost.info",
  description: "Complete list of all pages on FuelCost.info — search fuel prices, blog, guides, legal pages, and more.",
  alternates: { canonical: "https://fuelcost.info/sitemap" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Sitemap — FuelCost.info",
    description: "Complete page directory for FuelCost.info.",
    url: "https://fuelcost.info/sitemap",
    type: "website",
  },
};

const sections = [
  {
    title: "Main Pages",
    links: [
      { href: "/", label: "Homepage — Search 48,000+ cities" },
      { href: "/blog", label: "Fuel Price Blog — Analysis & Trends" },
      { href: "/about", label: "About Us — Mission & Data Sources" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Help & Guides",
    links: [
      { href: "/how-to-use", label: "How to Use — Complete Guide" },
      { href: "/faq", label: "Frequently Asked Questions" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
  {
    title: "Popular Cities",
    links: [
      { href: "/fuel-cost/en/istanbul", label: "Istanbul Fuel Prices" },
      { href: "/fuel-cost/en/new-york", label: "New York Fuel Prices" },
      { href: "/fuel-cost/en/london", label: "London Fuel Prices" },
      { href: "/fuel-cost/en/tokyo", label: "Tokyo Fuel Prices" },
      { href: "/fuel-cost/en/berlin", label: "Berlin Fuel Prices" },
      { href: "/fuel-cost/en/paris", label: "Paris Fuel Prices" },
      { href: "/fuel-cost/en/dubai", label: "Dubai Fuel Prices" },
      { href: "/fuel-cost/en/sydney", label: "Sydney Fuel Prices" },
    ],
  },
  {
    title: "Technical",
    links: [
      { href: "/robots.txt", label: "Robots.txt" },
      { href: "/sitemap.xml", label: "XML Sitemap (for search engines)" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">FuelCost.info</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Sitemap</span>
      </nav>

      <h1 className="text-4xl font-bold mb-4">Sitemap</h1>
      <p className="text-lg text-gray-600 mb-10">
        Complete directory of all pages on FuelCost.info. Find everything in one place.
      </p>

      <div className="space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">{section.title}</h2>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-600 hover:underline text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
