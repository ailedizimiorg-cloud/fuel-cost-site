import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  resolveLocalizedSegment,
  getLocalizedSegment,
} from '@/lib/route-translations';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const firstSegment = pathname.split('/')[1] || '';

  // ---- CASE A: Localized path (e.g., /yakit-maliyeti/tr/istanbul) ----
  const resolvedLang = resolveLocalizedSegment(firstSegment);
  if (resolvedLang) {
    // Enforce lowercase on the entire URL
    const lowerPath = pathname.toLowerCase();
    if (pathname !== lowerPath) {
      return NextResponse.redirect(new URL(lowerPath + search, request.url), 301);
    }

    const segments = pathname.split('/').filter(Boolean);
    // segments: [localizedSeg, langCode, city]
    const pathLang = segments[1] || '';

    // If the path language doesn't match the resolved segment language,
    // this is an old-format URL that needs redirecting.
    // e.g. /fuel-cost/tr/istanbul → fuel-cost=en but pathLang=tr → redirect to /yakit-maliyeti/tr/istanbul
    if (pathLang && pathLang.toLowerCase() !== resolvedLang) {
      const city = segments[2] || '';
      const localizedSeg = getLocalizedSegment(pathLang.toLowerCase());

      // Handle old ?lang=xx query params
      let extraQs = '';
      if (search) {
        const params = new URLSearchParams(search);
        params.delete('lang');
        const remaining = params.toString();
        if (remaining) extraQs = `?${remaining}`;
      }

      return NextResponse.redirect(
        new URL(`/${localizedSeg}/${pathLang.toLowerCase()}/${city}${extraQs}`, request.url),
        301
      );
    }

    // Correct localized URL → rewrite to internal /fuel-cost/[lang]/[city]
    const restOfPath = pathname.slice(firstSegment.length + 1);
    const rewriteUrl = new URL(`/fuel-cost${restOfPath}${search}`, request.url);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-page-locale", resolvedLang);
    return NextResponse.rewrite(rewriteUrl, { request: { headers: requestHeaders } });
  }

  // ---- CASE B: Pure /fuel-cost/... internal route (should not normally happen) ----
  if (firstSegment === 'fuel-cost') {
    const lowerPath = pathname.toLowerCase();
    if (pathname !== lowerPath) {
      return NextResponse.redirect(new URL(lowerPath + search, request.url), 301);
    }

    const segments = pathname.split('/').filter(Boolean);
    if (segments.length >= 3 && segments[0] === 'fuel-cost') {
      const lang = segments[1];
      const city = segments[2];
      const localizedSeg = getLocalizedSegment(lang.toLowerCase());

      let extraQs = '';
      if (search) {
        const params = new URLSearchParams(search);
        params.delete('lang');
        const remaining = params.toString();
        if (remaining) extraQs = `?${remaining}`;
      }

      return NextResponse.redirect(
        new URL(`/${localizedSeg}/${lang.toLowerCase()}/${city}${extraQs}`, request.url),
        301
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/fuel-cost/:path*',
    '/yakit-maliyeti/:path*',
    '/kraftstoffkosten/:path*',
    '/cout-carburant/:path*',
    '/costo-combustible/:path*',
    '/costo-carburante/:path*',
    '/custo-combustivel/:path*',
    '/stoimost-topliva/:path*',
    '/ranliao-chengben/:path*',
    '/nenryou-hiyou/:path*',
    '/yeonlyo-biyong/:path*',
    '/brandstofkosten/:path*',
    '/koszt-paliwa/:path*',
    '/taklefat-alwaqoud/:path*',
    '/biaya-bbm/:path*',
    '/chi-phi-nhien-lieu/:path*',
    '/eendhan-keemat/:path*',
    '/vartist-palyva/:path*',
    '/cost-combustibil/:path*',
    '/branslekostnad/:path*',
    '/drivstoffkostnad/:path*',
    '/braendstofomkostning/:path*',
    '/polttoainekustannus/:path*',
    '/kostos-kaysimon/:path*',
    '/naklady-na-palivo/:path*',
  ],
};
