'use client';

import { useState, useEffect } from 'react';
import { cocktailService } from '../../services/supabase';
import Link from 'next/link';
import { routes } from '../../config/routes';
import { useLocale, useTranslations } from 'next-intl';
import { CocktailDetailModal } from './cocktail-detail-modal';

interface Cocktail {
  id: number;
  name: string;
  brand: string;
  description: string;
}

export function CocktailGrid() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
  const locale = useLocale();
  const t = useTranslations('CocktailDetail');

  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        const data = await cocktailService.getAllCocktails(locale);
        setCocktails(data);
      } catch (error) {
        console.error('Error fetching cocktails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCocktails();
  }, [locale]);

  if (loading) {
    return (
      <div className="w-full grid place-items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F6F0] min-h-screen py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto px-6">
        {cocktails.map((cocktail) => (
          <div
            key={cocktail.id}
            className="group cursor-pointer"
            onClick={() => setSelectedCocktail(cocktail)}
          >
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-gray-100">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-50 text-blue-600 mb-3">
                    {cocktail.brand}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                    {cocktail.name}
                  </h3>
                  <p className="text-gray-600 line-clamp-2">
                    {cocktail.description}
                  </p>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">{t('viewDetails')}</span>
                    <svg
                      className="w-5 h-5 text-blue-600 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedCocktail && (
        <CocktailDetailModal
          isOpen={!!selectedCocktail}
          onClose={() => setSelectedCocktail(null)}
          cocktail={selectedCocktail}
        >
          <Link
            href={routes.vote.detail(locale, selectedCocktail.id.toString())}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#FF8B9C] hover:bg-[#ff7c8f] transition-colors w-full mt-6"
          >
            {t('submitRating')}
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </CocktailDetailModal>
      )}
    </div>
  );
}
