// lib/supabaseClient.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

// Bu fonksiyon, tarayıcı tarafında güvenli bir şekilde kullanılabilen
// anonim istemciyi oluşturur.
export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Bu fonksiyon, YALNIZCA SUNUCU TARAFINDA KULLANILMAK ÜZERE,
// tam yetkili (service_role) istemciyi oluşturur.
// Row Level Security'yi atlar.
export const createAdminClient = () => {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_KEY is not set in .env.local')
  }
  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
