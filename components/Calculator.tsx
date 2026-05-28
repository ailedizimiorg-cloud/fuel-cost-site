"use client";

import { useState, useEffect } from "react";
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

const fuelTypeKeys: (keyof FuelPrices)[] = [
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

  const [fuelType, setFuelType] = useState<keyof FuelPrices>(defaultFuelType);
  const [price, setPrice] = useState("");
  const [consumption, setConsumption] = useState("8.0");
  const [monthlyDistance, setMonthlyDistance] = useState("1000");

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

  const availableFuels = fuelTypeKeys.filter(key => {
    const val = initialPrices[key];
    return val !== null && val !== undefined && typeof val === "number" && val > 0;
  }).map(key => {
    const priceVal = initialPrices[key] as number;
    const consVal = getConsumptionForFuel(key);
    const cost = (priceVal * consVal / 100) * distanceNum;
    const co2 = (CO2_EMISSIONS[key] || 0) * (consVal / 100) * distanceNum;
    return {
      key,
      price: priceVal,
      consumption: consVal,
      cost,
      co2
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
  const periodCost = costPerKm * distanceNum;

  const currencySymbol = initialPrices.currency_symbol || initialPrices.currency || "$";
  const dataSource = initialPrices.data_source || "Database Scraper";

  const isElectric = fuelType === "electric_price";
  const unitLabel = isElectric ? "kWh" : "Liter";
  const consLabel = isElectric ? "kWh/100km" : "L/100km";

  const translatedUnitLabel = translate(currentLang, `units.${unitLabel}`);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full max-w-4xl mx-auto my-8">
      {/* Left side: Tabbed fuel types list and source details */}
      <div className="md:col-span-7 space-y-6">
        <h3 className="text-xl font-semibold text-white tracking-tight mb-2">
          {translate(currentLang, 'selectFuelType')}
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
                    {translate(currentLang, 'notAvailable')}
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
              {translate(currentLang, 'dataSource')}
            </span>
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {translate(currentLang, 'verified')}
            </span>
          </div>
          <p className="text-lg font-medium text-gray-200">
            {dataSource}
          </p>
          <p className="text-sm text-gray-400">
            {translate(currentLang, 'dataSourceDescription')}
          </p>
        </div>
      </div>

      {/* Right side: Fuel Cost Calculator */}
      <div className="md:col-span-5">
        <Card className="bg-gray-900/40 border border-gray-800/80 rounded-xl h-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-white font-semibold">
              {translate(currentLang, 'costEstimator')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Price Override Input */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-400">
                {translate(currentLang, 'pricePerUnit', { unit: translatedUnitLabel, currency: currencySymbol })}
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
                {translate(currentLang, 'consumptionLabel', { cons: consLabel })}
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
                {translate(currentLang, 'calculateDistance')}
              </Label>
              <Input
                type="number"
                step="100"
                value={monthlyDistance}
                onChange={(e) => setMonthlyDistance(e.target.value)}
                className="bg-gray-850 border-gray-800 focus:border-gray-700 text-white font-medium"
              />
            </div>

            {/* Result Outputs */}
            <div className="pt-4 border-t border-gray-800/80 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                  {translate(currentLang, 'costPerKm')}
                </p>
                <div className="text-3xl font-bold text-white tracking-tight mt-0.5">
                  {currencySymbol}{costPerKm.toFixed(3)}
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
                  {translate(currentLang, 'totalCost', { distance: monthlyDistance })}
                </p>
                <div className="text-xl font-semibold text-gray-200 mt-0.5">
                  {currencySymbol}{periodCost.toFixed(2)}
                </div>
              </div>
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
                  {translate(currentLang, 'comparisonTable')}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {translate(currentLang, 'forDistance', { distance: monthlyDistance })}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg border border-green-500/20 text-xs font-semibold">
                <span>🍃</span>
                <span>
                  {currentLang === 'tr'
                    ? 'En Ucuz & En Doğa Dostu Yakıt En Fazla Yaprağı Alır'
                    : 'Cheapest & Eco-friendliest Fuel Gets Most Leaves'}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="py-3 px-4">
                      {currentLang === 'tr' ? 'Yakıt Türü' : 'Fuel Type'}
                    </th>
                    <th className="py-3 px-4">
                      {translate(currentLang, 'price')}
                    </th>
                    <th className="py-3 px-4">
                      {currentLang === 'tr' ? 'Tüketim' : 'Consumption'}
                    </th>
                    <th className="py-3 px-4">
                      {currentLang === 'tr' ? 'Maliyet' : 'Cost'}
                    </th>
                    <th className="py-3 px-4">
                      {translate(currentLang, 'co2Emission')}
                    </th>
                    <th className="py-3 px-4 text-right">
                      {translate(currentLang, 'ecoScore')}
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
                              {currentLang === 'tr' ? 'Aktif' : 'Active'}
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
  );
}
