"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
];

interface LanguageSelectorProps {
  currentLang: string;
}

export default function LanguageSelector({ currentLang }: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLanguageChange = (lang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", lang);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 w-fit ml-auto">
      <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Language:</span>
      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-transparent text-sm text-white font-medium border-none outline-none cursor-pointer focus:ring-0 pr-1"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-gray-950 text-white">
            {lang.flag} &nbsp; {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
