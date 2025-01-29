'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CocktailDetail from './cocktail-detail'
import cocktailsData from '../../data/cocktails.json'
import { Button } from '../../components/ui/button'

interface Rating {
  appearance: number;
  taste: number;
  innovativeness: number;
  wantRecipe: boolean;
  email?: string;
  [key: string]: number | boolean | string | undefined;
}

interface Props {
  id: string
}

export default function CocktailVotePage({ id }: Props) {
  const router = useRouter()
  const cocktail = cocktailsData.cocktails.find(
    c => c.id === Number(id)
  );
  
  const [votes, setVotes] = useState(0)
  
  useEffect(() => {
    const storedVotes = localStorage.getItem(`votes-${id}`)
    if (storedVotes) {
      setVotes(Number(storedVotes))
    }
  }, [id])

  const handleRatingSubmit = (ratings: Rating) => {
    // Save ratings and recipe preference
    localStorage.setItem(`ratings-${id}`, JSON.stringify(ratings))
    localStorage.setItem(`wantRecipe-${id}`, ratings.wantRecipe.toString())
    
    // Increment votes
    const newVotes = votes + 1
    setVotes(newVotes)
    localStorage.setItem(`votes-${id}`, newVotes.toString())
    
    // Navigate to thanks page only through submit
    router.push('/thanks')
  }

  if (!cocktail) {
    return (
      <main className="flex min-h-screen flex-col items-center p-6">
        <div className="w-full max-w-2xl">
          <Button 
            onClick={() => router.push('/vote')}
            className="mb-6"
          >
            ← Back
          </Button>
          <div className="text-center">Cocktail not found</div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <div className="w-full max-w-2xl">
        <Button 
          onClick={() => router.push('/vote')}
          className="mb-6"
        >
          ← Back
        </Button>
        
        <CocktailDetail 
          cocktail={cocktail} 
          onSubmit={handleRatingSubmit}
        />
        
        <div className="mt-4 text-center text-gray-500">
          Current votes: {votes}
        </div>
      </div>
    </main>
  )
}
