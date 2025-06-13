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
      sensors: {
        Row: {
          id: number
          name: string
          type: string
          latitude: number
          longitude: number
          status: string
          last_reading: number | null
          last_updated: string
          battery_level: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          type: string
          latitude: number
          longitude: number
          status?: string
          last_reading?: number | null
          last_updated?: string
          battery_level?: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          type?: string
          latitude?: number
          longitude?: number
          status?: string
          last_reading?: number | null
          last_updated?: string
          battery_level?: number
          created_at?: string
        }
      }
      alerts: {
        Row: {
          id: number
          type: string
          severity: string
          latitude: number
          longitude: number
          description: string
          created_at: string
          resolved_at: string | null
          confirmed: boolean
        }
        Insert: {
          id?: number
          type: string
          severity: string
          latitude: number
          longitude: number
          description: string
          created_at?: string
          resolved_at?: string | null
          confirmed?: boolean
        }
        Update: {
          id?: number
          type?: string
          severity?: string
          latitude?: number
          longitude?: number
          description?: string
          created_at?: string
          resolved_at?: string | null
          confirmed?: boolean
        }
      }
      resources: {
        Row: {
          id: number
          name: string
          type: string
          quantity: number
          status: string
          latitude: number | null
          longitude: number | null
          last_updated: string
        }
        Insert: {
          id?: number
          name: string
          type: string
          quantity: number
          status?: string
          latitude?: number | null
          longitude?: number | null
          last_updated?: string
        }
        Update: {
          id?: number
          name?: string
          type?: string
          quantity?: number
          status?: string
          latitude?: number | null
          longitude?: number | null
          last_updated?: string
        }
      }
      reports: {
        Row: {
          id: number
          user_id: string
          description: string
          latitude: number
          longitude: number
          image_url: string | null
          created_at: string
          status: string
        }
        Insert: {
          id?: number
          user_id: string
          description: string
          latitude: number
          longitude: number
          image_url?: string | null
          created_at?: string
          status?: string
        }
        Update: {
          id?: number
          user_id?: string
          description?: string
          latitude?: number
          longitude?: number
          image_url?: string | null
          created_at?: string
          status?: string
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