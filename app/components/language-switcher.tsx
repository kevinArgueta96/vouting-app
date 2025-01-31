'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales } from '../i18n';
import { useCallback } from 'react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = locale === 'en' ? 'fi' : 'en';
  const label = locale === 'en' ? 'Suomi' : 'English';

  const handleSwitch = useCallback(() => {
    if (!pathname) return;

    // Remove the current locale from the pathname
    const segments = pathname.split('/');
    segments[1] = switchLocale;
    
    // Construct the new path with the switched locale
    const newPath = segments.join('/');
    
    // Use replace to avoid adding to history stack
    router.replace(newPath);
  }, [pathname, router, switchLocale]);

  // Only render if we're using a supported locale
  if (!locales.includes(locale as any)) {
    return null;
  }

  return (
    <button
      onClick={handleSwitch}
      className="fixed top-4 right-4 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
      aria-label={`Switch to ${label}`}
    >
      {label}
    </button>
  );
}
