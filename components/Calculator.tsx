"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Calculator({ initialPrice }: { initialPrice: number }) {
  const [fuelType, setFuelType] = useState("gasoline");
  const [price, setPrice] = useState(initialPrice.toString());
  const [consumption, setConsumption] = useState("8.0");

  const priceNum = parseFloat(price) || 0;
  const consNum = parseFloat(consumption) || 0;
  const costPerKm = (priceNum * consNum) / 100;
  const monthlyCost = costPerKm * 1000;

  return (
    <Card className="w-full max-w-sm shadow-[0_0_0_1px_rgba(0,0,0,0.08)] rounded-xl">
      <CardHeader>
        <CardTitle className="text-xl">Fuel Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Fuel Type</Label>
          <Select onValueChange={setFuelType} defaultValue="gasoline">
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gasoline">Gasoline</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="lpg">LPG</SelectItem>
              <SelectItem value="electric">Electric</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price per Liter/Unit ($)</Label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Consumption (L/100km)</Label>
          <Input type="number" value={consumption} onChange={(e) => setConsumption(e.target.value)} />
        </div>

        <div className="pt-4 border-t border-[#ebebeb] space-y-4">
          <div>
            <p className="text-sm text-[#666666]">Cost per KM</p>
            <div className="text-4xl font-semibold">${costPerKm.toFixed(3)}</div>
          </div>
          <div>
            <p className="text-sm text-[#666666]">Monthly (1000km)</p>
            <div className="text-xl font-semibold">${monthlyCost.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
