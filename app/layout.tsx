
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FuelCost.info",
  url: "https://fuelcost.info",
  description: "Compare real-time gasoline, diesel, LPG, and EV charging prices across 48,000+ cities worldwide.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://fuelcost.info/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FuelCost.info",
  url: "https://fuelcost.info",
  description: "Global fuel price comparison tool covering 48,000+ cities.",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@fuelcost.info",
    contactType: "customer service",
  },
};

export const metadata: Metadata = {
  title: {
    default: "FuelCost.info - Compare Gasoline, Diesel, LPG & EV Prices Across 48,000+ Cities",
    template: "%s | FuelCost.info",
  },
  description: "Compare real-time gasoline, diesel, LPG, and electric vehicle charging costs across 48,000+ cities worldwide. Automatic currency conversion and eco-score comparison.",
  keywords: ["fuel prices", "gasoline prices", "diesel prices", "LPG prices", "EV charging costs", "fuel cost calculator", "compare fuel prices worldwide"],
  authors: [{ name: "FuelCost.info" }],
  creator: "FuelCost.info",
  publisher: "FuelCost.info",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://fuelcost.info",
  },
  openGraph: {
    title: "FuelCost.info - Compare Global Fuel Prices",
    description: "Compare real-time fuel prices across 48,000+ cities. Gasoline, diesel, LPG, and EV charging costs with automatic currency conversion.",
    url: "https://fuelcost.info",
    siteName: "FuelCost.info",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://fuelcost.info/og-image.png",
        width: 1200,
        height: 630,
        alt: "FuelCost.info - Compare Global Fuel Prices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FuelCost.info - Compare Global Fuel Prices",
    description: "Compare real-time fuel prices across 48,000+ cities. Gasoline, diesel, LPG, and EV charging costs.",
    images: ["https://fuelcost.info/og-image.png"],
    creator: "@fuelcostinfo",
  },
  verification: {
    google: "",
  },
  category: "utilities",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;600&display=swap" rel="stylesheet" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3572134692687784" crossOrigin="anonymous"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="font-sans text-[#171717] bg-[#ffffff] min-h-screen flex flex-col">
        <nav className="p-6 border-b border-[#ebebeb] flex justify-between items-center">
          <Link href="/" className="font-semibold text-lg hover:text-blue-600 transition-colors">
            FuelCost.info
          </Link>
          <div className="space-x-4 text-sm font-medium">
            <Link href="/">Home</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/how-to-use">How to Use</Link>
            <Link href="/about">About</Link>
          </div>
        </nav>
        <main className="flex-grow">{children}</main>

        <footer className="border-t border-[#ebebeb] bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-sm mb-4 text-[#171717]">FuelCost.info</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
                <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-4 text-[#171717]">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/how-to-use" className="hover:text-blue-600">How to Use</Link></li>
                <li><Link href="/faq" className="hover:text-blue-600">FAQ</Link></li>
                <li><Link href="/sitemap" className="hover:text-blue-600">Sitemap</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-4 text-[#171717]">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy" className="hover:text-blue-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-600">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-4 text-[#171717]">Popular</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/fuel-cost/en/istanbul" className="hover:text-blue-600">Istanbul Prices</Link></li>
                <li><Link href="/fuel-cost/en/new-york" className="hover:text-blue-600">New York Prices</Link></li>
                <li><Link href="/fuel-cost/en/london" className="hover:text-blue-600">London Prices</Link></li>
                <li><Link href="/fuel-cost/en/berlin" className="hover:text-blue-600">Berlin Prices</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#ebebeb] py-6 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} FuelCost.info — Fuel prices updated daily from official government sources.</p>
            <p className="mt-1">
              <Link href="/privacy" className="hover:text-blue-600">Privacy</Link>
              <span className="mx-2">·</span>
              <Link href="/terms" className="hover:text-blue-600">Terms</Link>
              <span className="mx-2">·</span>
              <Link href="/sitemap" className="hover:text-blue-600">Sitemap</Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
