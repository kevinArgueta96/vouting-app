export const routes = {
  home: (locale: string) => `/${locale}`,
  vote: {
    list: (locale: string) => `/${locale}/vote`,
    detail: (locale: string, id: string) => `/${locale}/vote/${id}`,
  },
  thanks: (locale: string) => `/${locale}/thanks`,
} as const;

// Helper function to ensure all routes are properly formatted with locale
export const getRoute = (
  path: (locale: string, ...args: any[]) => string,
  locale: string,
  ...args: any[]
) => {
  return path(locale, ...args);
};
