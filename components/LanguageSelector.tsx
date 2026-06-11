"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getLocalizedUrl } from "@/lib/route-translations";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "zh", name: "简体中文", flag: "🇨🇳" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "ro", name: "Română", flag: "🇷🇴" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
  { code: "no", name: "Norsk", flag: "🇳🇴" },
  { code: "da", name: "Dansk", flag: "🇩🇰" },
  { code: "fi", name: "Suomi", flag: "🇫🇮" },
  { code: "el", name: "Ελληνικά", flag: "🇬🇷" },
  { code: "cs", name: "Čeština", flag: "🇨🇿" },
];

interface LanguageSelectorProps {
  currentLang: string;
  citySlug?: string;
}

export default function LanguageSelector({ currentLang, citySlug }: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLanguageChange = (lang: string) => {
    // Save preference to cookie (1 year)
    document.cookie = `preferredLanguage=${lang};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
    // Build localized URL using route translations
    const params = new URLSearchParams(searchParams.toString());
    params.delete("lang");
    const qs = params.toString();
    const localizedUrl = getLocalizedUrl(lang, citySlug || "") + (qs ? `?${qs}` : "");
    router.push(localizedUrl);
  };

  return (
    <div className="flex items-center gap-2 bg-white border border-[#e7e5e4] rounded-lg px-3 py-1.5 w-fit ml-auto shadow-sm">
      <span className="text-xs text-[#78716c] font-semibold uppercase tracking-wider">Language:</span>
      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-transparent text-sm text-[#1c1917] font-semibold border-none outline-none cursor-pointer focus:ring-0 pr-1"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-white text-[#1c1917]">
            {lang.flag} &nbsp; {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
