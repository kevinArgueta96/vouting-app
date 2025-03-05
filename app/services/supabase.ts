import { supabase } from '../lib/supabase'
import { Database } from '../types/supabase'

type Cocktail = Database['public']['Tables']['cocktails']['Row']
type CocktailRating = Database['public']['Tables']['cocktail_ratings']['Row']
type CocktailRatingInsert = Database['public']['Tables']['cocktail_ratings']['Insert']
type RatingCharacteristic = Database['public']['Tables']['rating_characteristics']['Row']
type RatingCharacteristicInsert = Database['public']['Tables']['rating_characteristics']['Insert']

export const cocktailService = {
  async getAllCocktails(locale: string) {
    const { data, error } = await supabase
      .from('cocktails_translations')
      .select(`
        cocktail_id,
        name,
        brand,
        description,
        recipe
      `)
      .eq('locale', locale)

    if (error) throw error
    return data.map(item => ({
      id: item.cocktail_id,
      name: item.name,
      brand: item.brand,
      description: item.description,
      translations: [{
        locale: locale,
        recipe: item.recipe
      }]
    })) as Cocktail[]
  },

  async getCocktailById(id: number, locale: string) {
    let translatedData;
    
    const { data, error } = await supabase
      .from('cocktails_translations')
      .select(`
        cocktail_id,
        name,
        brand,
        description,
        recipe
      `)
      .eq('cocktail_id', id)
      .eq('locale', locale)
      .single()

    if (error) {
      // If translation not found, fallback to default language (en)
      if (locale !== 'en') {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('cocktails_translations')
          .select(`
            cocktail_id,
            name,
            brand,
            description,
            recipe
          `)
          .eq('cocktail_id', id)
          .eq('locale', 'en')
          .single()

        if (fallbackError) throw fallbackError
        translatedData = fallbackData
      } else {
        throw error
      }
    } else {
      translatedData = data
    }

    if (!translatedData) {
      throw new Error('No translation found')
    }

    return {
      id: translatedData.cocktail_id,
      name: translatedData.name,
      brand: translatedData.brand,
      description: translatedData.description,
      translations: [{
        locale: locale,
        recipe: translatedData.recipe
      }]
    } as Cocktail
  },

  async getCocktailVotes(cocktailId: number) {
    const { count, error } = await supabase
      .from('cocktail_ratings')
      .select('*', { count: 'exact', head: true })
      .eq('cocktail_id', cocktailId)

    if (error) throw error
    return count || 0
  }
}

export const featureFlagService = {
  async isFeatureEnabled(featureId: string) {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('is_enabled')
        .eq('id', featureId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          return false // Flag doesn't exist, so it's disabled
        }
        console.error('Error fetching feature flag:', error)
        throw error // Propagate other errors
      }

      return data?.is_enabled ?? false // Return the actual flag value
    } catch (error) {
      console.error('Error in isFeatureEnabled:', error)
      throw error // Propagate all errors
    }
  }
}

export const ratingService = {
  async checkExistingVote(cocktailId: number, userUuid: string) {
    const { count, error } = await supabase
      .from('cocktail_ratings')
      .select('*', { count: 'exact', head: true })
      .eq('cocktail_id', cocktailId)
      .eq('user_uuid', userUuid)

    if (error) throw error
    return count !== null && count > 0
  },

  async submitRating(rating: Omit<CocktailRatingInsert, 'ip_address' | 'user_agent'>) {
    const { data, error } = await supabase
      .from('cocktail_ratings')
      .insert({
        ...rating,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        throw new Error('alreadyVoted')
      }
      throw error
    }
    return data as CocktailRating
  },

  async getRatingStats(cocktailId: number) {
    const { data, error } = await supabase
      .from('cocktail_ratings')
      .select('appearance, taste, innovativeness')
      .eq('cocktail_id', cocktailId)

    if (error) throw error

    if (!data.length) {
      return {
        appearance: 0,
        taste: 0,
        innovativeness: 0,
        total_ratings: 0
      }
    }

    type Stats = {
      appearance: number;
      taste: number;
      innovativeness: number;
      total_ratings: number;
    }

    const stats = data.reduce<Stats>(
      (acc, curr) => ({
        appearance: acc.appearance + curr.appearance,
        taste: acc.taste + curr.taste,
        innovativeness: acc.innovativeness + curr.innovativeness,
        total_ratings: acc.total_ratings + 1
      }),
      { appearance: 0, taste: 0, innovativeness: 0, total_ratings: 0 }
    )

    return {
      appearance: stats.appearance,
      taste: stats.taste,
      innovativeness: stats.innovativeness,
      total_ratings: stats.total_ratings
    }
  }
}

export const userSessionService = {
  async checkUserSession(userUuid: string) {
    const { count, error } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('user_uuid', userUuid)

    if (error) throw error
    return count !== null && count > 0
  }
}

export const characteristicService = {
  async getAllCharacteristics(locale: string) {
    let characteristicsData;
    
    const { data, error } = await supabase
      .from('rating_characteristics')
      .select(`
        id,
        min_rating,
        max_rating,
        rating_characteristics_translations!inner (
          label,
          description
        )
      `)
      .eq('rating_characteristics_translations.locale', locale)

    if (error) {
      // If translations not found, fallback to default language (en)
      if (locale !== 'en') {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('rating_characteristics')
          .select(`
            id,
            min_rating,
            max_rating,
            rating_characteristics_translations!inner (
              label,
              description
            )
          `)
          .eq('rating_characteristics_translations.locale', 'en')

        if (fallbackError) throw fallbackError
        characteristicsData = fallbackData
      } else {
        throw error
      }
    } else {
      characteristicsData = data
    }

    if (!characteristicsData) {
      throw new Error('No characteristics found')
    }

    return characteristicsData.map(item => ({
      id: item.id,
      label: item.rating_characteristics_translations[0].label,
      description: item.rating_characteristics_translations[0].description,
      min_rating: item.min_rating,
      max_rating: item.max_rating
    })) as RatingCharacteristic[]
  },

  async addCharacteristic(characteristic: RatingCharacteristicInsert) {
    const { data, error } = await supabase
      .from('rating_characteristics')
      .insert(characteristic)
      .select()
      .single()

    if (error) throw error
    return data as RatingCharacteristic
  },

  async updateCharacteristic(id: string, updates: Partial<RatingCharacteristic>) {
    const { data, error } = await supabase
      .from('rating_characteristics')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as RatingCharacteristic
  }
}
