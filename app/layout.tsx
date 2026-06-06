
import type { Metadata } from "next";
import "./globals.css";

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
      </head>
      <body className="font-sans text-[#171717] bg-[#ffffff] min-h-screen flex flex-col">
        <nav className="p-6 border-b border-[#ebebeb] flex justify-between items-center">
          <span className="font-semibold text-lg">FuelCost.info</span>
          <div className="space-x-4 text-sm font-medium">
            <a href="/">Home</a>
            <a href="/blog">Blog</a>
            <a href="/about">About</a>
          </div>
        </nav>
        <main className="flex-grow">{children}</main>
        <footer className="p-10 border-t border-[#ebebeb] text-sm text-[#666666] text-center">
          <p>© {new Date().getFullYear()} FuelCost.info - Daily Price Tracking</p>
        </footer>
      </body>
    </html>
  );
}
