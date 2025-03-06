'use client';

import { Button } from "../components/ui/button"
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { routes, getRoute } from '../config/routes'

export default function Home() {
  const t = useTranslations('Index')
  const locale = useLocale()

  return (
      <main className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center min-h-[80vh] sm:min-h-0 p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center h-full">
        <div className="bg-white/10 backdrop-blur-sm p-8 sm:p-10 md:p-12 rounded-2xl shadow-2xl w-full flex flex-col justify-between gap-8 sm:gap-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center text-white tracking-tight mb-8 sm:mb-8 break-words hyphens-auto font-russo">
            {t('title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-center text-gray-100 max-w-2xl mx-auto mb-12 sm:mb-12 break-words hyphens-auto leading-relaxed font-montserrat">
            {t('description')}
          </p>
          <div className="w-full max-w-md mx-auto mt-auto">
            <Button 
              size="lg" 
              className="w-full py-6 sm:py-7 text-lg sm:text-xl font-semibold bg-white text-vouting-blue hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl border-2 border-white/20 font-montserrat" 
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
