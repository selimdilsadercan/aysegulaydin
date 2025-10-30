import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Locale = "en" | "tr" | "it" | "de" | "fr";

interface LanguageStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      locale: "en",
      setLocale: (locale) => set({ locale })
    }),
    {
      name: "language-storage",
      storage: typeof window !== "undefined" ? createJSONStorage(() => localStorage) : undefined
    }
  )
);
