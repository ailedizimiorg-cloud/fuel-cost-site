"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { translate } from "@/lib/i18n";

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
    // Navigate to city
    router.push(`/fuel-cost/${city.country_code.toLowerCase()}/${city.slug.toLowerCase()}?lang=${lang}`);
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
      <label className="block text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
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
          className="w-full bg-gray-900 border border-gray-800 text-white rounded-lg px-4 py-2.5 text-sm outline-none focus:border-gray-600 transition duration-200"
        />
        {isLoading && (
          <div className="absolute right-3 top-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
          </div>
        )}
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div className="absolute z-50 w-full mt-1.5 bg-gray-950 border border-gray-800 rounded-lg shadow-xl max-h-64 overflow-y-auto">
          {results.length > 0 ? (
            results.map((city, index) => (
              <button
                key={`${city.country_code}-${city.slug}`}
                onClick={() => handleSelect(city)}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full text-left px-4 py-2.5 text-sm transition duration-150 flex items-center justify-between ${
                  index === selectedIndex ? "bg-gray-900 text-white font-medium animate-none" : "text-gray-300"
                }`}
              >
                <span>{city.name}</span>
                <span className="text-xs text-gray-500 uppercase font-mono px-2 py-0.5 bg-gray-900 border border-gray-800 rounded">
                  {city.country_code}
                </span>
              </button>
            ))
          ) : (
            !isLoading && (
              <div className="px-4 py-3 text-sm text-gray-500">
                {translate(lang, "searchNoResults")}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
