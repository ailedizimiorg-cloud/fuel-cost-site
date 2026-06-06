import { createClient } from "@/lib/supabaseClient";
import { headers } from "next/headers";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fuel Price Blog - Insights, Analysis & Trends | FuelCost.info",
  description: "Expert analysis on global fuel prices, energy market trends, EV charging costs, and money-saving tips for drivers worldwide.",
  alternates: { canonical: "https://fuelcost.info/blog" },
  openGraph: {
    title: "Fuel Price Blog - Insights, Analysis & Trends",
    description: "Expert analysis on global fuel prices, energy market trends, EV charging costs, and money-saving tips.",
    url: "https://fuelcost.info/blog",
    type: "website",
  },
};

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  locale: string;
  published_at: string;
  read_time: string;
  category: string;
}

async function getPosts(locale: string): Promise<BlogPost[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id,slug,title,description,locale,published_at,read_time,category")
    .eq("published", true)
    .eq("locale", locale)
    .order("published_at", { ascending: false })
    .limit(20);
  return data || [];
}

async function getLocale(): Promise<string> {
  try {
    const headersList = await headers();
    const acceptLang = headersList.get("accept-language") || "en";
    const lang = acceptLang.split(",")[0].split("-")[0].split(";")[0];
    const supported = ["en","tr","de","fr","es","it","pt","ru","zh","ja","ko","nl","pl","ar","id","vi","hi","uk","ro","sv","no","da","fi","el","cs","sk"];
    return supported.includes(lang) ? lang : "en";
  } catch { return "en"; }
}

export default async function BlogPage() {
  const locale = await getLocale();
  const posts = await getPosts(locale);

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">FuelCost.info</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium">Blog</span>
      </nav>

      <h1 className="text-4xl font-bold mb-4">
        {locale === "tr" ? "Yakıt Fiyatları Blogu" :
         locale === "de" ? "Kraftstoffpreise Blog" :
         locale === "fr" ? "Blog Prix du Carburant" :
         locale === "es" ? "Blog Precios de Combustible" :
         locale === "it" ? "Blog Prezzi Carburante" :
         "Fuel Price Blog"}
      </h1>
      <p className="text-lg text-gray-600 mb-10">
        {locale === "tr" ? "Küresel yakıt fiyatları, enerji piyasası trendleri ve tasarruf ipuçları hakkında uzman analizleri." :
         locale === "de" ? "Expertenanalysen zu globalen Kraftstoffpreisen, Energiemarkttrends und Spartipps." :
         "Expert analysis on global fuel prices, energy market trends, and money-saving tips for drivers."}
      </p>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl mb-2">📝</p>
          <p>{locale === "tr" ? "Henüz blog yazısı yok. Yakında gelecek!" : "No blog posts yet. Coming soon!"}</p>
        </div>
      ) : (
        <div className="grid gap-8">
          {posts.map((post) => (
            <article key={post.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                {post.category && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{post.category}</span>}
                <time dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" })}</time>
                <span>·</span>
                <span>{post.read_time}</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-3">{post.description}</p>
              <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline text-sm font-medium">
                {locale === "tr" ? "Devamını Oku →" :
                 locale === "de" ? "Weiterlesen →" :
                 locale === "fr" ? "Lire la suite →" :
                 locale === "es" ? "Leer más →" :
                 "Read More →"}
              </Link>
            </article>
          ))}
        </div>
      )}

      <div className="mt-16 p-6 bg-gray-50 rounded-lg text-center">
        <p className="text-sm text-gray-500">
          {locale === "tr" ? "Yakıt fiyatları hakkında daha fazla bilgi için" : "For more fuel price information, visit"}{" "}
          <Link href="/" className="text-blue-600 hover:underline font-medium">FuelCost.info</Link>.
        </p>
      </div>
    </main>
  );
}
