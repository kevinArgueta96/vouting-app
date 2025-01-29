'use client'

import { useState, useEffect } from 'react'
import { cocktailService } from '../services/supabase'
import { Database } from '../types/supabase'

type Cocktail = Database['public']['Tables']['cocktails']['Row']

export default function VotePage() {
  const [cocktails, setCocktails] = useState<Cocktail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCocktails = async () => {
      try {
        const data = await cocktailService.getAllCocktails()
        setCocktails(data)
      } catch (err) {
        console.error('Error loading cocktails:', err)
        setError('Error al cargar los cócteles. Por favor intente de nuevo.')
      } finally {
        setLoading(false)
      }
    }
    loadCocktails()
  }, [])

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-6">
        <div className="text-center">Cargando cócteles...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center p-6">
        <div className="text-center text-red-600">{error}</div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Selecciona un Cóctel</h1>
      
      <div className="w-full max-w-screen-lg px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cocktails.map((cocktail) => (
            <a 
              key={cocktail.id}
              href={`/vote/${cocktail.id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:scale-105 transform duration-200"
            >
              <h2 className="text-xl font-semibold mb-2">{cocktail.name}</h2>
              <p className="text-sm text-gray-500 mb-3">por {cocktail.brand}</p>
              <p className="text-sm text-gray-600 line-clamp-3">{cocktail.description}</p>
              <div className="mt-4 text-blue-600 text-sm font-medium">
                Click para votar →
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}
