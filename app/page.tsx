"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CitySearch from "@/components/CitySearch";

export default function Home() {
  const router = useRouter();
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState("");

  const handleDetectLocation = async () => {
    setDetecting(true);
    setError("");
    try {
      const res = await fetch("/api/location");
      const data = await res.json();
      if (data.country && data.city) {
        router.push(`/fuel-cost/en/${data.city.toLowerCase()}`);
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
          <CitySearch lang="en" className="max-w-none" />
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
      </div>

      {/* Footer info */}
      <footer className="absolute bottom-6 text-xs text-[#a8a29e] font-mono">
        © {new Date().getFullYear()} FUELCOST.INFO • 48,000+ CITIES
      </footer>
    </div>
  );
}
