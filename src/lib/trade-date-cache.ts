import { addDays, format } from 'date-fns'

import { fetchTradeDates, TRADE_DATE_BATCH_SIZE } from './supabase'

let cachedDates: string[] = []
let cachedHasMore = true
let prefetchPromise: Promise<{ dates: string[]; hasMore: boolean }> | null =
  null

export const getDefaultTradeDateBefore = () =>
  format(addDays(new Date(), 1), 'yyyy-MM-dd')

export const getCachedTradeDates = () => cachedDates

export const getCachedHasMore = () => cachedHasMore

export const setTradeDateCache = (dates: string[], hasMore: boolean) => {
  cachedDates = dates
  cachedHasMore = hasMore
}

export const prefetchTradeDates = (
  beforeDate: string = getDefaultTradeDateBefore(),
  limit = TRADE_DATE_BATCH_SIZE
): Promise<{ dates: string[]; hasMore: boolean }> => {
  if (prefetchPromise) return prefetchPromise

  if (cachedDates.length > 0) {
    return Promise.resolve({ dates: cachedDates, hasMore: cachedHasMore })
  }

  prefetchPromise = fetchTradeDates({ beforeDate, limit })
    .then(dates => {
      const hasMore = dates.length >= limit
      setTradeDateCache(dates, hasMore)
      return { dates, hasMore }
    })
    .catch(err => {
      prefetchPromise = null
      throw err
    })

  return prefetchPromise
}

if (typeof window !== 'undefined') {
  void prefetchTradeDates()
}
