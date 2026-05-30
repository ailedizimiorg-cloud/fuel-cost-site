import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Map country codes that aren't language codes to their primary language
const countryToLang: Record<string, string> = {
  ch: 'de', be: 'nl', at: 'de', lu: 'fr', sg: 'en',
  ie: 'en', nz: 'en', au: 'en', ca: 'en', za: 'en',
  ph: 'en', ng: 'en', ke: 'en', tz: 'en', gh: 'en',
};

function getLangFromCountry(country: string): string {
  return countryToLang[country.toLowerCase()] || country.toLowerCase();
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (!pathname.startsWith('/fuel-cost/')) {
    return NextResponse.next();
  }

  // ---- 1. Lowercase enforcement ----
  const lowerPath = pathname.toLowerCase();
  if (pathname !== lowerPath) {
    const newUrl = new URL(lowerPath + search, request.url);
    return NextResponse.redirect(newUrl, 301);
  }

  // ---- 2. Redirect old ?lang=xx to path-based ----
  if (search) {
    const params = new URLSearchParams(search);
    const lang = params.get('lang');
    if (lang) {
      const segments = pathname.split('/').filter(Boolean);
      // segments: ['fuel-cost', 'countryOrLang', 'city']
      if (segments.length >= 3 && segments[0] === 'fuel-cost') {
        const city = segments[segments.length - 1];
        params.delete('lang');
        const remainingParams = params.toString();
        const newPath = `/fuel-cost/${lang.toLowerCase()}/${city}`;
        const newUrl = new URL(newPath + (remainingParams ? `?${remainingParams}` : ''), request.url);
        return NextResponse.redirect(newUrl, 301);
      }
    }
  }

  // ---- 3. Redirect old [country]/[city] to [lang]/[city] when country ≠ lang ----
  // Path is already lowercased at this point
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 3 && segments[0] === 'fuel-cost') {
    const firstSeg = segments[1]; // This was the country code, now should be language
    const city = segments[2];
    const expectedLang = getLangFromCountry(firstSeg);
    if (firstSeg !== expectedLang) {
      // Country code that isn't a language code → redirect to actual language
      const newUrl = new URL(`/fuel-cost/${expectedLang}/${city}`, request.url);
      return NextResponse.redirect(newUrl, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/fuel-cost/:path*'],
};
