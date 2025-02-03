export const routes = {
  home: (locale: string) => `/${locale}`,
  vote: {
    list: (locale: string) => `/${locale}/vote`,
    detail: (locale: string, id: string) => `/${locale}/vote/${id}`,
  },
  thanks: (locale: string) => `/${locale}/thanks`,
} as const;

// Helper function to ensure all routes are properly formatted with locale
type RouteFunction = (locale: string, ...args: (string | number)[]) => string;

export const getRoute = (
  path: RouteFunction,
  locale: string,
  ...args: (string | number)[]
) => {
  return path(locale, ...args);
};
