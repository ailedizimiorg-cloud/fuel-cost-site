import { MetadataRoute } from 'next';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { countryToLanguage } from '@/lib/i18n';
import { getLocalizedUrl, allLanguages } from '@/lib/route-translations';

export const dynamic = 'force-dynamic';

const CHUNK_SIZE = 10000;

function getSupabase() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
}

export async function generateSitemaps() {
  const supabase = getSupabase();
  const { count, error } = await supabase
    .from('cities')
    .select('*', { count: 'exact', head: true });

  if (error || typeof count !== 'number') {
    console.error("Error getting total city count for sitemaps:", error);
    return [{ id: 0 }];
  }

  const sitemapsCount = Math.ceil(count / CHUNK_SIZE);
  return Array.from({ length: sitemapsCount }, (_, i) => ({ id: i }));
}

export default async function sitemap({ id }: { id: number | Promise<number> }): Promise<MetadataRoute.Sitemap> {
  const resolvedId = await id;
  const supabase = getSupabase();
  const start = resolvedId * CHUNK_SIZE;
  const end = start + CHUNK_SIZE - 1;

  try {
    const { data: cities, error } = await supabase
      .from('cities')
      .select('country_code, slug')
      .order('id', { ascending: true })
      .range(start, end);

    console.log(`[sitemap ${resolvedId}] cities count:`, cities?.length, 'start-end:', start, end, 'error:', error);

    if (error || !cities || cities.length === 0) {
      console.error(`Error fetching cities for sitemap chunk ${resolvedId}:`, error, 'start:', start, 'end:', end);
      return [];
    }

    const baseUrl = "https://fuelcost.info";
    const today = new Date();

    return cities
      .filter((city: any) => city.slug && city.country_code)
      .map((city: any) => {
        const cityLower = city.slug.toLowerCase();
        const country = city.country_code;
        const defaultLang = countryToLanguage[country.toUpperCase()] || country.toLowerCase();
        const canonicalUrl = `${baseUrl}${getLocalizedUrl(defaultLang, cityLower)}`;

        const alternates: { [key: string]: string } = {};
        allLanguages.forEach((lang) => {
          alternates[lang] = `${baseUrl}${getLocalizedUrl(lang, cityLower)}`;
        });

        return {
          url: canonicalUrl,
          lastModified: today,
          changeFrequency: 'weekly' as const,
          priority: 0.6,
          alternates: { languages: alternates },
        };
      });
  } catch (err) {
    console.error(`[sitemap ${resolvedId}] Unexpected error:`, err);
    return [];
  }
}
