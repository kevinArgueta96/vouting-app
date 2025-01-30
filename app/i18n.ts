import { getRequestConfig } from 'next-intl/server';
 
export const locales = ['en', 'fi'];
export const defaultLocale = 'en';
 
export default getRequestConfig(async ({ requestLocale }) => {
  if (!locales.includes(requestLocale as any)) {
    return {
      locale: defaultLocale,
      messages: (await import(`../messages/${defaultLocale}.json`)).default
    };
  }
 
  return {
    locale: requestLocale,
    messages: (await import(`../messages/${requestLocale}.json`)).default
  };
});
