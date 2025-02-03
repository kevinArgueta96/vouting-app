'use client';

import { Button } from "../components/ui/button"
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { routes, getRoute } from '../config/routes'

export default function Home() {
  const t = useTranslations('Index')
  const locale = useLocale()

  return (
    <main className="flex min-h-screen flex-col items-center p-6 relative">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {t('title')}
        </h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          {t('description')}
        </p>
      </div>
      <div className="w-full max-w-md mb-8">
        <Button size="lg" className="w-full py-6" asChild>
          <Link href={getRoute(routes.vote.list, locale)}>
            {t('submit')}
          </Link>
        </Button>
      </div>
    </main>
  )
}
