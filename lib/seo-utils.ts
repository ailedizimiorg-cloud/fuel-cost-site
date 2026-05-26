import { createAdminClient } from './supabaseClient';
// lib/seo-utils.ts
export function generateDescription(city: string, price: number, currency: string = '$'): string {
  const consumption = 7;
  const costPerKm = ((price * consumption) / 100).toFixed(3);
  return `In ${city}, the current price of gasoline is ${currency}${price}. For a standard car consuming ${consumption}L/100km, driving 1km costs ${currency}${costPerKm}. This guide provides real-time updates and cost analysis for drivers in the region.`;
}

export async function getComparisonData(city: string, countryCode: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('cities')
    .select('name, gasoline_price')
    .eq('country_code', countryCode.toUpperCase())
    .neq('slug', city)
    .limit(3);

  if (error) {
    console.error('Error fetching comparison data:', error);
    return [];
  }

  return (data || [])
    .filter(item => item.gasoline_price !== null && item.gasoline_price !== undefined)
    .map(item => ({ city: item.name, price: parseFloat(item.gasoline_price) }));
}
