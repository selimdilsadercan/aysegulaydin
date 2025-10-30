export const locales = ["en", "tr", "it", "de", "fr"] as const;
export type Locale = (typeof locales)[number];

export const getMessages = async (locale: Locale = "en") => {
  try {
    return (await import(`./messages/${locale}.json`)).default;
  } catch (error) {
    // Fallback to English if locale file doesn't exist
    return (await import(`./messages/en.json`)).default;
  }
};
