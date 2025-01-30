'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CocktailDetail from './cocktail-detail'
import { cocktailService, ratingService, featureFlagService } from '../../../services/supabase'
import { Button } from '../../../components/ui/button'
import { Database } from '../../../types/supabase'
import { useTranslations, useLocale } from 'next-intl'
import LanguageSwitcher from '../../../components/language-switcher'
import { routes, getRoute } from '../../../config/routes'

type Rating = {
  [key: string]: number | string | undefined;
  appearance?: number;
  taste?: number;
  innovativeness?: number;
  user_email?: string;
}

type Cocktail = Database['public']['Tables']['cocktails']['Row']

interface Props {
  id: string
}

export default function CocktailVotePage({ id }: Props) {
  const router = useRouter()
  const t = useTranslations('Vote')
  const locale = useLocale()
  const [cocktail, setCocktail] = useState<Cocktail | null>(null)
  const [votes, setVotes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [validationEnabled, setValidationEnabled] = useState<boolean>(false)
  
  useEffect(() => {
    let mounted = true
    
    const loadData = async () => {
      try {
        const [cocktailData, votesCount, isValidationEnabled] = await Promise.all([
          cocktailService.getCocktailById(Number(id)),
          cocktailService.getCocktailVotes(Number(id)),
          featureFlagService.isFeatureEnabled('VALIDATE_REPEAT_VOUTE')
        ])
        
        if (mounted) {
          setCocktail(cocktailData)
          setVotes(votesCount)
          setValidationEnabled(isValidationEnabled)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadData()
    
    return () => {
      mounted = false
    }
  }, [id])

  const handleRatingSubmit = async (ratings: Rating) => {
    try {
      // Get client-side information only when submitting
      const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : ''
      let ip = ''
      
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json')
        const ipData = await ipResponse.json()
        ip = ipData.ip
      } catch (error) {
        console.error('Error fetching IP:', error)
        ip = '0.0.0.0' // Fallback IP
      }

      // Use the cached validation status
      if (validationEnabled) {
        try {
          const hasVoted = await ratingService.checkExistingVote(
            Number(id),
            ip,
            userAgent
          )
          
          if (hasVoted) {
            alert(t('alreadyVoted'))
            return
          }
        } catch (error) {
          console.error('Error checking existing vote:', error)
          alert(t('submitError'))
          return
        }
      }
      
      await ratingService.submitRating({
        cocktail_id: Number(id),
        appearance: ratings.appearance as number,
        taste: ratings.taste as number,
        innovativeness: ratings.innovativeness as number,
        user_email: ratings.user_email || null,
        ip_address: ip,
        user_agent: userAgent,
      })
      
      // Send email if user provided their email
      if (ratings.user_email && cocktail) {
        try {
          const emailResponse = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: ratings.user_email as string,
              subject: `${cocktail.name} - Cocktail Details`,
              text: `
Thank you for rating ${cocktail.name}!

Cocktail Details:
Name: ${cocktail.name}
Brand: ${cocktail.brand}
Description: ${cocktail.description}

We appreciate your participation!
              `,
              html: `
<h2>Thank you for rating ${cocktail.name}!</h2>

<h3>Cocktail Details:</h3>
<p><strong>Name:</strong> ${cocktail.name}</p>
<p><strong>Brand:</strong> ${cocktail.brand}</p>
<p><strong>Description:</strong> ${cocktail.description}</p>

<p>We appreciate your participation!</p>
              `
            }),
          })

          if (!emailResponse.ok) {
            const emailResult = await emailResponse.json()
            console.error('Failed to send email:', emailResult.error)
            alert('Failed to send email confirmation. Please check your email address.')
            return
          }
        } catch (error) {
          console.error('Error sending email:', error)
        }
      }

      await router.push(getRoute(routes.thanks, locale))
    } catch (error: any) {
      console.error('Error submitting rating:', error)
      if (error.message === t('alreadyVoted')) {
        alert(error.message)
      } else {
        alert(t('submitError'))
      }
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-6">
        <div className="w-full max-w-2xl text-center">
          {t('loading')}
        </div>
      </main>
    )
  }

  if (!cocktail) {
    return (
      <main className="flex min-h-screen flex-col items-center p-6">
        <div className="w-full max-w-2xl">
          <Button 
            onClick={async () => await router.push(getRoute(routes.vote.list, locale))}
            className="mb-6"
          >
            ← {t('back')}
          </Button>
          <div className="text-center">{t('notFound')}</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <LanguageSwitcher />
        <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-white px-6 py-4 border-b sticky top-0 z-10 flex items-center justify-between">
            <Button 
              onClick={async () => await router.push(getRoute(routes.vote.list, locale))}
              variant="ghost"
              className="hover:bg-gray-100"
            >
              ← {t('back')}
            </Button>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {votes} {t('votes')}
              </div>
              <div className="text-sm text-gray-500">
                | {t('validation')}: {validationEnabled ? t('enabled') : t('disabled')}
              </div>
            </div>
          </div>
          
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
