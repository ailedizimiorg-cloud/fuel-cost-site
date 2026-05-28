import { createAdminClient } from './supabaseClient';
import { translate } from './i18n';

// lib/seo-utils.ts
export function generateDescription(
  city: string,
  price: number,
  currency: string = '$',
  countryCode: string = 'US'
): string {
  const consumption = 7;
  const costPerKm = ((price * consumption) / 100).toFixed(3);
  
  return translate(countryCode, 'description', {
    city: city.charAt(0).toUpperCase() + city.slice(1),
    price: price.toFixed(2),
    currency,
    consumption,
    costPerKm,
  });
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
