import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  date_of_birth?: string
  emergency_contact?: string
  created_at: string
  updated_at: string
}

export interface Trek {
  id: string
  name: string
  region: string
  difficulty: 'Easy' | 'Moderate' | 'Challenging'
  image: string
  description: string
  price: string
  duration_days?: number
  max_altitude?: number
  group_size?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  trek_id: string
  trek_name: string
  trek_price: string
  payment_status: 'pending' | 'completed' | 'failed'
  booking_date: string
  participants_count: number
  special_requirements?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  booking_id: string
  amount: string
  currency: string
  payment_method: string
  status: 'pending' | 'completed' | 'failed'
  transaction_id?: string
  payment_date: string
  created_at: string
  updated_at: string
} 