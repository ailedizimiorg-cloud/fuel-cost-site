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

export async function getComparisonData(
  city: string, 
  countryCode: string,
  targetCurrencyCode?: string,
  targetCurrencySymbol?: string
) {
  const supabase = createAdminClient();
  
  // Fetch exchange rates from external API
  let rates: { [key: string]: number } = {};
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const json = await res.json();
    rates = json.rates || {};
  } catch (err) {
    console.error("Failed to fetch exchange rates for comparison:", err);
  }
  
  // Directly get the total count of cities globally with valid gasoline price
  const { count: globalCount, error: globalCountError } = await supabase
    .from('cities')
    .select('*', { count: 'exact', head: true })
    .not('gasoline_price', 'is', null)
    .gt('gasoline_price', 0);
      
  if (globalCountError || !globalCount) {
    return [];
  }

  // Helper to fetch exactly 1 city at a specific random offset
  const fetchCityAtOffset = async (offset: number) => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('name, country_code, gasoline_price, currency_symbol, currency_code')
        .not('gasoline_price', 'is', null)
        .gt('gasoline_price', 0)
        .range(offset, offset);
      
      return error || !data || data.length === 0 ? null : data[0];
    } catch {
      return null;
    }
  };

  // We make 15 parallel requests with random offsets to get a highly diverse pool
  const offsets = Array.from({ length: 15 }, () => Math.floor(Math.random() * globalCount));
  const fetchedCities = await Promise.all(offsets.map(offset => fetchCityAtOffset(offset)));

  const uniqueCountryCities: any[] = [];
  const seenCountries = new Set<string>();

  // Exclude current country from the comparison to ensure we show 5 other countries
  const currentCityLower = city.toLowerCase();
  const currentCountryUpper = countryCode.toUpperCase();
  seenCountries.add(currentCountryUpper);

  for (const item of fetchedCities) {
    if (!item || !item.country_code) continue;
    const cCode = item.country_code.toUpperCase();
    if (item.name.toLowerCase() === currentCityLower) continue;

    if (!seenCountries.has(cCode)) {
      seenCountries.add(cCode);
      uniqueCountryCities.push(item);
      if (uniqueCountryCities.length === 5) break;
    }
  }

  // Fallback: If we couldn't get 5 unique countries, allow duplicates from same country but different cities
  if (uniqueCountryCities.length < 5) {
    for (const item of fetchedCities) {
      if (!item) continue;
      if (item.name.toLowerCase() === currentCityLower) continue;

      const alreadyIncluded = uniqueCountryCities.some(
        x => x.name.toLowerCase() === item.name.toLowerCase() && x.country_code === item.country_code
      );
      if (!alreadyIncluded) {
        uniqueCountryCities.push(item);
        if (uniqueCountryCities.length === 5) break;
      }
    }
  }

  // Slice exactly to 5 items in case of fallback overflowing
  const finalCities = uniqueCountryCities.slice(0, 5);

  return finalCities.map(item => {
    const origPrice = parseFloat(item.gasoline_price);
    const origCurrencyCode = item.currency_code || 'USD';
    const origCurrencySymbol = item.currency_symbol || '$';

    let convertedPrice: number | null = null;
    if (
      targetCurrencyCode && 
      targetCurrencyCode !== origCurrencyCode && 
      rates[origCurrencyCode] && 
      rates[targetCurrencyCode]
    ) {
      const usdPrice = origPrice / rates[origCurrencyCode];
      convertedPrice = usdPrice * rates[targetCurrencyCode];
    }

    return {
      city: `${item.name} (${item.country_code})`,
      price: origPrice,
      currencySymbol: origCurrencySymbol,
      convertedPrice: convertedPrice,
      targetCurrencySymbol: targetCurrencySymbol || '$'
    };
  });
}
