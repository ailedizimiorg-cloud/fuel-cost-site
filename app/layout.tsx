
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { translate, getLanguageFromHeaders, countryToLanguage } from "@/lib/i18n";
import { getLocalizedUrl } from "@/lib/route-translations";
import "./globals.css";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FuelCost.info",
  url: "https://fuelcost.info",
  description: "Compare real-time gasoline, diesel, LPG, and EV charging prices across 48,000+ cities worldwide.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://fuelcost.info/yakit-maliyeti/tr/{search_term}",
    "query-input": "required name=search_term",
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
  metadataBase: new URL("https://fuelcost.info"),
  title: {
    default: "FuelCost.info — Compare Gasoline, Diesel, LPG & EV Prices Across 48,000+ Cities",
    template: "%s | FuelCost.info",
  },
  description:
    "Compare real-time gasoline, diesel, LPG, and electric vehicle charging costs across 48,000+ cities worldwide. Automatic currency conversion and eco-score comparison.",
  keywords: [
    "fuel prices",
    "gasoline prices",
    "diesel prices",
    "LPG prices",
    "EV charging costs",
    "fuel cost calculator",
    "compare fuel prices worldwide",
  ],
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
    title: "FuelCost.info — Compare Global Fuel Prices",
    description:
      "Compare real-time fuel prices across 48,000+ cities. Gasoline, diesel, LPG, and EV charging costs with automatic currency conversion.",
    url: "https://fuelcost.info",
    siteName: "FuelCost.info",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://fuelcost.info/og-image.svg",
        width: 1200,
        height: 630,
        alt: "FuelCost.info — Compare Global Fuel Prices",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FuelCost.info — Compare Global Fuel Prices",
    description:
      "Compare real-time fuel prices across 48,000+ cities. Gasoline, diesel, LPG, and EV charging costs.",
    images: ["https://fuelcost.info/og-image.svg"],
    creator: "@fuelcostinfo",
  },
  verification: {
    google: "ADD_YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE_HERE",
  },
  other: {
    "script:ld+json:website": JSON.stringify(websiteSchema),
    "script:ld+json:org": JSON.stringify(orgSchema),
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Detect language priority:
  // 1. URL locale (x-page-locale header from proxy for city pages)
  // 2. preferredLanguage cookie (manual user selection)
  // 3. IP country / Accept-Language header
  // 4. default "en"
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") || "en";
  const vercelCountry = headersList.get("x-vercel-ip-country") || "";
  const pageLocale = headersList.get("x-page-locale");

  // x-invoke-path = the actual rendered path; set even on client-side navigations
  // (unlike x-page-locale which is only set by middleware on full page loads).
  // Parse locale from URL path segments: /fuel-cost/en/london → "en"
  const invokePath = headersList.get("x-invoke-path") || "";
  const invokeSegments = invokePath.split("/").filter(Boolean);
  // City page paths have 3+ segments: [localizedSeg, langCode, city]
  const pathLocaleFromUrl = invokeSegments.length >= 3 ? invokeSegments[1] : null;

  const supportedLangs = ["en","tr","de","fr","es","it","pt","ru","zh","ja","ko","nl","pl","ar","id","vi","hi","uk","ro","sv","no","da","fi","el","cs"];
  const pathLang = pageLocale && supportedLangs.includes(pageLocale) ? pageLocale : null;
  const urlPathLang = pathLocaleFromUrl && supportedLangs.includes(pathLocaleFromUrl) ? pathLocaleFromUrl : null;

  const cookieHeader = headersList.get("cookie") || "";
  const cookieLang = cookieHeader.match(/preferredLanguage=([^;]+)/)?.[1];
  const cookieLangValid = cookieLang && supportedLangs.includes(cookieLang) ? cookieLang : null;

  // Priority: middleware header → URL path segments (client-side nav) → cookie → geo/accept-lang → "en"
  const lang = pathLang || urlPathLang || cookieLangValid || getLanguageFromHeaders(acceptLanguage, vercelCountry) || "en";

  const t = (key: string, placeholders: Record<string, string | number> = {}) =>
    translate(lang, key, placeholders);

  return (
    <html lang={lang}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3572134692687784"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans text-[#171717] bg-[#ffffff] min-h-screen flex flex-col">
        {/* JSON-LD structured data — placed in body for reliable render */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />

        <nav className="p-6 border-b border-[#ebebeb] flex justify-between items-center">
          <Link
            href="/"
            className="font-semibold text-lg hover:text-blue-600 transition-colors"
          >
            FuelCost.info
          </Link>
          <div className="flex items-center gap-4">
            <div className="space-x-4 text-sm font-medium">
              <Link href="/">{t("home")}</Link>
              <Link href="/blog">{t("blog") || "Blog"}</Link>
              <Link href="/how-to-use">{t("howToUse")}</Link>
              <Link href="/about">{t("about") || "About"}</Link>
            </div>
          </div>
        </nav>
        <main className="flex-grow">{children}</main>

        <footer className="border-t border-[#ebebeb] bg-gray-50">
          <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-sm mb-4 text-[#171717]">
                FuelCost.info
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/about" className="hover:text-blue-600">
                    {t("about") || "About"}
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-blue-600">
                    {t("blog") || "Blog"}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-blue-600">
                    {t("contact") || "Contact"}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-4 text-[#171717]">
                {t("resources")}
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/how-to-use" className="hover:text-blue-600">
                    {t("howToUse")}
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-blue-600">
                    {t("faq") || "FAQ"}
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="hover:text-blue-600">
                    {t("sitemap") || "Sitemap"}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-4 text-[#171717]">
                {t("legal")}
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="/privacy" className="hover:text-blue-600">
                    {t("privacyPolicy")}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-blue-600">
                    {t("termsOfService")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-4 text-[#171717]">
                {t("popular")}
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link
                    href={getLocalizedUrl(countryToLanguage["TR"] || "tr", "istanbul")}
                    className="hover:text-blue-600"
                  >
                    {t("istanbulPrices")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={getLocalizedUrl(countryToLanguage["US"] || "en", "new-york")}
                    className="hover:text-blue-600"
                  >
                    {t("newYorkPrices")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={getLocalizedUrl(countryToLanguage["GB"] || "en", "london")}
                    className="hover:text-blue-600"
                  >
                    {t("londonPrices")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={getLocalizedUrl(countryToLanguage["DE"] || "de", "berlin")}
                    className="hover:text-blue-600"
                  >
                    {t("berlinPrices")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#ebebeb] py-6 text-center text-sm text-gray-500">
            <p>
              © {new Date().getFullYear()} FuelCost.info — {t("copyright")}
            </p>
            <p className="mt-1">
              <Link href="/privacy" className="hover:text-blue-600">
                {t("privacy")}
              </Link>
              <span className="mx-2">·</span>
              <Link href="/terms" className="hover:text-blue-600">
                {t("terms")}
              </Link>
              <span className="mx-2">·</span>
              <Link href="/sitemap" className="hover:text-blue-600">
                {t("sitemap") || "Sitemap"}
              </Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
