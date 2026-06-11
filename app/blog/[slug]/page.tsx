import { createClient } from "@/lib/supabaseClient";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  locale: string;
  published_at: string;
  read_time: string;
  category: string;
  seo_title: string;
  seo_description: string;
}

async function getPost(slug: string, locale: string): Promise<BlogPost | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("locale", locale)
      .maybeSingle();
    if (error) {
      console.error("[getPost] Supabase error:", JSON.stringify(error));
      return null;
    }
    console.log("[getPost] slug:", slug, "locale:", locale, "found:", !!data);
    return data;
  } catch (e) {
    console.error("[getPost] Exception:", e);
    return null;
  }
}

async function getLocale(): Promise<string> {
  try {
    const headersList = await headers();
    const acceptLang = headersList.get("accept-language") || "en";
    return acceptLang.split(",")[0].split("-")[0].split(";")[0];
  } catch { return "en"; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await getPost(slug, locale) || await getPost(slug, "en"); // fallback to English
  if (!post) return { title: "Not Found" };

  const postUrl = `https://fuelcost.info/blog/${slug}`;
  const title = post.seo_title || post.title || "Fuel Price Article";
  const desc = post.seo_description || post.description || "";
  const supportedLangs = post.locale ? [post.locale] : ["en"];

  return {
    title,
    description: desc,
    alternates: {
      canonical: postUrl,
      languages: Object.fromEntries(supportedLangs.map(l => [l, postUrl])),
    },
    openGraph: {
      title,
      description: desc,
      type: "article",
      publishedTime: post.published_at,
      url: postUrl,
      images: [{ url: "/og-image.svg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: ["/og-image.svg"],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();
  const post = await getPost(slug, locale) || await getPost(slug, "en"); // fallback to English
  if (!post) notFound();
  const postLocale = post.locale || "en";

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-blue-600">FuelCost.info</Link>
        <span className="mx-2">/</span>
        <Link href="/blog" className="hover:text-blue-600">Blog</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium truncate max-w-[200px] inline-block">{post.title}</span>
      </nav>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.published_at,
            author: { "@type": "Organization", name: "FuelCost.info" },
            publisher: { "@type": "Organization", name: "FuelCost.info" },
          }),
        }}
      />

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
            {post.category && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{post.category}</span>}
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString(postLocale, { year: "numeric", month: "long", day: "numeric" })}
            </time>
            <span>·</span>
            <span>{post.read_time}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          {post.description && <p className="text-lg text-gray-600">{post.description}</p>}
        </header>

        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-li:text-gray-700"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <div className="mt-12 pt-8 border-t">
        <Link href="/blog" className="text-blue-600 hover:underline">
          ← {postLocale === "tr" ? "Tüm Yazılar" :
              postLocale === "de" ? "Alle Artikel" :
              postLocale === "fr" ? "Tous les articles" :
              "All Articles"}
        </Link>
      </div>
    </main>
  );
}
