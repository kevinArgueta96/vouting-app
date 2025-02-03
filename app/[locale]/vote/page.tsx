'use client';

import { useTranslations } from 'next-intl';
import { CocktailGrid } from "../../components/ui/cocktail-grid";

export default function VotePage() {
  const t = useTranslations('Vote');

  return (
    <main className="flex min-h-screen flex-col items-center p-6 relative">
      <div className="flex-1 flex flex-col items-center w-full">
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          {t('title')}
        </h1>
        <div className="w-full px-4">
          <CocktailGrid />
        </div>
      </div>
    </main>
  );
}
