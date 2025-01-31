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

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default function middleware(request: any) {
  const pathname = request.nextUrl.pathname;

  // Skip validation for root path and static files
  if (pathname === '/' || /\.(jpg|png|svg|ico|json)$/.test(pathname)) {
    return intlMiddleware(request);
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
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all paths except static files and images
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/',
    '/(fi|en)/:path*'
  ]
};
