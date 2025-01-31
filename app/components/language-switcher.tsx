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
      className="flex items-center space-x-2 w-full px-4 py-2 text-[#37529B] hover:bg-white rounded-lg transition-colors"
      aria-label={`Switch to ${label}`}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM4 12C4 11.39 4.08 10.79 4.21 10.22L8.99 15V16C8.99 17.1 9.89 18 10.99 18V19.93C7.06 19.43 4 16.07 4 12ZM17.89 17.4C17.63 16.59 16.89 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.89 17.4Z" fill="currentColor"/>
      </svg>
      <span>{label}</span>
    </button>
  );
}
