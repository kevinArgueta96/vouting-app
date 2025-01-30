'use client'

import { Button } from "../../components/ui/button"
import { useState, useEffect } from 'react'
import { characteristicService } from '../../services/supabase'
import { Database } from '../../types/supabase'

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
  const [characteristics, setCharacteristics] = useState<RatingCharacteristic[]>([]);
  const [ratings, setRatings] = useState<Rating>({});
  const [emailError, setEmailError] = useState('');
  const [wantRecipe, setWantRecipe] = useState(false);

  useEffect(() => {
    const loadCharacteristics = async () => {
      try {
        const chars = await characteristicService.getAllCharacteristics();
        setCharacteristics(chars);
        // Initialize ratings with 0 for each characteristic
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
      setEmailError('Por favor ingrese un email válido');
      return;
    }
    setEmailError('');
    
    if (canSubmit()) {
      onSubmit(ratings);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4 mb-8">
            <h1 className="text-3xl font-bold">{cocktail.name}</h1>
            <p className="text-sm text-gray-500">por {cocktail.brand}</p>
            <p className="text-gray-600 text-sm leading-relaxed">{cocktail.description}</p>
          </div>

          <div className="space-y-8">
            {characteristics.map((characteristic) => (
              <div key={characteristic.id} className="bg-gray-50 rounded-lg p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {characteristic.label}
                  </label>
                  <p className="text-sm text-gray-500">
                    {characteristic.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  {Array.from(
                    { length: characteristic.max_rating - characteristic.min_rating + 1 },
                    (_, i) => i + characteristic.min_rating
                  ).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRatingChange(characteristic.id, value);
                      }}
                      className={`w-12 h-12 rounded-full ${
                        ratings[characteristic.id] === value
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center bg-blue-50 rounded-lg p-4">
              <input
                type="checkbox"
                id="wantRecipe"
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                checked={wantRecipe}
                onChange={(e) => {
                  setWantRecipe(e.target.checked);
                  if (!e.target.checked) {
                    handleRatingChange('user_email', '');
                    setEmailError('');
                  }
                }}
              />
              <label htmlFor="wantRecipe" className="ml-2 text-sm text-gray-600">
                Me gustaría recibir la receta
              </label>
            </div>

            {wantRecipe && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    emailError ? 'border-red-500' : ''
                  }`}
                  value={ratings.user_email || ''}
                  onChange={(e) => {
                    handleRatingChange('user_email', e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="tu@email.com"
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white border-t p-4 mt-8">
            <Button 
              type="submit"
              className="w-full"
              disabled={!canSubmit()}
            >
              Enviar Votación
            </Button>
          </div>
    </form>
  )
}
