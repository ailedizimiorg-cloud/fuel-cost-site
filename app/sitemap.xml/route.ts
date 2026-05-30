import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const CHUNK_SIZE = 10000;

export async function GET() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const { count } = await supabase
    .from('cities')
    .select('*', { count: 'exact', head: true });

  const totalCities = count || 1;
  const sitemapCount = Math.ceil(totalCities / CHUNK_SIZE);

  const sitemaps = Array.from({ length: sitemapCount }, (_, i) =>
    `  <sitemap>
    <loc>https://fuelcost.info/sitemap/${i}.xml</loc>
  </sitemap>`
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
