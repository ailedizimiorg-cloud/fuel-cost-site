// lib/fuel-api.ts
import { createAdminClient } from './supabaseClient'; // Yetkili istemciyi import ediyoruz
import { getComparisonData, generateDescription } from './seo-utils';

export interface FuelPrices {
  gasoline_price: number | null;
  diesel_price: number | null;
  lpg_price: number | null;
  electric_price: number | null;
  data_source: string | null;
  currency: string | null;
  currency_code: string | null;
  currency_symbol: string | null;
}

export async function getFuelPrices(countryCode: string, city: string): Promise<FuelPrices | null> {
  const supabase = createAdminClient(); // Normal istemci yerine admin istemcisini kullanıyoruz
  
  console.log(`[${countryCode}] Admin client created. Querying Supabase...`);
  const { data, error } = await supabase
    .from('cities')
    .select('gasoline_price, diesel_price, lpg_price, electric_price, data_source, currency, currency_code, currency_symbol')
    .eq('country_code', countryCode.toUpperCase()) // Filtreyi geri ekledik
    .eq('slug', city)
    .limit(1)
    .single();
  
  console.log(`[${countryCode}] Supabase query finished.`);

  if (error) {
    console.error(`Error fetching fuel prices for ${countryCode}:`, error);
    return null;
  }

  if (!data) {
    return null;
  }
  
  return {
    gasoline_price: data.gasoline_price ? parseFloat(data.gasoline_price) : null,
    diesel_price: data.diesel_price ? parseFloat(data.diesel_price) : null,
    lpg_price: data.lpg_price ? parseFloat(data.lpg_price) : null,
    electric_price: data.electric_price ? parseFloat(data.electric_price) : null,
    data_source: data.data_source || null,
    currency: data.currency || null,
    currency_code: data.currency_code || null,
    currency_symbol: data.currency_symbol || null,
  };
}

export { getComparisonData, generateDescription };
