// lib/seo-utils.ts
export function generateDescription(city: string, price: number, currency: string = '$'): string {
  const consumption = 7;
  const costPerKm = ((price * consumption) / 100).toFixed(3);
  return `In ${city}, the current price of gasoline is ${currency}${price}. For a standard car consuming ${consumption}L/100km, driving 1km costs ${currency}${costPerKm}. This guide provides real-time updates and cost analysis for drivers in the region.`;
}

export function getComparisonData(city: string) {
  return [
    { city: 'Neighbor City A', price: 1.15 },
    { city: 'Neighbor City B', price: 1.35 },
    { city: 'National Average', price: 1.25 },
  ];
}
