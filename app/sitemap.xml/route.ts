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

  const citySitemaps = Array.from({ length: sitemapCount }, (_, i) =>
    `  <sitemap>\n    <loc>https://fuelcost.info/sitemap/${i}.xml</loc>\n  </sitemap>`
  ).join('\n');

  const staticPages = [
    { loc: 'https://fuelcost.info/', priority: '1.0', changefreq: 'daily' },
    { loc: 'https://fuelcost.info/blog', priority: '0.8', changefreq: 'daily' },
    { loc: 'https://fuelcost.info/about', priority: '0.6', changefreq: 'monthly' },
    { loc: 'https://fuelcost.info/how-to-use', priority: '0.7', changefreq: 'monthly' },
    { loc: 'https://fuelcost.info/faq', priority: '0.6', changefreq: 'monthly' },
    { loc: 'https://fuelcost.info/privacy', priority: '0.3', changefreq: 'yearly' },
    { loc: 'https://fuelcost.info/terms', priority: '0.3', changefreq: 'yearly' },
    { loc: 'https://fuelcost.info/contact', priority: '0.4', changefreq: 'monthly' },
    { loc: 'https://fuelcost.info/sitemap', priority: '0.5', changefreq: 'weekly' },
  ];

  const staticEntries = staticPages.map(p =>
    `  <sitemap>\n    <loc>${p.loc}</loc>\n  </sitemap>`
  ).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${citySitemaps}
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
