"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLanguageStore, Locale } from "./store";
import { getMessages } from "@/i18n";

type Messages = Awaited<ReturnType<typeof getMessages>>;

interface I18nContextType {
  messages: Messages | null;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const { locale, setLocale } = useLanguageStore();
  const [messages, setMessages] = useState<Messages | null>(null);

  useEffect(() => {
    getMessages(locale).then((msgs) => {
      setMessages(msgs);
    });
  }, [locale]);

  const t = (key: string): string => {
    if (!messages) return key;
    const keys = key.split(".");
    let value: any = messages;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) return key;
    }
    return typeof value === "string" ? value : key;
  };

  return <I18nContext.Provider value={{ messages, locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useTranslations() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslations must be used within I18nProvider");
  }
  return context;
}
