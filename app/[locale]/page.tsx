'use client';

import { Button } from "../components/ui/button"
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { routes, getRoute } from '../config/routes'

export default function Home() {
  const t = useTranslations('Index')
  const locale = useLocale()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative -mt-20">
      <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 flex flex-col items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm p-6 sm:p-8 md:p-12 rounded-2xl shadow-2xl w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-white tracking-tight mb-4 sm:mb-6 break-words hyphens-auto">
            {t('title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-center text-gray-100 max-w-2xl mx-auto mb-8 sm:mb-12 break-words hyphens-auto">
            {t('description')}
          </p>
          <div className="w-full max-w-sm mx-auto">
            <Button 
              size="lg" 
              className="w-full py-4 sm:py-6 text-base sm:text-lg font-semibold bg-white text-vouting-blue hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl border-2 border-white/20" 
              asChild
            >
              <Link href={getRoute(routes.vote.list, locale)}>
                {t('submit')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
