import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import config from './config'

let supabaseClient: SupabaseClient | null = null

const createSupabaseClient = (): SupabaseClient => {
  const { url, anonKey } = config.supabaseConfig

  if (!url || !anonKey) {
    throw new Error(
      'Supabase client is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    )
  }

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient()
  }
  return supabaseClient
}

export default getSupabaseClient
