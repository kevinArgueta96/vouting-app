import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'fi'] as const;
export type Locale = typeof locales[number];
export const defaultLocale = 'en' satisfies Locale;

export default getRequestConfig(async ({ requestLocale }) => {
  // Ensure requestLocale is a string before checking
  const isValidLocale = typeof requestLocale === 'string' && locales.includes(requestLocale as Locale);
  const locale = isValidLocale ? (requestLocale as Locale) : defaultLocale;
  
  try {
    const messages = (await import(`../messages/${locale}.json`)).default;
    return { locale, messages };
  } catch (error) {
    // Fallback to default locale if message loading fails
    const messages = (await import(`../messages/${defaultLocale}.json`)).default;
    return { locale: defaultLocale, messages };
  }
});
