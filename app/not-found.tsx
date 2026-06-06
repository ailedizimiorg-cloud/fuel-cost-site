import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="text-6xl font-light text-gray-300 mb-6">404</h1>
      <h2 className="text-2xl font-semibold text-[#171717] mb-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved. Try searching for a city or browse popular destinations.
      </p>
      <div className="space-x-4">
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Go Home
        </Link>
        <Link
          href="/sitemap"
          className="inline-block px-6 py-3 border border-[#ebebeb] rounded-lg hover:border-blue-300 transition-colors font-medium"
        >
          Sitemap
        </Link>
      </div>
    </div>
  );
}
