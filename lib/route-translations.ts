// lib/route-translations.ts
// Localized pathnames for i18n routing
// Maps lang code → localized "fuel-cost" slug for URL paths

const routeTranslations: Record<string, string> = {
  en: "fuel-cost",
  tr: "yakit-maliyeti",
  de: "kraftstoffkosten",
  fr: "cout-carburant",
  es: "costo-combustible",
  it: "costo-carburante",
  pt: "custo-combustivel",
  ru: "stoimost-topliva",
  zh: "ranliao-chengben",
  ja: "nenryou-hiyou",
  ko: "yeonlyo-biyong",
  nl: "brandstofkosten",
  pl: "koszt-paliwa",
  ar: "taklefat-alwaqoud",
  id: "biaya-bbm",
  vi: "chi-phi-nhien-lieu",
  hi: "eendhan-keemat",
  uk: "vartist-palyva",
  ro: "cost-combustibil",
  sv: "branslekostnad",
  no: "drivstoffkostnad",
  da: "braendstofomkostning",
  fi: "polttoainekustannus",
  el: "kostos-kaysimon",
  cs: "naklady-na-palivo",
};

// Reverse map: localized slug → lang code
const reverseRouteMap: Record<string, string> = {};
for (const [lang, slug] of Object.entries(routeTranslations)) {
  reverseRouteMap[slug] = lang;
}

/**
 * Get the localized URL path for a given language and city.
 * e.g. getLocalizedUrl("tr", "istanbul") → "/yakit-maliyeti/tr/istanbul"
 */
export function getLocalizedUrl(lang: string, city: string): string {
  const slug = routeTranslations[lang] || routeTranslations["en"];
  return `/${slug}/${lang.toLowerCase()}/${city.toLowerCase()}`;
}

/**
 * Get the localized route segment for a given language.
 * e.g. getLocalizedSegment("tr") → "yakit-maliyeti"
 */
export function getLocalizedSegment(lang: string): string {
  return routeTranslations[lang] || routeTranslations["en"];
}

/**
 * Resolve a localized path segment to its language code.
 * e.g. resolveLocalizedSegment("yakit-maliyeti") → "tr"
 * Returns null if the segment is not recognized.
 */
export function resolveLocalizedSegment(segment: string): string | null {
  return reverseRouteMap[segment] || null;
}

/**
 * All localized path segments for middleware matching.
 */
export const allLocalizedSegments = Object.values(routeTranslations);

/**
 * All supported language codes.
 */
export const allLanguages = Object.keys(routeTranslations);

export { routeTranslations, reverseRouteMap };
