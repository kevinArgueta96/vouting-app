'use client';

import { useState, useEffect } from 'react';
import { cocktailService } from '../../services/supabase';
import Link from 'next/link';
import { routes, getRoute } from '../../config/routes';
import { useLocale } from 'next-intl';

interface Cocktail {
  id: number;
  name: string;
  brand: string;
  description: string;
}

export function CocktailGrid() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([]);
  const [loading, setLoading] = useState(true);
  const locale = useLocale();

  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        const data = await cocktailService.getAllCocktails();
        setCocktails(data);
      } catch (error) {
        console.error('Error fetching cocktails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCocktails();
  }, []);

  if (loading) {
    return (
      <div className="w-full grid place-items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto">
      {cocktails.map((cocktail) => (
        <Link
          key={cocktail.id}
          href={getRoute(routes.vote.detail, locale, cocktail.id.toString())}
          className="group"
        >
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:bg-white/10 border border-white/10 hover:border-white/20">
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <div className="inline-block px-3 py-1 text-sm rounded-full bg-primary/10 text-primary mb-3">
                  {cocktail.brand}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {cocktail.name}
                </h3>
                <p className="text-gray-400 line-clamp-3">
                  {cocktail.description}
                </p>
              </div>
              <div className="mt-auto">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Click to rate</span>
                  <svg
                    className="w-6 h-6 text-primary transform group-hover:translate-x-1 transition-transform"
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
        </Link>
      ))}
    </div>
  );
}
