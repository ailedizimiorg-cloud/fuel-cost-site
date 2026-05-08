
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fuel Cost Tracker",
  description: "Real-time fuel prices by location.",
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
      </head>
      <body className="font-sans text-[#171717] bg-[#ffffff] min-h-screen flex flex-col">
        <nav className="p-6 border-b border-[#ebebeb] flex justify-between items-center">
          <span className="font-semibold text-lg">FuelCost.io</span>
          <div className="space-x-4 text-sm font-medium">
            <a href="/">Home</a>
            <a href="/about">About</a>
          </div>
        </nav>
        <main className="flex-grow">{children}</main>
        <footer className="p-10 border-t border-[#ebebeb] text-sm text-[#666666] text-center">
          <p>© {new Date().getFullYear()} FuelCost.io - Daily Price Tracking</p>
        </footer>
      </body>
    </html>
  );
}
