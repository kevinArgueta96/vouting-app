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
  const [validationEnabled, setValidationEnabled] = useState<boolean | null>(null)
  
  useEffect(() => {
    const loadCocktail = async () => {
      try {
        const isValidationEnabled = await featureFlagService.isFeatureEnabled('VALIDATE_REPEAT_VOUTE')
        setValidationEnabled(isValidationEnabled)
        console.log('Validation status loaded:', isValidationEnabled)
      } catch (error) {
        console.error('Error loading feature flag:', error)
        setValidationEnabled(false) // Default to disabled on error
      }
      try {
        const [cocktailData, votesCount] = await Promise.all([
          cocktailService.getCocktailById(Number(id)),
          cocktailService.getCocktailVotes(Number(id))
        ])
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
      const userAgent = window.navigator.userAgent;
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const { ip } = await ipResponse.json();
      
      try {
        // Get the validation flag status
        const validateRepeatVote = await featureFlagService.isFeatureEnabled('VALIDATE_REPEAT_VOUTE');
        console.log('Validation enabled:', validateRepeatVote);
        
        // Only proceed with validation if the flag is explicitly true
        if (validateRepeatVote === true) {
          try {
            // Check for existing vote
            const hasVoted = await ratingService.checkExistingVote(
              Number(id),
              ip,
              userAgent
            );
            console.log('Has voted before:', hasVoted);

            if (hasVoted) {
              alert(t('alreadyVoted'));
              return; // Exit early if already voted
            }
          } catch (error) {
            console.error('Error checking existing vote:', error);
            alert(t('submitError'));
            return; // Exit if validation check fails
          }
        }
      } catch (error) {
        console.error('Error checking validation flag:', error)
        // Continue without validation on error
      }
      
      console.log('Proceeding with vote submission');

      await ratingService.submitRating({
        cocktail_id: Number(id),
        appearance: ratings.appearance as number,
        taste: ratings.taste as number,
        innovativeness: ratings.innovativeness as number,
        user_email: ratings.user_email || null,
        ip_address: ip,
        user_agent: userAgent,
      })
      
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
                | {t('validation')}: {validationEnabled === null ? '...' : validationEnabled ? t('enabled') : t('disabled')}
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
