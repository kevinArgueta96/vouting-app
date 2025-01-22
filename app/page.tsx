"use client"

import { useState } from "react"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card"
import { Rating } from "./components/ui/rating"
import { cn } from "./lib/utils"

interface VotingCategory {
  id: string
  name: string
  value: number
}

export default function Home() {
  const [categories, setCategories] = useState<VotingCategory[]>([
    { id: "taste", name: "Sabor", value: 0 },
    { id: "presentation", name: "Presentación", value: 0 },
    { id: "originality", name: "Originalidad", value: 0 },
    { id: "technique", name: "Técnica", value: 0 }
  ])
  const [showEmailField, setShowEmailField] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRatingChange = (categoryId: string, value: number) => {
    setError(null)
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, value } : cat
    ))
  }

  const validateForm = () => {
    const hasAllRatings = categories.every(cat => cat.value > 0)
    if (!hasAllRatings) {
      setError("Por favor, califica todas las categorías antes de enviar")
      return false
    }
    if (showEmailField && !email) {
      setError("Por favor, ingresa tu correo electrónico")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log({ categories, email: showEmailField ? email : undefined })
      setShowSuccess(true)
      // Reset form after 2 seconds
      setTimeout(() => {
        setCategories(categories.map(cat => ({ ...cat, value: 0 })))
        setEmail("")
        setShowEmailField(false)
        setShowSuccess(false)
      }, 2000)
    } catch (err) {
      setError("Hubo un error al enviar tu voto. Por favor, intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-primary">
          Helsinki Drink Festival
        </h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative h-12">
            {error && (
              <div className="absolute inset-x-0 p-4 bg-destructive/10 text-destructive rounded-lg text-sm font-medium animate-shake flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}
            
            {showSuccess && (
              <div className="absolute inset-x-0 p-4 bg-green-500/10 text-green-600 rounded-lg text-sm font-medium animate-fade-in flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                ¡Gracias por tu voto! 🎉
              </div>
            )}
          </div>

          <Card className="w-full relative overflow-hidden">
            {isSubmitting && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Whiskey Sour
              </CardTitle>
              <CardDescription className="text-center">
                Helsinki Drink Festival - Vote por el Mejor Cóctel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center overflow-hidden shadow-inner">
                <span className="text-muted-foreground text-sm">Imagen del cóctel</span>
              </div>

              {/* Rating categories */}
              <div className="space-y-6 py-4">
                {categories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <label
                      htmlFor={category.id}
                      className="block text-base font-medium text-foreground/90"
                    >
                      {category.name}
                    </label>
                    <Rating
                      id={category.id}
                      value={category.value}
                      onChange={(value) => handleRatingChange(category.id, value)}
                      className="justify-center md:justify-start"
                    />
                  </div>
                ))}
              </div>

              {/* Email opt-in */}
              <div className="space-y-4 pt-6 border-t">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={showEmailField}
                    onChange={(e) => setShowEmailField(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary transition-colors"
                  />
                  <span className="text-sm text-foreground/90 group-hover:text-foreground transition-colors">
                    ¿Deseas recibir la receta o participar en la rifa?
                  </span>
                </label>
                
                {showEmailField && (
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu correo electrónico"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit button */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className={cn(
              "w-full text-lg font-semibold transition-all duration-200",
              !isSubmitting && "hover:scale-[1.02]",
              isSubmitting && "opacity-70 cursor-not-allowed"
            )}
          >
            Enviar Voto
          </Button>
        </form>
      </div>
    </main>
  )
}
