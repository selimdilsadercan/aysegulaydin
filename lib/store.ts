import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Locale = "en";

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

// Admin auth moved to lib/admin-auth.ts for simpler localStorage usage
