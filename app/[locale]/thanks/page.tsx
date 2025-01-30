'use client'

import { Button } from "../../components/ui/button"
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { routes, getRoute } from '../../config/routes'

export default function ThanksPage() {
  const locale = useLocale()
  const t = useTranslations('Thanks')
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-600 mb-8">
          {t('message')}
        </p>
        <Button size="lg" asChild>
          <Link href={getRoute(routes.vote.list, locale)}>{t('backHome')}</Link>
        </Button>
      </div>
    </main>
  )
}
