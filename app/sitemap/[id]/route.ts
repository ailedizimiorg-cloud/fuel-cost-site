import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { countryToLanguage } from '@/lib/i18n';
import { getLocalizedUrl, allLanguages } from '@/lib/route-translations';

const CHUNK_SIZE = 10000;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chunkIndex = parseInt(id, 10);

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const start = chunkIndex * CHUNK_SIZE;
  const end = start + CHUNK_SIZE - 1;

  const { data: cities, error } = await supabase
    .from('cities')
    .select('slug, country_code')
    .range(start, end)
    .order('slug');

  if (error || !cities) {
    return new Response('Error fetching cities', { status: 500 });
  }

  const urls = cities.map((city: { slug: string; country_code: string }) => {
    const countryLang = countryToLanguage[city.country_code] || 'en';
    const loc = getLocalizedUrl(countryLang, city.slug);

    const alternates = allLanguages
      .map((lang) => {
        const href = getLocalizedUrl(lang, city.slug);
        return `    <xhtml:link rel="alternate" hreflang="${lang}" href="https://fuelcost.info${href}"/>`;
      })
      .join('\n');

    return `  <url>
    <loc>https://fuelcost.info${loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
${alternates}
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
