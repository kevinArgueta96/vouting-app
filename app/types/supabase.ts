export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cocktails_translations: {
        Row: {
          id: number
          cocktail_id: number
          locale: string
          name: string
          brand: string
          description: string
          recipe: string | null
        }
        Insert: {
          id?: number
          cocktail_id: number
          locale: string
          name: string
          brand: string
          description: string
          recipe?: string | null
        }
        Update: {
          id?: number
          cocktail_id?: number
          locale?: string
          name?: string
          brand?: string
          description?: string
          recipe?: string | null
        }
      }
      rating_characteristics_translations: {
        Row: {
          id: number
          rating_characteristics_id: string
          locale: string
          label: string
          description: string | null
        }
        Insert: {
          id?: number
          rating_characteristics_id: string
          locale: string
          label: string
          description?: string | null
        }
        Update: {
          id?: number
          rating_characteristics_id?: string
          locale?: string
          label?: string
          description?: string | null
        }
      }
      cocktails: {
        Row: {
          id: number
          name: string
          brand: string
          description: string
        }
        Insert: {
          id?: number
          name: string
          brand: string
          description: string
        }
        Update: {
          id?: number
          name?: string
          brand?: string
          description?: string
        }
      }
      user_sessions: {
        Row: {
          user_uuid: string
          created_at: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          user_uuid: string
          created_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          user_uuid?: string
          created_at?: string
          ip_address?: string | null
          user_agent?: string | null
        }
      }
      cocktail_ratings: {
        Row: {
          id: number
          cocktail_id: number
          appearance: number
          taste: number
          innovativeness: number
          user_email: string | null
          user_uuid: string
          created_at: string
        }
        Insert: {
          id?: number
          cocktail_id: number
          appearance: number
          taste: number
          innovativeness: number
          user_email?: string | null
          user_uuid: string
          created_at?: string
        }
        Update: {
          id?: number
          cocktail_id?: number
          appearance?: number
          taste?: number
          innovativeness?: number
          user_email?: string | null
          user_uuid?: string
          created_at?: string
        }
      }
      rating_characteristics: {
        Row: {
          id: string
          label: string
          description: string | null
          min_rating: number
          max_rating: number
        }
        Insert: {
          id: string
          label: string
          description?: string | null
          min_rating: number
          max_rating: number
        }
        Update: {
          id?: string
          label?: string
          description?: string | null
          min_rating?: number
          max_rating?: number
        }
      }
      feature_flags: {
        Row: {
          id: string
          is_enabled: boolean
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          is_enabled: boolean
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          is_enabled?: boolean
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
