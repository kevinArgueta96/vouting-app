'use client'

import { Button } from "../../components/ui/button"
import { useState } from 'react'
import ratingConfig from '../../data/rating-config.json'

type RatingCharacteristic = {
  id: string;
  label: string;
  description: string;
}

interface Rating {
  appearance: number;
  taste: number;
  innovativeness: number;
  wantRecipe: boolean;
  email?: string;
  [key: string]: number | boolean | string | undefined;
}

interface Cocktail {
  id: number;
  name: string;
  brand: string;
  description: string;
  ingredients: string[];
}

export default function CocktailDetail({ 
  cocktail,
  onSubmit 
}: { 
  cocktail: Cocktail;
  onSubmit: (ratings: Rating) => void;
}) {
  const initialRatings: Rating = {
    appearance: 0,
    taste: 0,
    innovativeness: 0,
    wantRecipe: false,
    email: ''
  };

  const [ratings, setRatings] = useState<Rating>(initialRatings);
  const [emailError, setEmailError] = useState('');

  const handleRatingChange = (category: keyof Rating, value: number | boolean | string) => {
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
    const hasAllRatings = ratingConfig.characteristics.every(
      char => (ratings[char.id] as number) > 0
    );
    if (!ratings.wantRecipe) {
      return hasAllRatings;
    }
    return hasAllRatings && validateEmail(ratings.email || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ratings.wantRecipe && !validateEmail(ratings.email || '')) {
      setEmailError('Por favor ingrese un email válido');
      return;
    }
    setEmailError('');
    
    if (canSubmit()) {
      alert('¡Gracias por tu votación!');
      onSubmit(ratings);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-2">{cocktail.name}</h1>
          <p className="text-sm text-gray-500 mb-4">por {cocktail.brand}</p>
          <p className="text-gray-600 mb-4">{cocktail.description}</p>
          <div className="text-sm text-gray-500 mb-8">
            <strong>Ingredientes:</strong> {cocktail.ingredients.join(', ')}
          </div>

          <div className="grid gap-6">
            {ratingConfig.characteristics.map((characteristic) => (
              <div key={characteristic.id}>
                <label className="block text-sm font-medium mb-2">
                  {characteristic.label}
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  {characteristic.description}
                </p>
                <div className="flex gap-2">
                  {Array.from(
                    { length: ratingConfig.ratingScale.max - ratingConfig.ratingScale.min + 1 },
                    (_, i) => i + ratingConfig.ratingScale.min
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

          <div className="mt-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="wantRecipe"
                className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                checked={ratings.wantRecipe}
                onChange={(e) => {
                  handleRatingChange('wantRecipe', e.target.checked);
                  if (!e.target.checked) {
                    handleRatingChange('email', '');
                    setEmailError('');
                  }
                }}
              />
              <label htmlFor="wantRecipe" className="ml-2 text-sm text-gray-600">
                Me gustaría recibir la receta
              </label>
            </div>

            {ratings.wantRecipe && (
              <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    emailError ? 'border-red-500' : ''
                  }`}
                  value={ratings.email || ''}
                  onChange={(e) => {
                    handleRatingChange('email', e.target.value);
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

          <Button 
            type="submit"
            className="w-full mt-8"
            disabled={!canSubmit()}
          >
            Enviar Votación
          </Button>
    </form>
  )
}
