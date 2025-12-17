import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import config from './config'

let supabaseClient: SupabaseClient | null = null

export const TRADE_DATE_BATCH_SIZE = 50

type TradeDateRow = {
  trade_date: string
}

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

export const fetchTradeDates = async ({
  limit = TRADE_DATE_BATCH_SIZE,
  beforeDate,
}: {
  limit?: number
  beforeDate?: string
} = {}): Promise<string[]> => {
  const supabase = getSupabaseClient()
  let query = supabase
    .from<'trade_dates', TradeDateRow>('trade_dates')
    .select('trade_date')
    .order('trade_date', { ascending: false })
    .limit(limit)

  if (beforeDate) {
    query = query.lt('trade_date', beforeDate)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`加载交易日期失败: ${error.message}`)
  }

  return (data ?? []).map(row => row.trade_date).filter(Boolean)
}

export default getSupabaseClient
