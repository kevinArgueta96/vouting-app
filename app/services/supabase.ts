import { supabase } from '../lib/supabase'
import { Database } from '../types/supabase'

type Cocktail = Database['public']['Tables']['cocktails']['Row']
type CocktailRating = Database['public']['Tables']['cocktail_ratings']['Row']
type CocktailRatingInsert = Database['public']['Tables']['cocktail_ratings']['Insert']
type RatingCharacteristic = Database['public']['Tables']['rating_characteristics']['Row']
type RatingCharacteristicInsert = Database['public']['Tables']['rating_characteristics']['Insert']

export const cocktailService = {
  async getAllCocktails() {
    const { data, error } = await supabase
      .from('cocktails')
      .select('*')

    if (error) throw error
    return data as Cocktail[]
  },

  async getCocktailById(id: number) {
    const { data, error } = await supabase
      .from('cocktails')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Cocktail
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

type FeatureFlag = Database['public']['Tables']['feature_flags']['Row']

export const featureFlagService = {
  async isFeatureEnabled(featureId: string) {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('is_enabled')
        .eq('id', featureId)
        .single()

      if (error) {
        console.error('Error fetching feature flag:', error)
        return false // Default to false if there's an error
      }

      return data?.is_enabled ?? false
    } catch (error) {
      console.error('Error in isFeatureEnabled:', error)
      return false // Default to false on any error
    }
  }
}

export const ratingService = {
  async checkExistingVote(cocktailId: number, ipAddress: string, userAgent: string) {
    const { data, error } = await supabase
      .from('cocktail_ratings')
      .select('id')
      .eq('cocktail_id', cocktailId)
      .eq('ip_address', ipAddress)
      .eq('user_agent', userAgent)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 means no rows returned
    return !!data // returns true if a vote exists
  },

  async submitRating(rating: CocktailRatingInsert) {
    const { data, error } = await supabase
      .from('cocktail_ratings')
      .insert(rating)
      .select()
      .single()

    if (error) throw error
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
      appearance: stats.appearance / stats.total_ratings,
      taste: stats.taste / stats.total_ratings,
      innovativeness: stats.innovativeness / stats.total_ratings,
      total_ratings: stats.total_ratings
    }
  }
}

export const characteristicService = {
  async getAllCharacteristics() {
    const { data, error } = await supabase
      .from('rating_characteristics')
      .select('*')

    if (error) throw error
    return data as RatingCharacteristic[]
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
