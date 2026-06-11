// lib/seo-schema.ts
// Schema.org JSON-LD generators for structured data

import { getLocalizedUrl } from "@/lib/route-translations";
import { countryToLanguage } from "@/lib/i18n";

export interface FuelPrices {
  gasoline_price?: number | null;
  diesel_price?: number | null;
  lpg_price?: number | null;
  electric_price?: number | null;
  currency_symbol?: string | null;
  currency_code?: string | null;
  currency?: string | null;
}

export function generateBreadcrumbSchema(
  country: string,
  city: string,
  baseUrl: string = "https://fuelcost.info"
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "FuelCost.info",
        "item": baseUrl,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${city.charAt(0).toUpperCase() + city.slice(1)}, ${country.toUpperCase()}`,
        "item": `${baseUrl}${getLocalizedUrl(countryToLanguage[country] || "en", city.toLowerCase())}`,
      },
    ],
  };
}

export function generateProductSchemas(
  city: string,
  country: string,
  prices: FuelPrices,
  baseUrl: string = "https://fuelcost.info"
) {
  const schemas: any[] = [];
  const fuelNames: Record<string, { name: string; unit: string }> = {
    gasoline_price: { name: "Gasoline", unit: "L" },
    diesel_price: { name: "Diesel", unit: "L" },
    lpg_price: { name: "LPG (Autogas)", unit: "L" },
    electric_price: { name: "Electricity (EV Charging)", unit: "kWh" },
  };

  const currencySymbol = prices.currency_symbol || "$";
  const currencyCode = prices.currency_code || "USD";
  const priceUrl = `${baseUrl}${getLocalizedUrl(countryToLanguage[country] || "en", city.toLowerCase())}`;

  // Map our internal currency symbols to ISO codes for the schema
  const symbolToCode: Record<string, string> = {
    "₺": "TRY",
    "€": "EUR",
    "$": "USD",
    "£": "GBP",
    "¥": "JPY",
    "₽": "RUB",
    "R$": "BRL",
    "₩": "KRW",
    "₹": "INR",
    "₴": "UAH",
    "lei": "RON",
    "kr": "SEK",
    "CHF": "CHF",
    "zł": "PLN",
    "₪": "ILS",
  };
  const finalCurrencyCode = symbolToCode[currencySymbol] || currencyCode || "USD";

  Object.entries(prices).forEach(([key, value]) => {
    if (key in fuelNames && value != null && Number(value) > 0) {
      const fuel = fuelNames[key];
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": `${fuel.name} in ${city.charAt(0).toUpperCase() + city.slice(1)}, ${country.toUpperCase()}`,
        "category": "Fuel",
        "url": priceUrl,
        "offers": {
          "@type": "Offer",
          "priceCurrency": finalCurrencyCode,
          "price": Number(value).toFixed(2),
          "priceValidUntil": new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          "availability": "https://schema.org/InStock",
          "url": priceUrl,
          "unitCode": fuel.unit === "kWh" ? "KWH" : "LTR",
        },
      });
    }
  });

  return schemas;
}

export function generateFaqSchema(
  question: string,
  answer: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": answer,
        },
      },
    ],
  };
}

export function generateMultiFaqSchema(qaPairs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": qaPairs.map((pair) => ({
      "@type": "Question",
      "name": pair.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": pair.answer,
      },
    })),
  };
}

export function generateWebAppSchema(
  name: string,
  description: string,
  url: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "url": url,
  };
}
