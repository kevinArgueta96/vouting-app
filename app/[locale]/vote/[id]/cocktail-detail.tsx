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
      <form onSubmit={handleSubmit} className="h-screen flex items-center ">
        {/* Main Content */}
        <div className="bg-[#3B4992] rounded-full h-[120vh] w-[120vh]  ">
  
          {/* Cocktail Image */}
          <div className="relative w-full max-w-[250px] mx-auto mb-8">
          <div className="p-4 rounded-lg">
            <img 
              src="/images/cocktail-image-vote.png" 
              alt="Cocktail"
              className="w-full h-auto"
            />
          </div>
        </div>

          {/* Cocktail Info */}
          <div className="space-y-2 mb-8 sm:mb-12 text-white">
            <h2 className="text-3xl font-bold uppercase  text-left">{cocktail.name}</h2>
            <h3 className="text-lg sm:text-xl uppercase tracking-wide text-left">{cocktail.brand}</h3>
            <p className="text-sm leading-relaxed text-left">
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
    </form>
  )
}
