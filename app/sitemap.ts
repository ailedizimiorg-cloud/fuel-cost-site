import { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabaseClient';
import { countryToLanguage } from '@/lib/i18n';

const CHUNK_SIZE = 10000;

export async function generateSitemaps() {
  const supabase = createAdminClient();
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

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();
  const start = id * CHUNK_SIZE;
  const end = start + CHUNK_SIZE - 1;

  const { data: cities, error } = await supabase
    .from('cities')
    .select('country_code, slug')
    .order('id', { ascending: true })
    .range(start, end);

  if (error || !cities) {
    console.error(`Error fetching cities for sitemap chunk ${id}:`, error);
    return [];
  }

  const baseUrl = "https://fuelcost.info";
  const languagesList = ['en', 'tr', 'de', 'fr', 'es', 'it', 'pt', 'ru', 'zh', 'ja', 'ko',
    'nl', 'pl', 'ar', 'id', 'vi', 'hi', 'uk', 'ro', 'sv', 'no', 'da', 'fi', 'el', 'cs'];
  const today = new Date();

  return cities.map((city) => {
    const cityLower = city.slug.toLowerCase();
    const country = city.country_code;
    const defaultLang = countryToLanguage[country.toUpperCase()] || country.toLowerCase();
    const canonicalUrl = `${baseUrl}/fuel-cost/${defaultLang}/${cityLower}`;

    // Path-based hreflang alternates (no more ?lang=xx)
    const alternates: { [key: string]: string } = {};
    languagesList.forEach((lang) => {
      alternates[lang] = `${baseUrl}/fuel-cost/${lang}/${cityLower}`;
    });

    return {
      url: canonicalUrl,
      lastModified: today,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: { languages: alternates },
    };
  });
}
