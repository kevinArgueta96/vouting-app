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
      cocktail_ratings: {
        Row: {
          id: number
          cocktail_id: number
          appearance: number
          taste: number
          innovativeness: number
          user_email: string | null,
          ip_address: string | null,
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: number
          cocktail_id: number
          appearance: number
          taste: number
          innovativeness: number
          user_email?: string | null,
          ip_address?: string | null,
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          cocktail_id?: number
          appearance?: number
          taste?: number
          innovativeness?: number
          user_email?: string | null,
          ip_address?: string | null,
          user_agent?: string | null
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
