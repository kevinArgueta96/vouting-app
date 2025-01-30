'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { routes } from '../config/routes';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const currentPathname = usePathname();

  const switchLocale = locale === 'en' ? 'fi' : 'en';
  const label = locale === 'en' ? 'Suomi' : 'English';

  const handleSwitch = () => {
    // Get the path after the locale
    const pathAfterLocale = currentPathname.replace(`/${locale}`, '');
    // If we're at the root, use home route
    if (pathAfterLocale === '') {
      router.push(`/${switchLocale}`);
      return;
    }
    // Otherwise, replace the current locale with the new one
    router.push(`/${switchLocale}${pathAfterLocale}`);
  };

  return (
    <button
      onClick={handleSwitch}
      className="fixed top-4 right-4 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
    >
      {label}
    </button>
  );
}
