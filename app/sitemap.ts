import { MetadataRoute } from 'next';
import { createAdminClient } from '@/lib/supabaseClient';

// We have ~44k cities. Let's slice into chunks of 10,000 cities each.
const CHUNK_SIZE = 10000;

export async function generateSitemaps() {
  const supabase = createAdminClient();
  
  // Get the exact count of cities
  const { count, error } = await supabase
    .from('cities')
    .select('*', { count: 'exact', head: true });

  if (error || typeof count !== 'number') {
    console.error("Error getting total city count for sitemaps:", error);
    return [{ id: 0 }];
  }

  const sitemapsCount = Math.ceil(count / CHUNK_SIZE);
  const sitemaps = Array.from({ length: sitemapsCount }, (_, i) => ({ id: i }));
  return sitemaps;
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();
  
  // Fetch chunk based on id
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
  const languagesList = ['en', 'tr', 'de', 'fr', 'es', 'it'];
  const today = new Date();

  return cities.map((city) => {
    const countryLower = city.country_code.toLowerCase();
    const cityLower = city.slug.toLowerCase();
    const canonicalUrl = `${baseUrl}/fuel-cost/${countryLower}/${cityLower}`;

    // Create the alternate language mapping for SEO hreflang
    const alternates: { [key: string]: string } = {};
    languagesList.forEach((lang) => {
      alternates[lang] = `${canonicalUrl}?lang=${lang}`;
    });

    return {
      url: canonicalUrl,
      lastModified: today,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: {
        languages: alternates,
      },
    };
  });
}
