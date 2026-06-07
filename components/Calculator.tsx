"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FuelPrices } from "@/lib/fuel-api";
import { translate } from "@/lib/i18n";

interface CalculatorProps {
  initialPrices: FuelPrices;
  countryCode: string;
  lang?: string;
}

interface RouteStop {
  id: string;
  name: string;
  slug: string;
  country_code: string;
  distance: number; // Distance from the previous stop
  prices: FuelPrices | null;
  lat?: number | null;
  lng?: number | null;
}

type FuelTypeKey = "gasoline_price" | "diesel_price" | "lpg_price" | "electric_price";

const fuelTypeKeys: FuelTypeKey[] = [
  "gasoline_price",
  "diesel_price",
  "lpg_price",
  "electric_price"
];

const DEFAULT_CONSUMPTIONS_METRIC: { [key: string]: number } = {
  gasoline_price: 8.0,
  diesel_price: 6.0,
  lpg_price: 10.0,
  electric_price: 18.0
};

const DEFAULT_CONSUMPTIONS_US: { [key: string]: number } = {
  gasoline_price: 29.4,
  diesel_price: 39.2,
  lpg_price: 23.5,
  electric_price: 3.5
};

const DEFAULT_CONSUMPTIONS_GB: { [key: string]: number } = {
  gasoline_price: 35.3,
  diesel_price: 47.1,
  lpg_price: 28.2,
  electric_price: 3.5
};

const CO2_EMISSIONS: { [key: string]: number } = {
  gasoline_price: 2.31, // kg CO2 per Liter
  diesel_price: 2.68,   // kg CO2 per Liter
  lpg_price: 1.51,      // kg CO2 per Liter
  electric_price: 0.40  // kg CO2 per kWh (standard grid)
};

export default function Calculator({ initialPrices, countryCode, lang }: CalculatorProps) {
  const currentLang = lang || countryCode;
  
  const defaultIsImperial = countryCode.toUpperCase() === "US" || countryCode.toUpperCase() === "GB";
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">(defaultIsImperial ? "imperial" : "metric");

  const isImperial = unitSystem === "imperial";
  const isGB = countryCode.toUpperCase() === "GB" && isImperial;
  const isUS = isImperial && !isGB;

  // Find the first available fuel type
  const defaultFuelType = fuelTypeKeys.find(key => {
    const val = initialPrices[key];
    return val !== null && val !== undefined && typeof val === "number" && val > 0;
  }) || "gasoline_price";

  const [mode, setMode] = useState<"simple" | "route">("simple");
  const [fuelType, setFuelType] = useState<FuelTypeKey>(defaultFuelType as FuelTypeKey);
  const [price, setPrice] = useState("");
  const [consumption, setConsumption] = useState("8.0");
  const [monthlyDistance, setMonthlyDistance] = useState("1000");
  const [electricChargeType, setElectricChargeType] = useState<"home" | "ac" | "dc">("home");

  const getFuelTypeLabel = (key: string) => {
    if (key === "electric_price_home") {
      return currentLang === "tr" ? "Elektrik (Evde Şarj) 🏠" : "Electricity (Home Charging) 🏠";
    }
    if (key === "electric_price_ac") {
      return currentLang === "tr" ? "Elektrik (Hızlı Şarj AC) ⚡" : "Electricity (AC Fast Charging) ⚡";
    }
    if (key === "electric_price_dc") {
      return currentLang === "tr" ? "Elektrik (Hızlı Şarj DC) 🔋" : "Electricity (DC Fast Charging) 🔋";
    }
    return translate(currentLang, `fuelTypes.${key}`);
  };

  // Route Mode States
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Fetch Exchange Rates when entering Route Mode
  useEffect(() => {
    if (mode === "route" && Object.keys(rates).length === 0) {
      fetch("https://open.er-api.com/v6/latest/USD")
        .then(res => res.json())
        .then(data => {
          if (data && data.rates) {
            setRates(data.rates);
          }
        })
        .catch(err => console.error("Failed to fetch exchange rates:", err));
    }
  }, [mode, rates]);

  // Handle outside click for route stop search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search for route stops
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const response = await fetch(`/api/cities/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Failed to search cities for route:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    const newPrice = initialPrices[fuelType] as number || 0;
    
    // Convert price if US imperial
    let displayPrice = newPrice;
    if (fuelType === "electric_price") {
      let multiplier = 1.0;
      if (electricChargeType === "ac") multiplier = 3.7;
      else if (electricChargeType === "dc") multiplier = 4.5;
      displayPrice = newPrice * multiplier;
    } else if (isUS) {
      displayPrice = newPrice * 3.78541; // Per gallon
    }
    setPrice(displayPrice.toFixed(3));
    
    // Set appropriate default consumption for electric vs fuel
    if (fuelType === "electric_price") {
      if (isImperial) {
        setConsumption("3.5"); // 3.5 mi/kWh is typical for EVs
      } else {
        setConsumption("18.0"); // 18 kWh/100km
      }
    } else {
      if (isImperial) {
        if (isUS) {
          setConsumption("29.4");
        } else {
          setConsumption("35.3");
        }
      } else {
        setConsumption("8.0"); // 8 L/100km
      }
    }
  }, [fuelType, initialPrices, isUS, isImperial, electricChargeType]);

  const priceNum = parseFloat(price) || 0;
  const consNum = parseFloat(consumption) || 0;
  const distanceNum = parseFloat(monthlyDistance) || 0;

  const getConsumptionForFuel = (key: string) => {
    if (key === fuelType) {
      return parseFloat(consumption) || 0;
    }
    const defaults = isGB 
      ? DEFAULT_CONSUMPTIONS_GB 
      : (isUS ? DEFAULT_CONSUMPTIONS_US : DEFAULT_CONSUMPTIONS_METRIC);
    return defaults[key] || 0;
  };

  // Convert a price to the base currency
  const convertPrice = (priceVal: number, fromCurrencyCode: string | null) => {
    const baseCurrencyCode = initialPrices.currency_code || "USD";
    if (!fromCurrencyCode || fromCurrencyCode === baseCurrencyCode) {
      return priceVal;
    }
    const fromRate = rates[fromCurrencyCode];
    const toRate = rates[baseCurrencyCode];
    if (fromRate && toRate) {
      return priceVal * (toRate / fromRate);
    }
    return priceVal; // Fallback to 1:1 if rates are missing
  };

  // Leg Calculation Helper
  const calculateLegDetails = (fuelKey: FuelTypeKey, stopIndex: number) => {
    const isStart = stopIndex === -1;
    const stopPrice = isStart ? initialPrices[fuelKey] as number : (stops[stopIndex].prices ? stops[stopIndex].prices[fuelKey] as number : null);
    const stopCurrencyCode = isStart ? initialPrices.currency_code : (stops[stopIndex].prices ? stops[stopIndex].prices.currency_code : null);
    
    // Fallback to start prices if stop is missing values
    const finalPriceRawBase = (stopPrice !== null && stopPrice !== undefined && stopPrice > 0) ? stopPrice : (initialPrices[fuelKey] as number || 0);
    let finalPriceRaw = finalPriceRawBase;
    if (fuelKey === "electric_price") {
      let multiplier = 1.0;
      if (electricChargeType === "ac") multiplier = 3.7;
      else if (electricChargeType === "dc") multiplier = 4.5;
      finalPriceRaw = finalPriceRawBase * multiplier;
    }
    const finalCurrencyCode = (stopPrice !== null && stopPrice !== undefined && stopPrice > 0) ? stopCurrencyCode : (initialPrices.currency_code || "USD");

    const convertedPricePerLiter = convertPrice(finalPriceRaw, finalCurrencyCode);
    const legDistance = isStart ? 0 : stops[stopIndex].distance;
    const cons = getConsumptionForFuel(fuelKey);

    let cost = 0;
    let co2 = 0;

    if (fuelKey === "electric_price") {
      if (isImperial) {
        const kWhConsumed = cons > 0 ? (legDistance / cons) : 0;
        cost = convertedPricePerLiter * kWhConsumed;
        co2 = kWhConsumed * CO2_EMISSIONS[fuelKey];
      } else {
        const kWhConsumed = (cons / 100) * legDistance;
        cost = convertedPricePerLiter * kWhConsumed;
        co2 = kWhConsumed * CO2_EMISSIONS[fuelKey];
      }
    } else {
      if (isUS) {
        const convertedPricePerGallon = convertedPricePerLiter * 3.78541;
        const gallonsConsumed = cons > 0 ? (legDistance / cons) : 0;
        cost = gallonsConsumed * convertedPricePerGallon;
        co2 = (gallonsConsumed * 3.78541) * CO2_EMISSIONS[fuelKey];
      } else if (isGB) {
        const gallonsConsumed = cons > 0 ? (legDistance / cons) : 0;
        const litersConsumed = gallonsConsumed * 4.54609;
        cost = litersConsumed * convertedPricePerLiter;
        co2 = litersConsumed * CO2_EMISSIONS[fuelKey];
      } else {
        const litersConsumed = (cons / 100) * legDistance;
        cost = litersConsumed * convertedPricePerLiter;
        co2 = litersConsumed * CO2_EMISSIONS[fuelKey];
      }
    }

    let displayRawPrice = finalPriceRaw;
    if (isUS && fuelKey !== "electric_price") {
      displayRawPrice = finalPriceRaw * 3.78541;
    }

    return {
      price: isUS && fuelKey !== "electric_price" ? convertedPricePerLiter * 3.78541 : convertedPricePerLiter,
      rawPrice: displayRawPrice,
      currencyCode: finalCurrencyCode,
      cost,
      co2,
      distance: legDistance
    };
  };

  // Process all legs on the route
  const getRouteTotalForFuel = (fuelKey: FuelTypeKey) => {
    let totalCost = 0;
    let totalCo2 = 0;
    let totalDistance = 0;

    // We calculate cost for each leg
    stops.forEach((_, index) => {
      const leg = calculateLegDetails(fuelKey, index);
      totalCost += leg.cost;
      totalCo2 += leg.co2;
      totalDistance += leg.distance;
    });

    return {
      cost: totalCost,
      co2: totalCo2,
      distance: totalDistance
    };
  };

  // Available fuel types calculations
  const availableFuels: any[] = [];
  
  fuelTypeKeys.forEach(key => {
    const val = initialPrices[key];
    if (val === null || val === undefined || typeof val !== "number" || val <= 0) {
      return;
    }
    
    if (key === "electric_price") {
      const subTypes = [
        { subKey: "electric_price_home", mult: 1.0, labelKey: "electricity_home" },
        { subKey: "electric_price_ac", mult: 3.7, labelKey: "electricity_ac" },
        { subKey: "electric_price_dc", mult: 4.5, labelKey: "electricity_dc" }
      ];
      
      subTypes.forEach(sub => {
        const priceVal = val * sub.mult;
        const consVal = getConsumptionForFuel("electric_price");
        
        let cost = 0;
        let co2 = 0;
        let distanceVal = distanceNum;
        
        if (mode === "route") {
          let totalCost = 0;
          let totalCo2 = 0;
          let totalDistance = 0;
          
          stops.forEach((_, index) => {
            const leg = calculateLegDetails("electric_price", index);
            totalCost += leg.cost * sub.mult;
            totalCo2 += leg.co2;
            totalDistance += leg.distance;
          });
          
          cost = totalCost;
          co2 = totalCo2;
          distanceVal = totalDistance;
        } else {
          if (isImperial) {
            const kWhConsumed = consVal > 0 ? (distanceNum / consVal) : 0;
            cost = priceVal * kWhConsumed;
            co2 = kWhConsumed * CO2_EMISSIONS["electric_price"];
          } else {
            const kWhConsumed = (consVal / 100) * distanceNum;
            cost = priceVal * kWhConsumed;
            co2 = kWhConsumed * CO2_EMISSIONS["electric_price"];
          }
        }
        
        availableFuels.push({
          key: sub.subKey,
          baseKey: "electric_price",
          labelKey: sub.labelKey,
          price: priceVal,
          consumption: consVal,
          cost,
          co2,
          distance: distanceVal
        });
      });
    } else {
      const priceVal = val;
      const consVal = getConsumptionForFuel(key);
      
      let cost = 0;
      let co2 = 0;
      let distanceVal = distanceNum;
      
      if (mode === "route") {
        const totals = getRouteTotalForFuel(key);
        cost = totals.cost;
        co2 = totals.co2;
        distanceVal = totals.distance;
      } else {
        if (isUS) {
          const pricePerGallon = priceVal * 3.78541;
          const gallonsConsumed = consVal > 0 ? (distanceNum / consVal) : 0;
          cost = gallonsConsumed * pricePerGallon;
          co2 = (gallonsConsumed * 3.78541) * CO2_EMISSIONS[key];
        } else if (isGB) {
          const gallonsConsumed = consVal > 0 ? (distanceNum / consVal) : 0;
          const litersConsumed = gallonsConsumed * 4.54609;
          cost = litersConsumed * priceVal;
          co2 = litersConsumed * CO2_EMISSIONS[key];
        } else {
          const litersConsumed = (consVal / 100) * distanceNum;
          cost = litersConsumed * priceVal;
          co2 = litersConsumed * CO2_EMISSIONS[key];
        }
      }
      
      availableFuels.push({
        key,
        baseKey: key,
        labelKey: key,
        price: isUS ? priceVal * 3.78541 : priceVal,
        consumption: consVal,
        cost,
        co2,
        distance: distanceVal
      });
    }
  });

  const minCost = availableFuels.length > 0 ? Math.min(...availableFuels.map(f => f.cost)) : 0;
  const maxCost = availableFuels.length > 0 ? Math.max(...availableFuels.map(f => f.cost)) : 0;
  const minCo2 = availableFuels.length > 0 ? Math.min(...availableFuels.map(f => f.co2)) : 0;
  const maxCo2 = availableFuels.length > 0 ? Math.max(...availableFuels.map(f => f.co2)) : 0;

  // Calculate dynamically sorted and scored fuels by CO2/Eco
  const sortedAndScoredFuels = [...availableFuels].sort((a, b) => a.co2 - b.co2); // Sort lowest CO2 first (cleanest)

  const fuelsWithScore = sortedAndScoredFuels.map((fuel) => {
    let bgStyle = "";
    let borderStyle = "";
    let textStyle = "";

    if (fuel.baseKey === "electric_price") {
      if (fuel.key === "electric_price_home") {
        bgStyle = "bg-emerald-50 hover:bg-emerald-100/70";
        borderStyle = "border-emerald-200/80";
        textStyle = "text-emerald-900";
      } else {
        bgStyle = "bg-[#f0fdf4]/50 hover:bg-[#f0fdf4]/80";
        borderStyle = "border-[#dcfce7]/60";
        textStyle = "text-emerald-800";
      }
    } else if (fuel.baseKey === "lpg_price") {
      bgStyle = "bg-[#fdf8f2] hover:bg-[#faf1e6]";
      borderStyle = "border-[#f5e6d3]";
      textStyle = "text-[#6c4e31]";
    } else {
      bgStyle = "bg-[#f7ece1] hover:bg-[#f3dfce]";
      borderStyle = "border-[#e9cfb9]";
      textStyle = "text-[#543a21]";
    }

    const costDiff = maxCost - minCost;
    const costScore = costDiff === 0 ? 1 : (maxCost - fuel.cost) / costDiff;

    const co2Diff = maxCo2 - minCo2;
    const co2Score = co2Diff === 0 ? 1 : (maxCo2 - fuel.co2) / co2Diff;

    const combinedScore = (costScore * 0.5) + (co2Score * 0.5);
    const leafCount = Math.round(1 + combinedScore * 4);

    return {
      ...fuel,
      leafCount,
      bgStyle,
      borderStyle,
      textStyle
    };
  });

  let periodCostSimple = 0;
  if (fuelType === "electric_price") {
    if (isImperial) {
      const kWhConsumed = consNum > 0 ? (distanceNum / consNum) : 0;
      periodCostSimple = priceNum * kWhConsumed;
    } else {
      const kWhConsumed = (consNum / 100) * distanceNum;
      periodCostSimple = priceNum * kWhConsumed;
    }
  } else {
    if (isUS) {
      const gallonsConsumed = consNum > 0 ? (distanceNum / consNum) : 0;
      periodCostSimple = gallonsConsumed * priceNum;
    } else if (isGB) {
      const gallonsConsumed = consNum > 0 ? (distanceNum / consNum) : 0;
      const litersConsumed = gallonsConsumed * 4.54609;
      periodCostSimple = litersConsumed * priceNum;
    } else {
      periodCostSimple = ((priceNum * consNum) / 100) * distanceNum;
    }
  }

  // Calculate final outputs based on mode
  const totalRouteDistance = stops.reduce((sum, s) => sum + s.distance, 0);
  const routeCostObj = getRouteTotalForFuel(fuelType);
  const periodCost = mode === "route" ? routeCostObj.cost : periodCostSimple;

  const costPerUnitDistance = mode === "route"
    ? 0
    : (distanceNum > 0 ? periodCostSimple / distanceNum : 0);

  const currencySymbol = initialPrices.currency_symbol || initialPrices.currency || "$";
  const dataSource = initialPrices.data_source || "Database Scraper";

  const isElectric = fuelType === "electric_price";
  const unitLabel = isElectric ? "kWh" : (isUS ? "Gallon" : "Liter");
  const consLabel = isElectric ? (isImperial ? "mi/kWh" : "kWh/100km") : (isUS ? "MPG" : (isGB ? "MPG (UK)" : "L/100km"));

  const translatedUnitLabel = isElectric ? "kWh" : (isUS ? (currentLang === "tr" ? "Galon" : "Gallon") : translate(currentLang, `units.Liter`));

  const outputStyles = {
    electric_price: {
      container: "bg-emerald-50/60 border-emerald-200 text-emerald-900 shadow-sm",
      label: "text-emerald-700",
      value: "text-emerald-950",
      secondary: "text-emerald-900/80"
    },
    lpg_price: {
      container: "bg-[#f0fdf4]/60 border-emerald-200/70 text-emerald-800 shadow-sm",
      label: "text-emerald-700",
      value: "text-emerald-900",
      secondary: "text-emerald-800/80"
    },
    gasoline_price: {
      container: "bg-[#fdf8f2] border-[#d5bda5]/40 text-[#6c4e31] shadow-sm",
      label: "text-[#96714c]",
      value: "text-[#4e3620]",
      secondary: "text-[#6c4e31]/80"
    },
    diesel_price: {
      container: "bg-[#f7ece1] border-[#c0a080]/40 text-[#543a21] shadow-sm",
      label: "text-[#7c5b3c]",
      value: "text-[#3e2610]",
      secondary: "text-[#543a21]/80"
    }
  };

  const currentOutputStyle = outputStyles[fuelType as keyof typeof outputStyles] || outputStyles.gasoline_price;

  const calculateDistanceBetweenCoordinates = (
    lat1: number | null | undefined,
    lng1: number | null | undefined,
    lat2: number | null | undefined,
    lng2: number | null | undefined
  ): number => {
    if (
      lat1 === null || lat1 === undefined ||
      lng1 === null || lng1 === undefined ||
      lat2 === null || lat2 === undefined ||
      lng2 === null || lng2 === undefined
    ) {
      return 150; // Fallback to 150 km if any coordinate is missing
    }

    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Straight-line distance in km

    // Convert to estimated road distance (using standard 1.25 circuity routing factor)
    const kmDistance = Math.round(d * 1.25);
    if (isImperial) {
      return Math.round(kmDistance * 0.621371);
    }
    return kmDistance;
  };

  const addStopToRoute = async (city: any) => {
    setSearchLoading(true);
    try {
      const response = await fetch(`/api/cities/prices?country=${city.country_code}&city=${city.slug}`);
      const prices = await response.json();
      
      // Determine the previous coordinates
      let prevLat = initialPrices.lat;
      let prevLng = initialPrices.lng;

      if (stops.length > 0) {
        const lastStop = stops[stops.length - 1];
        prevLat = lastStop.lat ?? null;
        prevLng = lastStop.lng ?? null;
      }

      // Calculate the real distance
      const cityLat = city.lat !== null && city.lat !== undefined ? parseFloat(city.lat) : (prices.lat ?? null);
      const cityLng = city.lng !== null && city.lng !== undefined ? parseFloat(city.lng) : (prices.lng ?? null);

      const computedDistance = calculateDistanceBetweenCoordinates(prevLat, prevLng, cityLat, cityLng);

      const newStop: RouteStop = {
        id: Math.random().toString(36).substr(2, 9),
        name: city.name,
        slug: city.slug,
        country_code: city.country_code,
        distance: computedDistance,
        prices: response.ok ? prices : null,
        lat: cityLat,
        lng: cityLng
      };

      setStops([...stops, newStop]);
      setSearchQuery("");
      setSearchResults([]);
      setSearchOpen(false);
    } catch (err) {
      console.error("Failed to add stop to route:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const removeStop = (id: string) => {
    setStops(stops.filter(s => s.id !== id));
  };

  const updateStopDistance = (id: string, dist: string) => {
    const value = parseInt(dist) || 0;
    setStops(stops.map(s => s.id === id ? { ...s, distance: value } : s));
  };

  return (
    <div className="space-y-6">
      {/* Mode and System Switchers */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {/* Mode Switcher */}
        <div className="inline-flex rounded-xl p-1 bg-[#f5f4f0] border border-[#e7e5e4] shadow-sm">
          <button
            onClick={() => setMode("simple")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              mode === "simple"
                ? "bg-white text-[#1c1917] font-semibold shadow-md border border-[#e7e5e4]/60"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            {translate(currentLang, "standardMode")}
          </button>
          <button
            onClick={() => setMode("route")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
              mode === "route"
                ? "bg-white text-[#1c1917] font-semibold shadow-md border border-[#e7e5e4]/60"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            <span>{translate(currentLang, "routePlanner")}</span>
          </button>
        </div>

        {/* Unit System Switcher */}
        <div className="inline-flex rounded-xl p-1 bg-[#f5f4f0] border border-[#e7e5e4] shadow-sm">
          <button
            onClick={() => setUnitSystem("metric")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              unitSystem === "metric"
                ? "bg-white text-[#1c1917] font-semibold shadow-md border border-[#e7e5e4]/60"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            {currentLang === "tr" ? "Metrik (Km, L) 🌍" : "Metric (Km, L) 🌍"}
          </button>
          <button
            onClick={() => setUnitSystem("imperial")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
              unitSystem === "imperial"
                ? "bg-white text-[#1c1917] font-semibold shadow-md border border-[#e7e5e4]/60"
                : "text-[#78716c] hover:text-[#1c1917]"
            }`}
          >
            {translate(currentLang, "imperial")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full max-w-4xl mx-auto">
        {/* Left side: Tabbed fuel types list and source details / Route planner */}
        <div className="md:col-span-7 space-y-6">
          {mode === "simple" ? (
            <>
              <h3 className="text-xl font-semibold text-[#1c1917] tracking-tight mb-2">
                {translate(currentLang, "selectFuelType")}
              </h3>
              
              {/* Dynamic Brutalist Tabs with eco colors inside */}
              <div className="grid grid-cols-2 gap-3">
                {fuelTypeKeys.map((key) => {
                  const val = initialPrices[key] as number | null;
                  const isAvailable = val !== null && val !== undefined && val > 0;
                  const isActive = fuelType === key;

                  if (!isAvailable) {
                    return (
                      <div
                        key={key}
                        className="p-4 rounded-xl border border-dashed border-[#e7e5e4] text-[#a8a29e] bg-[#f5f4f0]/50 select-none opacity-50"
                      >
                        <span className="block text-xs uppercase font-medium tracking-wider">
                          {translate(currentLang, `fuelTypes.${key}`)}
                        </span>
                        <span className="block text-sm font-semibold mt-1">
                          {translate(currentLang, "notAvailable")}
                        </span>
                      </div>
                    );
                  }

                  // Determine colors based on eco-scale (Green to Brown)
                  const buttonStyles = {
                    electric_price: {
                      active: "bg-emerald-50 text-emerald-900 border-emerald-500 shadow-md scale-[1.02] ring-2 ring-emerald-500/20 font-bold",
                      inactive: "bg-white text-[#44403c] border-[#e7e5e4] hover:border-emerald-300 hover:bg-emerald-50/20 shadow-sm",
                      labelActive: "text-emerald-600/90"
                    },
                    lpg_price: {
                      active: "bg-[#f0fdf4]/80 text-emerald-800 border-emerald-400 shadow-md scale-[1.02] ring-2 ring-emerald-400/20 font-bold",
                      inactive: "bg-white text-[#44403c] border-[#e7e5e4] hover:border-emerald-200 hover:bg-[#f0fdf4]/20 shadow-sm",
                      labelActive: "text-emerald-600/90"
                    },
                    gasoline_price: {
                      active: "bg-[#fdf8f2] text-[#6c4e31] border-[#d5bda5] shadow-md scale-[1.02] ring-2 ring-[#d5bda5]/20 font-bold",
                      inactive: "bg-white text-[#44403c] border-[#e7e5e4] hover:border-[#d5bda5]/50 hover:bg-[#fdf8f2]/20 shadow-sm",
                      labelActive: "text-[#96714c]"
                    },
                    diesel_price: {
                      active: "bg-[#f7ece1] text-[#543a21] border-[#c0a080] shadow-md scale-[1.02] ring-2 ring-[#c0a080]/20 font-bold",
                      inactive: "bg-white text-[#44403c] border-[#e7e5e4] hover:border-[#c0a080]/50 hover:bg-[#f7ece1]/20 shadow-sm",
                      labelActive: "text-[#7c5b3c]"
                    }
                  };

                  const currentStyle = buttonStyles[key];
                  const btnClass = isActive ? currentStyle.active : currentStyle.inactive;
                  const labelClass = isActive ? currentStyle.labelActive : "text-[#78716c]";

                  return (
                    <button
                      key={key}
                      onClick={() => setFuelType(key)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${btnClass}`}
                    >
                      <span className={`block text-xs uppercase font-medium tracking-wider ${labelClass}`}>
                        {translate(currentLang, `fuelTypes.${key}`)}
                      </span>
                      <span className="block text-2xl font-bold mt-1 tracking-tight">
                        {currencySymbol}{val.toFixed(3)}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Source & Metadata Card */}
              <div className="bg-white border border-[#e7e5e4] p-5 rounded-xl space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#78716c] font-semibold uppercase tracking-wider">
                    {translate(currentLang, "dataSource")}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {translate(currentLang, "verified")}
                  </span>
                </div>
                <p className="text-lg font-medium text-[#1c1917]">
                  {dataSource}
                </p>
                <p className="text-sm text-[#6b6661]">
                  {translate(currentLang, "dataSourceDescription")}
                </p>
              </div>
            </>
          ) : (
            // Route Planner Flow
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#1c1917] tracking-tight flex items-center gap-2">
                <span>🛣️</span> {translate(currentLang, "routePlanner")}
              </h3>

              {/* Stops list representation */}
              <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[2px] before:bg-[#e7e5e4]">
                {/* Leg 0 (Start Location) */}
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 font-bold shrink-0 text-sm">
                    A
                  </div>
                  <div className="flex-1 bg-white border border-[#e7e5e4] p-4 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-xs text-[#78716c] font-semibold uppercase tracking-wider">
                        {translate(currentLang, "startLocation", { city: "" })}
                      </p>
                      <h4 className="text-base font-semibold text-[#1c1917] capitalize">
                        {translate(currentLang, "startLocation", { city: "" }) ? "" : "Start: "}
                        {initialPrices.currency_code ? `${countryCode.toUpperCase()} - ` : ""}
                        {typeof window !== "undefined" ? window.location.pathname.split("/").pop() : "Current City"}
                      </h4>
                    </div>
                    <span className="px-2 py-1 text-[11px] font-mono text-[#57534e] bg-[#f5f4f0] border border-[#e7e5e4] rounded">
                      {initialPrices.currency_code}
                    </span>
                  </div>
                </div>

                {/* Additional Stops */}
                {stops.map((stop, index) => {
                  const letter = String.fromCharCode(66 + index); // B, C, D...
                  return (
                    <div key={stop.id} className="flex gap-4 items-start relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold shrink-0 text-sm">
                        {letter}
                      </div>
                      <div className="flex-1 space-y-3 bg-white border border-[#e7e5e4] p-4 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-semibold text-[#1c1917] capitalize">
                            {stop.name} ({stop.country_code})
                          </h4>
                          <button
                            onClick={() => removeStop(stop.id)}
                            className="text-[#78716c] hover:text-red-600 p-1 rounded-lg transition duration-150 cursor-pointer text-sm font-medium"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs text-[#78716c] uppercase font-semibold">
                            {translate(currentLang, "distanceTo", { city: stop.name })}
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={stop.distance}
                              onChange={(e) => updateStopDistance(stop.id, e.target.value)}
                              className="bg-white border-[#e7e5e4] focus:border-[#a8a29e] text-[#1c1917] font-mono w-32 shadow-sm"
                            />
                            <span className="text-sm text-[#78716c] font-semibold">{isImperial ? (currentLang === "tr" ? "mil" : "miles") : "km"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Stop Inputs */}
              <div ref={searchContainerRef} className="relative pt-2">
                <Label className="block text-xs text-[#78716c] uppercase tracking-wider mb-2 font-semibold">
                  {translate(currentLang, stops.length > 0 ? "addAnotherStop" : "addStop")}
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                    placeholder={translate(currentLang, "searchPlaceholder")}
                    className="bg-white border border-[#e7e5e4] focus:border-[#a8a29e] text-[#1c1917] rounded-xl py-3 px-4 shadow-sm placeholder-[#a8a29e]"
                  />
                  {searchLoading && (
                    <div className="absolute right-3 top-3.5 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#78716c] border-t-transparent"></div>
                    </div>
                  )}
                </div>

                {searchOpen && searchQuery.trim().length >= 2 && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-[#e7e5e4] rounded-xl shadow-xl max-h-56 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((city) => (
                        <button
                          key={`${city.country_code}-${city.slug}`}
                          onClick={() => addStopToRoute(city)}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-[#f5f4f0] text-[#44403c] hover:text-[#1c1917] transition duration-150 flex items-center justify-between border-b border-[#e7e5e4] cursor-pointer"
                        >
                          <span className="font-medium">{city.name}</span>
                          <span className="text-xs text-[#57534e] uppercase font-mono px-2 py-0.5 bg-[#f5f4f0] border border-[#e7e5e4] rounded">
                            {city.country_code}
                          </span>
                        </button>
                      ))
                    ) : (
                      !searchLoading && (
                        <div className="px-4 py-3 text-sm text-[#78716c]">
                          {translate(currentLang, "searchNoResults")}
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right side: Fuel Cost Calculator / Route calculations */}
        <div className="md:col-span-5">
          <Card className="bg-white border border-[#e7e5e4] rounded-xl h-full shadow-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-lg text-[#1c1917] font-semibold">
                {mode === "simple"
                  ? translate(currentLang, "costEstimator")
                  : translate(currentLang, "routeCostSummary")}
              </CardTitle>
              {mode === "simple" && (
                <p className="text-xs text-[#78716c]">
                  {translate(currentLang, "customizeDataHint")}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-5">
              {mode === "simple" ? (
                <>
                  {/* Price Override Input */}
                  <div className="space-y-2">
                    <Label className="text-sm text-[#78716c] font-semibold">
                      {translate(currentLang, "pricePerUnit", { unit: translatedUnitLabel, currency: currencySymbol })}
                    </Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="bg-white border-[#e7e5e4] focus:border-[#a8a29e] text-[#1c1917] font-semibold shadow-sm"
                    />
                  </div>

                  {isElectric && (
                    <div className="space-y-2 pt-1">
                      <Label className="text-xs text-[#78716c] font-semibold uppercase tracking-wider">
                        {currentLang === "tr" ? "Şarj Noktası Tipi" : "Charging Location Type"}
                      </Label>
                      <div className="grid grid-cols-3 gap-2 p-1 bg-[#f5f4f0] border border-[#e7e5e4] rounded-xl shadow-sm">
                        <button
                          type="button"
                          onClick={() => setElectricChargeType("home")}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            electricChargeType === "home"
                              ? "bg-white text-[#1c1917] shadow-sm border border-[#e7e5e4]/60"
                              : "text-[#78716c] hover:text-[#1c1917]"
                          }`}
                        >
                          {currentLang === "tr" ? "🏠 Evde" : "🏠 Home"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setElectricChargeType("ac")}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            electricChargeType === "ac"
                              ? "bg-white text-[#1c1917] shadow-sm border border-[#e7e5e4]/60"
                              : "text-[#78716c] hover:text-[#1c1917]"
                          }`}
                        >
                          {currentLang === "tr" ? "⚡ Hızlı AC" : "⚡ Fast AC"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setElectricChargeType("dc")}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            electricChargeType === "dc"
                              ? "bg-white text-[#1c1917] shadow-sm border border-[#e7e5e4]/60"
                              : "text-[#78716c] hover:text-[#1c1917]"
                          }`}
                        >
                          {currentLang === "tr" ? "🔋 Hızlı DC" : "🔋 Fast DC"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Consumption Input */}
                  <div className="space-y-2">
                    <Label className="text-sm text-[#78716c] font-semibold">
                      {translate(currentLang, "consumptionLabel", { cons: consLabel })}
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={consumption}
                      onChange={(e) => setConsumption(e.target.value)}
                      className="bg-white border-[#e7e5e4] focus:border-[#a8a29e] text-[#1c1917] font-semibold shadow-sm"
                    />
                  </div>

                  {/* Monthly Distance Input */}
                  <div className="space-y-2">
                    <Label className="text-sm text-[#78716c] font-semibold">
                      {isImperial ? (currentLang === "tr" ? "Hesaplanacak mesafe (mil)" : "Calculate for distance (miles)") : translate(currentLang, "calculateDistance")}
                    </Label>
                    <Input
                      type="number"
                      step="100"
                      value={monthlyDistance}
                      onChange={(e) => setMonthlyDistance(e.target.value)}
                      className="bg-white border-[#e7e5e4] focus:border-[#a8a29e] text-[#1c1917] font-semibold shadow-sm"
                    />
                  </div>
                </>
              ) : (
                // Route Mode Cost Estimator inputs
                <div className="space-y-5">
                  <div className="p-4 bg-[#f5f4f0]/60 border border-[#e7e5e4] rounded-xl flex items-center justify-between shadow-sm">
                    <span className="text-xs uppercase tracking-wider text-[#78716c] font-semibold">
                      {translate(currentLang, "fuelTypes." + fuelType as any)} Price
                    </span>
                    <span className="text-sm font-bold text-[#1c1917]">
                      {currencySymbol}{(initialPrices[fuelType] as number || 0).toFixed(3)}
                    </span>
                  </div>

                  {isElectric && (
                    <div className="space-y-2">
                      <Label className="text-xs text-[#78716c] font-semibold uppercase tracking-wider">
                        {currentLang === "tr" ? "Şarj Noktası Tipi" : "Charging Location Type"}
                      </Label>
                      <div className="grid grid-cols-3 gap-2 p-1 bg-[#f5f4f0] border border-[#e7e5e4] rounded-xl shadow-sm">
                        <button
                          type="button"
                          onClick={() => setElectricChargeType("home")}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            electricChargeType === "home"
                              ? "bg-white text-[#1c1917] shadow-sm border border-[#e7e5e4]/60"
                              : "text-[#78716c] hover:text-[#1c1917]"
                          }`}
                        >
                          {currentLang === "tr" ? "🏠 Evde" : "🏠 Home"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setElectricChargeType("ac")}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            electricChargeType === "ac"
                              ? "bg-white text-[#1c1917] shadow-sm border border-[#e7e5e4]/60"
                              : "text-[#78716c] hover:text-[#1c1917]"
                          }`}
                        >
                          {currentLang === "tr" ? "⚡ Hızlı AC" : "⚡ Fast AC"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setElectricChargeType("dc")}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            electricChargeType === "dc"
                              ? "bg-white text-[#1c1917] shadow-sm border border-[#e7e5e4]/60"
                              : "text-[#78716c] hover:text-[#1c1917]"
                          }`}
                        >
                          {currentLang === "tr" ? "🔋 Hızlı DC" : "🔋 Fast DC"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Consumption Input in Route Mode */}
                  <div className="space-y-2">
                    <Label className="text-sm text-[#78716c] font-semibold">
                      {translate(currentLang, "consumptionLabel", { cons: consLabel })}
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={consumption}
                      onChange={(e) => setConsumption(e.target.value)}
                      className="bg-white border-[#e7e5e4] focus:border-[#a8a29e] text-[#1c1917] font-semibold shadow-sm"
                    />
                  </div>
                </div>
              )}

              {/* Result Outputs */}
              <div className={`p-4 border rounded-xl space-y-4 ${currentOutputStyle.container}`}>
                {mode === "simple" ? (
                  <>
                    <div>
                      <p className={`text-xs uppercase tracking-wider font-semibold ${currentOutputStyle.label}`}>
                        {isImperial ? (currentLang === "tr" ? "Mil başına maliyet" : "Cost per Mile") : translate(currentLang, "costPerKm")}
                      </p>
                      <div className={`text-3xl font-bold tracking-tight mt-0.5 font-mono ${currentOutputStyle.value}`}>
                        {currencySymbol}{costPerUnitDistance.toFixed(3)}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs uppercase tracking-wider font-semibold ${currentOutputStyle.label}`}>
                        {translate(currentLang, "totalCost", { distance: `${monthlyDistance} ${isImperial ? (currentLang === "tr" ? "mil" : "miles") : "km"}` })}
                      </p>
                      <div className={`text-xl font-bold mt-0.5 font-mono ${currentOutputStyle.value}`}>
                        {currencySymbol}{periodCost.toFixed(2)}
                      </div>
                    </div>
                  </>
                ) : (
                  // Route Mode Totals
                  <>
                    <div>
                      <p className={`text-xs uppercase tracking-wider font-semibold ${currentOutputStyle.label}`}>
                        {isImperial ? (currentLang === "tr" ? "Toplam Rota Mesafesi (mil)" : "Total Route Distance (miles)") : translate(currentLang, "totalDistance")}
                      </p>
                      <div className={`text-3xl font-bold tracking-tight mt-0.5 font-mono ${currentOutputStyle.value}`}>
                        {totalRouteDistance.toLocaleString()} {isImperial ? (currentLang === "tr" ? "mil" : "miles") : "km"}
                      </div>
                    </div>
                    <div>
                      <p className={`text-xs uppercase tracking-wider font-semibold ${currentOutputStyle.label}`}>
                        {translate(currentLang, "routeCostSummary")}
                      </p>
                      <div className={`text-2xl font-bold mt-0.5 font-mono ${currentOutputStyle.value}`}>
                        {currencySymbol}{periodCost.toFixed(2)}
                      </div>
                    </div>

                    {/* Breakdown of stops if any exist */}
                    {stops.length > 0 && (
                      <div className={`pt-4 border-t space-y-2 border-dashed ${fuelType === "electric_price" || fuelType === "lpg_price" ? "border-emerald-300" : "border-[#c0a080]"}`}>
                        <p className={`text-xs uppercase tracking-wider font-semibold mb-1 ${currentOutputStyle.label}`}>
                          Leg Costs:
                        </p>
                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
                          {stops.map((stop, idx) => {
                            const leg = calculateLegDetails(fuelType, idx);
                            return (
                              <div key={stop.id} className="flex justify-between">
                                <span className={currentOutputStyle.secondary}>↳ {stop.name} ({leg.distance} {isImperial ? (currentLang === "tr" ? "mil" : "miles") : "km"})</span>
                                <span className={`font-semibold ${currentOutputStyle.value}`}>
                                  {currencySymbol}{leg.cost.toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dynamic Eco-Comparison Table */}
        {fuelsWithScore.length > 0 && (
          <div className="md:col-span-12 mt-4">
            <div className="bg-white border border-[#e7e5e4] rounded-xl p-6 shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-[#1c1917] tracking-tight">
                    {translate(currentLang, "comparisonTable")}
                  </h3>
                  <p className="text-sm text-[#6b6661] mt-1">
                    {translate(currentLang, "forDistance", {
                      distance: `${mode === "simple" ? monthlyDistance : totalRouteDistance.toString()} ${isImperial ? (currentLang === "tr" ? "mil" : "miles") : "km"}`
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg border border-emerald-100 text-xs font-semibold shadow-sm">
                  <span>🍃</span>
                  <span>
                    {translate(currentLang, "ecoHint")}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e7e5e4] text-xs font-semibold uppercase tracking-wider text-[#78716c]">
                      <th className="py-3 px-4">
                        {translate(currentLang, "fuelTypeCol")}
                      </th>
                      <th className="py-3 px-4">
                        {translate(currentLang, "price")}
                      </th>
                      <th className="py-3 px-4">
                        {translate(currentLang, "consumptionCol")}
                      </th>
                      <th className="py-3 px-4">
                        {translate(currentLang, "costCol")}
                      </th>
                      <th className="py-3 px-4">
                        {translate(currentLang, "co2Emission")}
                      </th>
                      <th className="py-3 px-4 text-right">
                        {translate(currentLang, "ecoScore")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e7e5e4]">
                    {fuelsWithScore.map((fuel) => {
                      const isSelected = fuelType === fuel.key || (fuelType === "electric_price" && fuel.baseKey === "electric_price" && fuel.key === `electric_price_${electricChargeType}`);
                      const leaves = Array(fuel.leafCount).fill("🍃").join(" ");
                      return (
                        <tr
                          key={fuel.key}
                          className={`text-sm transition-all duration-200 border-l-4 ${fuel.bgStyle} ${fuel.textStyle} ${
                            isSelected ? "border-l-[#1c1917] font-bold" : "border-l-transparent"
                          }`}
                        >
                          <td className="py-4 px-4 font-semibold flex items-center gap-2">
                            {getFuelTypeLabel(fuel.key)}
                            {isSelected && (
                              <span className="text-[10px] bg-white/90 text-[#1c1917] border border-stone-200/60 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                {translate(currentLang, "activeFuel")}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 font-mono opacity-90">
                            {currencySymbol}{fuel.price.toFixed(3)}
                          </td>
                          <td className="py-4 px-4 opacity-90">
                            {fuel.consumption.toFixed(1)} {fuel.baseKey === "electric_price" ? (isImperial ? "mi/kWh" : "kWh/100km") : (isUS ? "MPG" : (isGB ? "MPG (UK)" : "L/100km"))}
                          </td>
                          <td className="py-4 px-4 font-bold font-mono">
                            {currencySymbol}{fuel.cost.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 font-mono opacity-95">
                            {fuel.co2.toFixed(1)} kg CO₂
                          </td>
                          <td className="py-4 px-4 text-right font-bold select-none tracking-widest text-lg">
                            {leaves}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
