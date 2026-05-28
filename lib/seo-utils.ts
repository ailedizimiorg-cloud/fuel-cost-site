import { createAdminClient } from './supabaseClient';
import { translate } from './i18n';
import { getCountryCurrency } from './currencies';

// lib/seo-utils.ts
export function generateDescription(
  city: string,
  price: number,
  currency: string = '$',
  countryCode: string = 'US',
  lang?: string
): string {
  const currentLang = lang || countryCode.toLowerCase();
  
  const isUS = countryCode.toUpperCase() === 'US';
  const isGB = countryCode.toUpperCase() === 'GB';
  
  if (isUS && (currentLang === 'en' || currentLang === 'us')) {
    const pricePerGallon = price * 3.78541;
    const consumption = 29.4; // MPG
    const costPerMile = (pricePerGallon / consumption).toFixed(3);
    return `In ${city.charAt(0).toUpperCase() + city.slice(1)}, the current price of gasoline is ${currency}${pricePerGallon.toFixed(2)} per gallon. For a standard car consuming ${consumption} MPG, driving 1 mile costs ${currency}${costPerMile}. This guide provides real-time updates and cost analysis for drivers in the region.`;
  } else if (isGB && (currentLang === 'en' || currentLang === 'gb')) {
    const consumption = 35.3; // MPG (UK)
    const costPerMile = ((4.54609 / consumption) * price).toFixed(3);
    return `In ${city.charAt(0).toUpperCase() + city.slice(1)}, the current price of gasoline is ${currency}${price.toFixed(2)} per liter. For a standard car consuming ${consumption} MPG, driving 1 mile costs ${currency}${costPerMile}. This guide provides real-time updates and cost analysis for drivers in the region.`;
  }
  
  const consumption = 8.0; // Standard matches default metric gasoline (8.0 L/100km)
  const costPerKm = ((price * consumption) / 100).toFixed(3);
  
  return translate(currentLang, 'description', {
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
    const storedPrice = parseFloat(item.gasoline_price);
    const storedCurrencyCode = item.currency_code || 'USD';
    
    // Resolve correct country currency
    const { code: localCode, symbol: localSymbol } = getCountryCurrency(item.country_code);

    // Convert stored price (usually USD) to its actual local price if needed
    let localPrice = storedPrice;
    if (storedCurrencyCode !== localCode && rates[storedCurrencyCode] && rates[localCode]) {
      localPrice = (storedPrice / rates[storedCurrencyCode]) * rates[localCode];
    }

    // Now calculate converted price in the target currency (current active city's currency)
    let convertedPrice: number | null = null;
    if (
      targetCurrencyCode && 
      targetCurrencyCode !== localCode && 
      rates[localCode] && 
      rates[targetCurrencyCode]
    ) {
      const usdPrice = localPrice / rates[localCode];
      convertedPrice = usdPrice * rates[targetCurrencyCode];
    }

    return {
      city: `${item.name} (${item.country_code})`,
      price: localPrice,
      currencySymbol: localSymbol,
      convertedPrice: convertedPrice,
      targetCurrencySymbol: targetCurrencySymbol || '$'
    };
  });
}
