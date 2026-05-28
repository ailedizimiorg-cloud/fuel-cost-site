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
}

type FuelTypeKey = "gasoline_price" | "diesel_price" | "lpg_price" | "electric_price";

const fuelTypeKeys: FuelTypeKey[] = [
  "gasoline_price",
  "diesel_price",
  "lpg_price",
  "electric_price"
];

const DEFAULT_CONSUMPTIONS: { [key: string]: number } = {
  gasoline_price: 8.0,
  diesel_price: 6.0,
  lpg_price: 10.0,
  electric_price: 18.0
};

const CO2_EMISSIONS: { [key: string]: number } = {
  gasoline_price: 2.31, // kg CO2 per Liter
  diesel_price: 2.68,   // kg CO2 per Liter
  lpg_price: 1.51,      // kg CO2 per Liter
  electric_price: 0.40  // kg CO2 per kWh (standard grid)
};

export default function Calculator({ initialPrices, countryCode, lang }: CalculatorProps) {
  const currentLang = lang || countryCode;
  
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
    setPrice(newPrice.toString());
    
    // Set appropriate default consumption for electric vs fuel
    if (fuelType === "electric_price") {
      setConsumption("18.0"); // 18 kWh/100km is typical for EVs
    } else {
      setConsumption("8.0"); // 8 L/100km for regular cars
    }
  }, [fuelType, initialPrices]);

  const priceNum = parseFloat(price) || 0;
  const consNum = parseFloat(consumption) || 0;
  const distanceNum = parseFloat(monthlyDistance) || 0;

  const getConsumptionForFuel = (key: string) => {
    if (key === fuelType) {
      return parseFloat(consumption) || 0;
    }
    return DEFAULT_CONSUMPTIONS[key] || 0;
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
    const finalPriceRaw = (stopPrice !== null && stopPrice !== undefined && stopPrice > 0) ? stopPrice : (initialPrices[fuelKey] as number || 0);
    const finalCurrencyCode = (stopPrice !== null && stopPrice !== undefined && stopPrice > 0) ? stopCurrencyCode : (initialPrices.currency_code || "USD");

    const convertedPrice = convertPrice(finalPriceRaw, finalCurrencyCode);
    const legDistance = isStart ? 0 : stops[stopIndex].distance;
    const cons = getConsumptionForFuel(fuelKey);
    const cost = (convertedPrice * cons / 100) * legDistance;
    const co2 = (CO2_EMISSIONS[fuelKey] || 0) * (cons / 100) * legDistance;

    return {
      price: convertedPrice,
      rawPrice: finalPriceRaw,
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
  const availableFuels = fuelTypeKeys.filter(key => {
    const val = initialPrices[key];
    return val !== null && val !== undefined && typeof val === "number" && val > 0;
  }).map(key => {
    const priceVal = initialPrices[key] as number;
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
      cost = (priceVal * consVal / 100) * distanceNum;
      co2 = (CO2_EMISSIONS[key] || 0) * (consVal / 100) * distanceNum;
    }

    return {
      key,
      price: priceVal,
      consumption: consVal,
      cost,
      co2,
      distance: distanceVal
    };
  });

  const minCost = availableFuels.length > 0 ? Math.min(...availableFuels.map(f => f.cost)) : 0;
  const maxCost = availableFuels.length > 0 ? Math.max(...availableFuels.map(f => f.cost)) : 0;
  const minCo2 = availableFuels.length > 0 ? Math.min(...availableFuels.map(f => f.co2)) : 0;
  const maxCo2 = availableFuels.length > 0 ? Math.max(...availableFuels.map(f => f.co2)) : 0;

  const fuelsWithScore = availableFuels.map(fuel => {
    const costDiff = maxCost - minCost;
    const costScore = costDiff === 0 ? 1 : (maxCost - fuel.cost) / costDiff;

    const co2Diff = maxCo2 - minCo2;
    const co2Score = co2Diff === 0 ? 1 : (maxCo2 - fuel.co2) / co2Diff;

    const combinedScore = (costScore * 0.5) + (co2Score * 0.5);
    const leafCount = Math.round(1 + combinedScore * 4);

    return {
      ...fuel,
      leafCount
    };
  });

  const costPerKm = (priceNum * consNum) / 100;
  
  // Calculate final outputs based on mode
  const totalRouteDistance = stops.reduce((sum, s) => sum + s.distance, 0);
  const routeCostObj = getRouteTotalForFuel(fuelType);
  const periodCost = mode === "route" ? routeCostObj.cost : (costPerKm * distanceNum);

  const currencySymbol = initialPrices.currency_symbol || initialPrices.currency || "$";
  const dataSource = initialPrices.data_source || "Database Scraper";

  const isElectric = fuelType === "electric_price";
  const unitLabel = isElectric ? "kWh" : "Liter";
  const consLabel = isElectric ? "kWh/100km" : "L/100km";

  const translatedUnitLabel = translate(currentLang, `units.${unitLabel}`);

  const addStopToRoute = async (city: any) => {
    setSearchLoading(true);
    try {
      const response = await fetch(`/api/cities/prices?country=${city.country_code}&city=${city.slug}`);
      const prices = await response.json();
      
      const newStop: RouteStop = {
        id: Math.random().toString(36).substr(2, 9),
        name: city.name,
        slug: city.slug,
        country_code: city.country_code,
        distance: 150, // default leg distance in km
        prices: response.ok ? prices : null
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
      {/* Mode Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl p-1 bg-gray-950 border border-gray-800">
          <button
            onClick={() => setMode("simple")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              mode === "simple"
                ? "bg-white text-black font-semibold shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {translate(currentLang, "standardMode")}
          </button>
          <button
            onClick={() => setMode("route")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              mode === "route"
                ? "bg-white text-black font-semibold shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>{translate(currentLang, "routePlanner")}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full max-w-4xl mx-auto">
        {/* Left side: Tabbed fuel types list and source details / Route planner */}
        <div className="md:col-span-7 space-y-6">
          {mode === "simple" ? (
            <>
              <h3 className="text-xl font-semibold text-white tracking-tight mb-2">
                {translate(currentLang, "selectFuelType")}
              </h3>
              
              {/* Dynamic Brutalist Tabs with prices inside */}
              <div className="grid grid-cols-2 gap-3">
                {fuelTypeKeys.map((key) => {
                  const val = initialPrices[key] as number | null;
                  const isAvailable = val !== null && val !== undefined && val > 0;
                  const isActive = fuelType === key;

                  if (!isAvailable) {
                    return (
                      <div
                        key={key}
                        className="p-4 rounded-xl border border-dashed border-gray-800 text-gray-600 bg-gray-900/30 select-none opacity-50"
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

                  return (
                    <button
                      key={key}
                      onClick={() => setFuelType(key)}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isActive
                          ? "bg-white text-black border-white shadow-xl scale-[1.02]"
                          : "bg-gray-850 text-gray-300 border-gray-800 hover:border-gray-700 hover:bg-gray-800"
                      }`}
                    >
                      <span className={`block text-xs uppercase font-medium tracking-wider ${isActive ? "text-gray-600" : "text-gray-500"}`}>
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
              <div className="bg-gray-900/50 border border-gray-800/80 p-5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    {translate(currentLang, "dataSource")}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {translate(currentLang, "verified")}
                  </span>
                </div>
                <p className="text-lg font-medium text-gray-200">
                  {dataSource}
                </p>
                <p className="text-sm text-gray-400">
                  {translate(currentLang, "dataSourceDescription")}
                </p>
              </div>
            </>
          ) : (
            // Route Planner Flow
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                <span>🛣️</span> {translate(currentLang, "routePlanner")}
              </h3>

              {/* Stops list representation */}
              <div className="space-y-4 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[2px] before:bg-gray-800">
                {/* Leg 0 (Start Location) */}
                <div className="flex gap-4 items-start relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0 text-sm">
                    A
                  </div>
                  <div className="flex-1 bg-gray-900/40 border border-gray-800 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                        {translate(currentLang, "startLocation", { city: "" })}
                      </p>
                      <h4 className="text-base font-semibold text-white capitalize">
                        {translate(currentLang, "startLocation", { city: "" }) ? "" : "Start: "}
                        {initialPrices.currency_code ? `${countryCode.toUpperCase()} - ` : ""}
                        {typeof window !== "undefined" ? window.location.pathname.split("/").pop() : "Current City"}
                      </h4>
                    </div>
                    <span className="px-2 py-1 text-[11px] font-mono text-gray-400 bg-gray-850 border border-gray-800 rounded">
                      {initialPrices.currency_code}
                    </span>
                  </div>
                </div>

                {/* Additional Stops */}
                {stops.map((stop, index) => {
                  const letter = String.fromCharCode(66 + index); // B, C, D...
                  return (
                    <div key={stop.id} className="flex gap-4 items-start relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 font-bold shrink-0 text-sm">
                        {letter}
                      </div>
                      <div className="flex-1 space-y-3 bg-gray-900/40 border border-gray-800 p-4 rounded-xl">
                        <div className="flex items-center justify-between">
                          <h4 className="text-base font-semibold text-white capitalize">
                            {stop.name} ({stop.country_code})
                          </h4>
                          <button
                            onClick={() => removeStop(stop.id)}
                            className="text-gray-500 hover:text-red-400 p-1 rounded-lg transition duration-150 cursor-pointer text-sm font-medium"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-xs text-gray-500 uppercase font-medium">
                            {translate(currentLang, "distanceTo", { city: stop.name })}
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="1"
                              value={stop.distance}
                              onChange={(e) => updateStopDistance(stop.id, e.target.value)}
                              className="bg-gray-850 border-gray-800 focus:border-gray-700 text-white font-mono w-32"
                            />
                            <span className="text-sm text-gray-400 font-medium">km</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Stop Inputs */}
              <div ref={searchContainerRef} className="relative pt-2">
                <Label className="block text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">
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
                    className="bg-gray-900 border-gray-800 focus:border-gray-700 text-white rounded-xl py-3 px-4"
                  />
                  {searchLoading && (
                    <div className="absolute right-3 top-3.5 flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                    </div>
                  )}
                </div>

                {searchOpen && searchQuery.trim().length >= 2 && (
                  <div className="absolute z-50 w-full mt-2 bg-gray-950 border border-gray-850 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      searchResults.map((city) => (
                        <button
                          key={`${city.country_code}-${city.slug}`}
                          onClick={() => addStopToRoute(city)}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-gray-900 text-gray-300 hover:text-white transition duration-150 flex items-center justify-between border-b border-gray-900"
                        >
                          <span className="font-medium">{city.name}</span>
                          <span className="text-xs text-gray-500 uppercase font-mono px-2 py-0.5 bg-gray-900 border border-gray-800 rounded">
                            {city.country_code}
                          </span>
                        </button>
                      ))
                    ) : (
                      !searchLoading && (
                        <div className="px-4 py-3 text-sm text-gray-500">
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
          <Card className="bg-gray-900/40 border border-gray-800/80 rounded-xl h-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-white font-semibold">
                {mode === "simple"
                  ? translate(currentLang, "costEstimator")
                  : translate(currentLang, "routeCostSummary")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {mode === "simple" ? (
                <>
                  {/* Price Override Input */}
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-400">
                      {translate(currentLang, "pricePerUnit", { unit: translatedUnitLabel, currency: currencySymbol })}
                    </Label>
                    <Input
                      type="number"
                      step="0.001"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="bg-gray-850 border-gray-800 focus:border-gray-700 text-white font-medium"
                    />
                  </div>

                  {/* Consumption Input */}
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-400">
                      {translate(currentLang, "consumptionLabel", { cons: consLabel })}
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={consumption}
                      onChange={(e) => setConsumption(e.target.value)}
                      className="bg-gray-850 border-gray-800 focus:border-gray-700 text-white font-medium"
                    />
                  </div>

                  {/* Monthly Distance Input */}
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-400">
                      {translate(currentLang, "calculateDistance")}
                    </Label>
                    <Input
                      type="number"
                      step="100"
                      value={monthlyDistance}
                      onChange={(e) => setMonthlyDistance(e.target.value)}
                      className="bg-gray-850 border-gray-800 focus:border-gray-700 text-white font-medium"
                    />
                  </div>
                </>
              ) : (
                // Route Mode Cost Estimator inputs
                <div className="space-y-5">
                  <div className="p-4 bg-gray-950/40 border border-gray-850 rounded-xl flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                      {translate(currentLang, "fuelTypes." + fuelType as any)} Price
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {currencySymbol}{(initialPrices[fuelType] as number || 0).toFixed(3)}
                    </span>
                  </div>

                  {/* Consumption Input in Route Mode */}
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-400">
                      {translate(currentLang, "consumptionLabel", { cons: consLabel })}
                    </Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={consumption}
                      onChange={(e) => setConsumption(e.target.value)}
                      className="bg-gray-850 border-gray-800 focus:border-gray-700 text-white font-medium"
                    />
                  </div>
                </div>
              )}

              {/* Result Outputs */}
              <div className="pt-4 border-t border-gray-800/80 space-y-4">
                {mode === "simple" ? (
                  <>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                        {translate(currentLang, "costPerKm")}
                      </p>
                      <div className="text-3xl font-bold text-white tracking-tight mt-0.5 font-mono">
                        {currencySymbol}{costPerKm.toFixed(3)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                        {translate(currentLang, "totalCost", { distance: monthlyDistance })}
                      </p>
                      <div className="text-xl font-semibold text-gray-200 mt-0.5 font-mono">
                        {currencySymbol}{periodCost.toFixed(2)}
                      </div>
                    </div>
                  </>
                ) : (
                  // Route Mode Totals
                  <>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                        {translate(currentLang, "totalDistance")}
                      </p>
                      <div className="text-3xl font-bold text-white tracking-tight mt-0.5 font-mono">
                        {totalRouteDistance.toLocaleString()} km
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                        {translate(currentLang, "routeCostSummary")}
                      </p>
                      <div className="text-2xl font-bold text-green-400 mt-0.5 font-mono">
                        {currencySymbol}{periodCost.toFixed(2)}
                      </div>
                    </div>

                    {/* Breakdown of stops if any exist */}
                    {stops.length > 0 && (
                      <div className="pt-4 border-t border-gray-800/40 space-y-2">
                        <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                          Leg Costs:
                        </p>
                        <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
                          {stops.map((stop, idx) => {
                            const leg = calculateLegDetails(fuelType, idx);
                            return (
                              <div key={stop.id} className="flex justify-between text-gray-400">
                                <span>↳ {stop.name} ({leg.distance} km)</span>
                                <span className="text-gray-300 font-medium">
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
            <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {translate(currentLang, "comparisonTable")}
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    {translate(currentLang, "forDistance", {
                      distance: mode === "simple" ? monthlyDistance : totalRouteDistance.toString()
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/20 text-xs font-semibold">
                  <span>🍃</span>
                  <span>
                    {currentLang === "tr"
                      ? "En Ucuz & En Doğa Dostu Yakıt En Fazla Yaprağı Alır"
                      : "Cheapest & Eco-friendliest Fuel Gets Most Leaves"}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      <th className="py-3 px-4">
                        {currentLang === "tr" ? "Yakıt Türü" : "Fuel Type"}
                      </th>
                      <th className="py-3 px-4">
                        {translate(currentLang, "price")}
                      </th>
                      <th className="py-3 px-4">
                        {currentLang === "tr" ? "Tüketim" : "Consumption"}
                      </th>
                      <th className="py-3 px-4">
                        {currentLang === "tr" ? "Maliyet" : "Cost"}
                      </th>
                      <th className="py-3 px-4">
                        {translate(currentLang, "co2Emission")}
                      </th>
                      <th className="py-3 px-4 text-right">
                        {translate(currentLang, "ecoScore")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {fuelsWithScore.map((fuel) => {
                      const isSelected = fuelType === fuel.key;
                      const leaves = Array(fuel.leafCount).fill("🍃").join(" ");
                      return (
                        <tr
                          key={fuel.key}
                          className={`text-sm transition-colors ${
                            isSelected ? "bg-white/5 font-medium text-white" : "text-gray-300 hover:bg-gray-900/20"
                          }`}
                        >
                          <td className="py-4 px-4 font-semibold text-white flex items-center gap-2">
                            {translate(currentLang, `fuelTypes.${fuel.key}`)}
                            {isSelected && (
                              <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                {currentLang === "tr" ? "Aktif" : "Active"}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4 font-mono">
                            {currencySymbol}{fuel.price.toFixed(3)}
                          </td>
                          <td className="py-4 px-4">
                            {fuel.consumption.toFixed(1)} {fuel.key === "electric_price" ? "kWh/100km" : "L/100km"}
                          </td>
                          <td className="py-4 px-4 font-semibold font-mono text-white">
                            {currencySymbol}{fuel.cost.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 font-mono">
                            {fuel.co2.toFixed(1)} kg CO₂
                          </td>
                          <td className="py-4 px-4 text-right font-bold text-green-400 select-none tracking-widest text-lg">
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
