// lib/fuel-api.ts
import { createAdminClient } from './supabaseClient'; // Yetkili istemciyi import ediyoruz
import { getComparisonData, generateDescription } from './seo-utils';
import { cache } from 'react';
import { getCountryCurrency } from './currencies';

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

export const getFuelPrices = cache(async (countryCode: string, city: string): Promise<FuelPrices | null> => {
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

  // Get correct country currency from dictionary
  const { code: localCode, symbol: localSymbol } = getCountryCurrency(countryCode);

  // If stored currency is null, we assume it's USD (legacy data)
  const storedCurrencyCode = data.currency_code || 'USD';

  let gasoline = data.gasoline_price ? parseFloat(data.gasoline_price) : null;
  let diesel = data.diesel_price ? parseFloat(data.diesel_price) : null;
  let lpg = data.lpg_price ? parseFloat(data.lpg_price) : null;
  let electric = data.electric_price ? parseFloat(data.electric_price) : null;

  // Convert prices if they are stored in a different currency
  if (storedCurrencyCode !== localCode) {
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const json = await res.json();
      const rates = json.rates || {};
      
      if (rates[storedCurrencyCode] && rates[localCode]) {
        const toUsdRate = rates[storedCurrencyCode];
        const fromUsdRate = rates[localCode];
        
        if (gasoline) gasoline = (gasoline / toUsdRate) * fromUsdRate;
        if (diesel) diesel = (diesel / toUsdRate) * fromUsdRate;
        if (lpg) lpg = (lpg / toUsdRate) * fromUsdRate;
        if (electric) electric = (electric / toUsdRate) * fromUsdRate;
      }
    } catch (err) {
      console.error("Failed to fetch exchange rates for price conversion:", err);
    }
  }
  
  return {
    gasoline_price: gasoline,
    diesel_price: diesel,
    lpg_price: lpg,
    electric_price: electric,
    data_source: data.data_source || null,
    currency: localSymbol,
    currency_code: localCode,
    currency_symbol: localSymbol,
  };
});

export { getComparisonData, generateDescription };
