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
  let data: any[] = [];
  
  // Directly get the total count of cities globally with valid gasoline price
  const { count: globalCount, error: globalCountError } = await supabase
    .from('cities')
    .select('*', { count: 'exact', head: true })
    .not('gasoline_price', 'is', null)
    .gt('gasoline_price', 0);
      
  if (!globalCountError && globalCount && globalCount > 10) {
    // Generate a random offset
    const maxOffset = Math.max(0, globalCount - 30);
    const randomOffset = Math.floor(Math.random() * (maxOffset + 1));
    
    // Fetch a slice of cities from anywhere in the world
    const { data: globalData, error: fetchError } = await supabase
      .from('cities')
      .select('name, country_code, gasoline_price, currency_symbol')
      .not('gasoline_price', 'is', null)
      .gt('gasoline_price', 0)
      .range(randomOffset, randomOffset + 29); // fetch 30 to get high diversity
      
    if (!fetchError && globalData) {
      data = globalData;
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
