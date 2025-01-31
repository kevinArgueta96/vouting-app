'use client'

import { Button } from "../../../components/ui/button"
import { useState, useEffect } from 'react'
import { characteristicService } from '../../../services/supabase'
import { Database } from '../../../types/supabase'
import { useTranslations } from 'next-intl'

const RATING_EMOJIS = [
  { value: 1, emoji: "🙁" },
  { value: 2, emoji: "🙂" },
  { value: 3, emoji: "😊" },
  { value: 4, emoji: "😁" }
];

type RatingCharacteristic = Database['public']['Tables']['rating_characteristics']['Row']

type Rating = {
  [key: string]: number | string | undefined;
  user_email?: string;
}

interface Cocktail {
  id: number;
  name: string;
  brand: string;
  description: string;
}

const CocktailIllustration = () => (
  <div className="relative w-full max-w-[150px] mx-auto mb-8">
    <div className="bg-[#FFD4D4] p-4 rounded-lg">
      <svg className="w-full h-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Hand */}
        <path d="M100 140C110 140 120 130 120 120C120 110 110 100 100 100C90 100 80 110 80 120C80 130 90 140 100 140Z" fill="#FFD4D4" stroke="#3B4992" strokeWidth="2"/>
        
        {/* Cocktail Glass */}
        <path d="M90 50L110 50L115 100H85L90 50Z" fill="#3B4992"/>
        
        {/* Citrus Slice */}
        <circle cx="120" cy="60" r="10" fill="#FFD4D4" stroke="#3B4992" strokeWidth="2"/>
        <path d="M116 60H124" stroke="#3B4992" strokeWidth="2"/>
      </svg>
    </div>
  </div>
)

export default function CocktailDetail({ 
  cocktail,
  onSubmit 
}: { 
  cocktail: Cocktail;
  onSubmit: (ratings: Rating) => void;
}) {
  const t = useTranslations('Vote')
  const [characteristics, setCharacteristics] = useState<RatingCharacteristic[]>([]);
  const [ratings, setRatings] = useState<Rating>({});
  const [emailError, setEmailError] = useState('');
  const [wantRecipe, setWantRecipe] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  useEffect(() => {
    const loadCharacteristics = async () => {
      try {
        const chars = await characteristicService.getAllCharacteristics();
        setCharacteristics(chars);
        setRatings(
          chars.reduce((acc, char) => ({
            ...acc,
            [char.id]: 0
          }), {})
        );
      } catch (error) {
        console.error('Error loading rating characteristics:', error);
      }
    };
    loadCharacteristics();
  }, []);

  const handleRatingChange = (category: string, value: number | string) => {
    setRatings(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const canSubmit = () => {
    const hasAllRatings = characteristics.every(
      char => (ratings[char.id] as number) > 0
    );
    if (!wantRecipe) {
      return hasAllRatings;
    }
    return hasAllRatings && validateEmail(ratings.user_email || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wantRecipe && !validateEmail(ratings.user_email || '')) {
      setEmailError(t('invalidEmail'));
      return;
    }
    setEmailError('');
    
    if (canSubmit()) {
      onSubmit(ratings);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-[#FAF7F2] max-w-md mx-auto px-4 sm:px-6">

      {/* Main Content */}
      <div className="pb-6 pt-8">
        {/* Cocktail Illustration */}
        <CocktailIllustration />

        {/* Content Circle */}
        <div className="bg-[#3B4992] text-white rounded-[50px] p-10 relative">
          {/* Cocktail Info */}
          <div className="space-y-4 mb-8 sm:mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider">{cocktail.name}</h2>
            <h3 className="text-lg sm:text-xl uppercase tracking-wide">{cocktail.brand}</h3>
            <p className="text-sm leading-relaxed">
              {cocktail.description}
            </p>
          </div>

          {/* Rating Sections */}
          <div className="space-y-8 sm:space-y-12">
          {characteristics.map((characteristic) => (
            <div key={characteristic.id} className="text-center">
              <h4 className="text-xl sm:text-2xl uppercase mb-4 sm:mb-6 tracking-wide">{characteristic.label}</h4>
              <div className="flex justify-center gap-4 sm:gap-8">
                {RATING_EMOJIS.map((rating) => (
                  <button
                    key={rating.value}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRatingChange(characteristic.id, rating.value);
                    }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFD4D4] flex items-center justify-center text-lg sm:text-xl transition-transform ${
                      ratings[characteristic.id] === rating.value
                        ? 'transform scale-110 ring-2 ring-[#FFD4D4]'
                        : 'opacity-60 hover:opacity-90'
                    }`}
                  >
                    {rating.emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

          {/* Email and Recipe Options */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 bg-[#FFD4D4]/10 p-3 rounded-lg">
            <input
              type="radio"
              id="recipe-checkbox"
              checked={wantRecipe}
              onChange={(e) => setWantRecipe(e.target.checked)}
              className="w-4 h-4 rounded-full border-2 border-[#FFD4D4] checked:bg-[#FFD4D4]"
            />
            <label htmlFor="recipe-checkbox" className="text-sm sm:text-base">
              {t('sendRecipe')}
            </label>
          </div>
          
          {wantRecipe && (
            <div className="mt-4 space-y-3">
              <input
                type="email"
                placeholder={t('enterEmail')}
                value={ratings.user_email || ''}
                onChange={(e) => {
                  handleRatingChange('user_email', e.target.value);
                  if (emailError) setEmailError('');
                }}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 focus:border-white focus:outline-none text-white placeholder-white/50"
              />
              {emailError && (
                <p className="text-red-300 text-sm">{emailError}</p>
              )}
            </div>
          )}
        </div>

          {/* Submit Button */}
          <div className="mt-8 sm:mt-12">
            <Button 
              type="submit"
              className="w-full bg-[#FFD4D4] text-[#3B4992] hover:bg-[#FFE4E4] transition-colors duration-200 rounded-full py-3 font-semibold"
              disabled={!canSubmit()}
            >
              SEND VOTE
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
