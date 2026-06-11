"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { translate, countryToLanguage } from "@/lib/i18n";
import { getLocalizedUrl } from "@/lib/route-translations";

interface City {
  name: string;
  slug: string;
  country_code: string;
}

interface CitySearchProps {
  lang: string;
  className?: string;
}

export default function CitySearch({ lang, className = "" }: CitySearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/cities/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("Failed to fetch cities:", err);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: City) => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    // Navigate to city, using the city's country default language
    const cityLang = countryToLanguage[city.country_code] || "en";
    // Set cookie BEFORE navigation so layout uses correct language on client-side nav
    if (typeof document !== "undefined") {
      document.cookie = `preferredLanguage=${cityLang};path=/;max-age=31536000;SameSite=Lax`;
    }
    router.push(getLocalizedUrl(cityLang, city.slug.toLowerCase()));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full max-w-md ${className}`}>
      <label className="block text-xs text-[#57534e] font-semibold uppercase tracking-wider mb-2">
        {translate(lang, "searchTitle")}
      </label>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={translate(lang, "searchPlaceholder")}
          className="w-full bg-white border border-[#e7e5e4] text-[#1c1917] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#a8a29e] transition duration-200 shadow-sm placeholder-[#a8a29e]"
        />
        {isLoading && (
          <div className="absolute right-3 top-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#78716c] border-t-transparent"></div>
          </div>
        )}
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-[#e7e5e4] rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.length > 0 ? (
            results.map((city, index) => (
              <button
                key={`${city.country_code}-${city.slug}`}
                onClick={() => handleSelect(city)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left px-4 py-2.5 text-sm transition duration-150 flex items-center justify-between cursor-pointer ${
                  index === selectedIndex ? "bg-[#f5f4f0] text-[#1c1917] font-semibold animate-none" : "text-[#44403c] hover:bg-[#faf9f6]"
                }`}
              >
                <span>{city.name}</span>
                <span className="text-xs text-[#57534e] uppercase font-mono px-2 py-0.5 bg-[#f5f4f0] border border-[#e7e5e4] rounded">
                  {city.country_code}
                </span>
              </button>
            ))
          ) : (
            !isLoading && (
              <div className="px-4 py-3 text-sm text-[#78716c]">
                {translate(lang, "searchNoResults")}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
