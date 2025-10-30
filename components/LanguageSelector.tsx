"use client";

import { useTranslations } from "@/lib/i18n-client";
import { locales, Locale } from "@/i18n";

export default function LanguageSelector() {
  const { locale, setLocale, t } = useTranslations();

  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
  };

  const localeNames: Record<Locale, string> = {
    en: t("language.english"),
    tr: t("language.turkish"),
    it: t("language.italian"),
    de: t("language.german"),
    fr: t("language.french")
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
