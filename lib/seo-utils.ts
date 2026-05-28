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
  
  // First, let's try to get the count of cities in this country with gasoline price
  const { count, error: countError } = await supabase
    .from('cities')
    .select('*', { count: 'exact', head: true })
    .eq('country_code', countryCode.toUpperCase())
    .not('gasoline_price', 'is', null)
    .gt('gasoline_price', 0);

  let data: any[] = [];
  
  if (!countError && count && count >= 6) { // we need at least 6 to choose 5 that doesn't include current city
    const maxOffset = count - 6;
    const randomOffset = Math.floor(Math.random() * (maxOffset + 1));
    
    const { data: countryData, error: fetchError } = await supabase
      .from('cities')
      .select('name, country_code, gasoline_price, currency_symbol')
      .eq('country_code', countryCode.toUpperCase())
      .not('gasoline_price', 'is', null)
      .gt('gasoline_price', 0)
      .range(randomOffset, randomOffset + 10); // fetch a bit more to filter out the current city and guarantee 5
      
    if (!fetchError && countryData) {
      data = countryData;
    }
  }
  
  // If we couldn't get enough same-country cities, let's get random global cities
  if (data.length < 5) {
    const { count: globalCount, error: globalCountError } = await supabase
      .from('cities')
      .select('*', { count: 'exact', head: true })
      .not('gasoline_price', 'is', null)
      .gt('gasoline_price', 0);
      
    if (!globalCountError && globalCount) {
      const maxOffset = globalCount - 15;
      const randomOffset = Math.floor(Math.random() * (maxOffset + 1));
      
      const { data: globalData, error: fetchError } = await supabase
        .from('cities')
        .select('name, country_code, gasoline_price, currency_symbol')
        .not('gasoline_price', 'is', null)
        .gt('gasoline_price', 0)
        .range(randomOffset, randomOffset + 15);
        
      if (!fetchError && globalData) {
        data = globalData;
      }
    }
  }

  // Filter out current city and shuffle the data to make it truly random
  const shuffled = (data || [])
    .filter(item => item.name.toLowerCase() !== city.toLowerCase())
    .sort(() => 0.5 - Math.random())
    .slice(0, 5);

  return shuffled.map(item => ({
    city: `${item.name} (${item.country_code})`,
    price: parseFloat(item.gasoline_price),
    currencySymbol: item.currency_symbol || '$'
  }));
}
