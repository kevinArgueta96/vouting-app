'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslations, useLocale } from 'next-intl';
import { routes, getRoute } from '@/app/config/routes';
import { Button } from '@/app/components/ui/button';

export default function QRCodePage() {
  const [voteId, setVoteId] = useState('');
  const t = useTranslations('QRCode');
  
  // Get the current hostname (works in both development and production)
  const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  };

  const locale = useLocale();
  
  const getVoteUrl = (id: string) => {
    const basePath = getBaseUrl();
    return `${basePath}/${locale}/vote/${id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {t('title')}
        </h1>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="mb-6">
            <label htmlFor="voteId" className="block text-sm font-medium mb-2">
              {t('enterVoteId')}
            </label>
            <input
              type="text"
              id="voteId"
              value={voteId}
              onChange={(e) => setVoteId(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder={t('voteIdPlaceholder')}
            />
          </div>

          {voteId && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG
                  value={getVoteUrl(voteId)}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-gray-400 text-center">
                {t('scanToVote')}
              </p>
              <div className="text-xs text-gray-500 break-all text-center">
                {getVoteUrl(voteId)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
