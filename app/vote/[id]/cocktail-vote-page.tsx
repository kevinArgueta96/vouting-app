'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CocktailDetail from './cocktail-detail'
import { cocktailService, ratingService } from '../../services/supabase'
import { Button } from '../../components/ui/button'
import { Database } from '../../types/supabase'

type Rating = {
  [key: string]: number | string | undefined;
  user_email?: string;
}

type Cocktail = Database['public']['Tables']['cocktails']['Row']

interface Props {
  id: string
}

export default function CocktailVotePage({ id }: Props) {
  const router = useRouter()
  const [cocktail, setCocktail] = useState<Cocktail | null>(null)
  const [votes, setVotes] = useState(0)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadCocktail = async () => {
      try {
        const cocktailData = await cocktailService.getCocktailById(Number(id))
        const votesCount = await cocktailService.getCocktailVotes(Number(id))
        setCocktail(cocktailData)
        setVotes(votesCount)
      } catch (error) {
        console.error('Error loading cocktail:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCocktail()
  }, [id])

  const handleRatingSubmit = async (ratings: Rating) => {
    try {
      // Submit rating to database
      await ratingService.submitRating({
        cocktail_id: Number(id),
        appearance: ratings.appearance as number,
        taste: ratings.taste as number,
        innovativeness: ratings.innovativeness as number,
        user_email: ratings.user_email || null,
      })
      
      // Navigate to thanks page only through submit
      router.push('/thanks')
    } catch (error) {
      console.error('Error submitting rating:', error)
      alert('Error al enviar la votación. Por favor intente de nuevo.')
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-6">
        <div className="w-full max-w-2xl text-center">
          Cargando...
        </div>
      </main>
    )
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
    <main className="min-h-screen bg-gray-100">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b sticky top-0 z-10 flex items-center justify-between">
            <Button 
              onClick={() => router.push('/vote')}
              variant="ghost"
              className="hover:bg-gray-100"
            >
              ← Volver
            </Button>
            <div className="text-sm text-gray-500">
              {votes} votos
            </div>
          </div>
          
          {/* Scrollable Content */}
          <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
            <CocktailDetail 
              cocktail={cocktail} 
              onSubmit={handleRatingSubmit}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
