"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="text-6xl font-light text-gray-300 mb-6">500</h1>
      <h2 className="text-2xl font-semibold text-[#171717] mb-4">
        Something Went Wrong
      </h2>
      <p className="text-gray-600 mb-8">
        An unexpected error occurred. Please try again or go back to the home page.
      </p>
      <div className="space-x-4">
        <button
          onClick={reset}
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="inline-block px-6 py-3 border border-[#ebebeb] rounded-lg hover:border-blue-300 transition-colors font-medium"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
