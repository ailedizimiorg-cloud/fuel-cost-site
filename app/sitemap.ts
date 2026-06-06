import { MetadataRoute } from "next";

// Statik sayfalar
const staticPages = [
  { url: "/", priority: 1.0, changeFreq: "daily" as const },
  { url: "/about", priority: 0.8, changeFreq: "monthly" as const },
  { url: "/how-to-use", priority: 0.8, changeFreq: "monthly" as const },
  { url: "/faq", priority: 0.7, changeFreq: "monthly" as const },
  { url: "/blog", priority: 0.9, changeFreq: "daily" as const },
  { url: "/contact", priority: 0.5, changeFreq: "monthly" as const },
  { url: "/privacy", priority: 0.3, changeFreq: "yearly" as const },
  { url: "/terms", priority: 0.3, changeFreq: "yearly" as const },
  { url: "/sitemap", priority: 0.4, changeFreq: "weekly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://fuelcost.info";

  const staticEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));

  // Dynamic: blog posts
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `https://doslmfjcyfwigmdzhldk.supabase.co/rest/v1/blog_posts?select=slug,published_at&locale=eq.en&order=published_at.desc&limit=500`,
      {
        headers: {
          apikey: "sb_publishable_rAGjbBdCH0G2AIgYY2_tzQ_2T4m2Goe",
          Authorization:
            "Bearer sb_publishable_rAGjbBdCH0G2AIgYY2_tzQ_2T4m2Goe",
        },
        next: { revalidate: 3600 },
      }
    );
    if (res.ok) {
      const posts = await res.json();
      blogEntries = posts.map((post: { slug: string; published_at: string }) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.published_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (e) {
    // Silently continue — blog posts will be picked up on next build
  }

  // Dynamic: top cities
  let cityEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(
      `https://doslmfjcyfwigmdzhldk.supabase.co/rest/v1/cities?select=slug&order=population.desc&limit=1000`,
      {
        headers: {
          apikey: "sb_publishable_rAGjbBdCH0G2AIgYY2_tzQ_2T4m2Goe",
          Authorization:
            "Bearer sb_publishable_rAGjbBdCH0G2AIgYY2_tzQ_2T4m2Goe",
        },
        next: { revalidate: 86400 },
      }
    );
    if (res.ok) {
      const cities = await res.json();
      cityEntries = cities.map((city: { slug: string }) => ({
        url: `${baseUrl}/fuel-cost/en/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.9,
      }));
    }
  } catch (e) {
    // Silently continue
  }

  return [...staticEntries, ...blogEntries, ...cityEntries];
}
