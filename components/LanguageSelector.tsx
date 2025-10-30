"use client";

import { useLanguageStore, Locale } from "@/lib/store";

const locales: Locale[] = ["en", "tr", "it", "de", "fr"];

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguageStore();

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  const localeNames: Record<Locale, string> = {
    en: "ENG",
    tr: "TR",
    it: "IT",
    de: "DE",
    fr: "FR"
  };

  return (
    <>
      {locales.map((loc) => (
        <div key={loc} className="flex flex-row items-center cursor-pointer" onClick={() => handleLanguageChange(loc)}>
          <p className={`font-normal text-primary text-[29px] ${loc === locale ? "opacity-100" : "opacity-40"} hover:opacity-60`}>{localeNames[loc]}</p>
        </div>
      ))}
    </>
  );
}
