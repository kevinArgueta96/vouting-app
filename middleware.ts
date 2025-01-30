import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { locales, defaultLocale } from './app/i18n';

// Valid path patterns
const validPaths = [
  /^\/[^/]+\/?$/, // home: /{locale}/
  /^\/[^/]+\/vote\/?$/, // vote list: /{locale}/vote
  /^\/[^/]+\/vote\/[^/]+\/?$/, // vote detail: /{locale}/vote/{id}
  /^\/[^/]+\/thanks\/?$/, // thanks: /{locale}/thanks
];

const middleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default async function middlewareHandler(request: any) {
  const pathname = request.nextUrl.pathname;

  // Skip validation for root path as it's handled by next-intl
  if (pathname === '/') {
    return middleware(request);
  }

  // Check if the path is valid
  const isValidPath = validPaths.some(pattern => pattern.test(pathname));
  
  if (!isValidPath) {
    // For paths with locale prefix, redirect to that locale's home
    if (/^\/[^/]+\/.*$/.test(pathname)) {
      const locale = pathname.split('/')[1];
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    // For paths without locale prefix, redirect to default locale home
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  // Continue with the intl middleware
  return middleware(request);
}

export const config = {
  matcher: ['/', '/(fi|en)/:path*']
};
