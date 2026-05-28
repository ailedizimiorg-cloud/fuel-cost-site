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
    </div>
  );
}
