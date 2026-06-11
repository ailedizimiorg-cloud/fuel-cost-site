"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CitySearch from "@/components/CitySearch";
import { countryToLanguage } from "@/lib/i18n";
import { getLocalizedUrl } from "@/lib/route-translations";

function getCookieLang(): string {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)preferredLanguage=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "en";
}

export default function Home() {
  const router = useRouter();
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState("");
  const [pageLang, setPageLang] = useState("en");

  useEffect(() => {
    setPageLang(getCookieLang());
  }, []);

  const handleDetectLocation = async () => {
    setDetecting(true);
    setError("");
    try {
      const res = await fetch("/api/location");
      const data = await res.json();
      if (data.country && data.city) {
        const detectedLang = countryToLanguage[data.country] || "en";
        const url = getLocalizedUrl(detectedLang, data.city.toLowerCase());
        if (typeof document !== "undefined") {
          document.cookie = `preferredLanguage=${detectedLang};path=/;max-age=31536000;SameSite=Lax`;
        }
        window.location.href = url;
      } else {
        setError("Could not detect location. Please use the search bar.");
        setDetecting(false);
      }
    } catch (err) {
      console.error("Failed to detect location:", err);
      setError("Failed to connect to location service. Please use search.");
      setDetecting(false);
    }
  };

  // Try auto-detecting once on load, but don't block the UI
  useEffect(() => {
    // Optionally trigger auto-detect, or just let them select.
    // Let's trigger it automatically but without locking the screen.
    handleDetectLocation();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#faf9f6] text-[#1c1917] px-6">
      <div className="w-full max-w-lg text-center">
        {/* Branding */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-2xl font-bold tracking-tight text-[#1c1917] border border-[#d6d3d1] px-3 py-1 bg-white rounded-lg font-mono shadow-sm">
            FUELCOST.INFO
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-[#1c1917]">
          Global Fuel Prices
        </h1>
        <p className="text-[#6b6661] text-base md:text-lg mb-8 leading-relaxed">
          Compare gasoline, diesel, LPG, and electric vehicle costs across 48,000+ cities with real-time currency conversion.
        </p>

        {/* Search */}
        <div className="bg-white border border-[#e7e5e4] rounded-xl p-6 mb-6 shadow-sm text-left">
          <CitySearch lang={pageLang} className="max-w-none" />
        </div>

        {/* Quick Actions / Status */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-[#78716c]">
          <button
            onClick={handleDetectLocation}
            disabled={detecting}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1c1917] text-white font-semibold rounded-lg hover:bg-[#2e2a24] transition duration-150 active:scale-95 disabled:opacity-50 shadow-sm cursor-pointer"
          >
            {detecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Detecting Location...
              </>
            ) : (
              "📍 Detect My Location"
            )}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-xs text-red-600 font-medium">
            {error}
          </p>
        )}

        {/* How It Works */}
        <h2 className="text-2xl font-semibold mt-16 mb-6 text-center text-[#1c1917]">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-[#e7e5e4] rounded-xl p-6 text-left shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-[#1c1917]">1. Search a City</h3>
            <p className="text-sm text-[#6b6661]">Type any city name to find real-time fuel prices — gasoline, diesel, LPG, and EV charging.</p>
          </div>
          <div className="bg-white border border-[#e7e5e4] rounded-xl p-6 text-left shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-[#1c1917]">2. Compare Costs</h3>
            <p className="text-sm text-[#6b6661]">See prices side-by-side with automatic currency conversion. Use the built-in cost calculator.</p>
          </div>
          <div className="bg-white border border-[#e7e5e4] rounded-xl p-6 text-left shadow-sm">
            <h3 className="font-semibold text-lg mb-2 text-[#1c1917]">3. Plan Your Trip</h3>
            <p className="text-sm text-[#6b6661]">Route planner with real fuel costs, CO₂ estimates, and eco-score for every fuel type.</p>
          </div>
        </div>

        {/* Popular Cities */}
        <h2 className="text-2xl font-semibold mb-6 text-center text-[#1c1917]">
          Popular Cities
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {["istanbul", "london", "new-york", "berlin", "paris", "tokyo", "dubai", "sydney"].map((city) => (
            <a
              key={city}
              href={`/fuel-cost/en/${city}`}
              className="bg-white border border-[#e7e5e4] rounded-lg px-4 py-3 text-sm font-medium text-[#1c1917] hover:border-[#a8a29e] hover:bg-[#f5f4f0] transition-all text-center shadow-sm"
            >
              {city.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
            </a>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <footer className="absolute bottom-6 text-xs text-[#a8a29e] font-mono">
        © {new Date().getFullYear()} FUELCOST.INFO • 48,000+ CITIES
      </footer>
    </div>
  );
}
