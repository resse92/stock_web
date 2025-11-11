import { atom } from 'jotai'
import type { StockState } from '@/types/store'
import type { StockData, ChartData, StockQuote } from '@/types/stock'

// Initial stock state
const initialStockState: StockState = {
  stocks: [],
  stockCache: {},
  chartDataCache: {},
  quotesCache: {},
  loading: {
    stocks: false,
    individual: {},
    charts: {},
    quotes: {},
  },
  error: {
    stocks: null,
    individual: {},
    charts: {},
    quotes: {},
  },
  lastFetch: {
    stocks: null,
    individual: {},
    charts: {},
    quotes: {},
  },
}

// Base atoms
export const stocksAtom = atom<StockData[]>(initialStockState.stocks)
export const stockCacheAtom = atom<Record<string, StockData>>(
  initialStockState.stockCache
)
export const chartDataCacheAtom = atom<Record<string, ChartData[]>>(
  initialStockState.chartDataCache
)
export const quotesCacheAtom = atom<Record<string, StockQuote>>(
  initialStockState.quotesCache
)
export const stockLoadingAtom = atom<StockState['loading']>(
  initialStockState.loading
)
export const stockErrorAtom = atom<StockState['error']>(initialStockState.error)
export const lastFetchAtom = atom<StockState['lastFetch']>(
  initialStockState.lastFetch
)

// Action atoms - Stock data
export const setStocksAtom = atom(null, (get, set, stocks: StockData[]) => {
  set(stocksAtom, stocks)
  set(lastFetchAtom, {
    ...get(lastFetchAtom),
    stocks: Date.now(),
  })
})

export const addStockAtom = atom(null, (get, set, stock: StockData) => {
  const current = get(stocksAtom)
  set(stocksAtom, [...current.filter(s => s.symbol !== stock.symbol), stock])
  set(stockCacheAtom, {
    ...get(stockCacheAtom),
    [stock.symbol]: stock,
  })
})

export const updateStockAtom = atom(
  null,
  (get, set, symbol: string, updates: Partial<StockData>) => {
    set(
      stocksAtom,
      get(stocksAtom).map(stock =>
        stock.symbol === symbol ? { ...stock, ...updates } : stock
      )
    )
    const cache = get(stockCacheAtom)
    if (cache[symbol]) {
      set(stockCacheAtom, {
        ...cache,
        [symbol]: { ...cache[symbol], ...updates },
      })
    }
  }
)

// Action atoms - Cache management
export const setStockInCacheAtom = atom(
  null,
  (get, set, symbol: string, stock: StockData) => {
    set(stockCacheAtom, {
      ...get(stockCacheAtom),
      [symbol]: stock,
    })
    set(lastFetchAtom, {
      ...get(lastFetchAtom),
      individual: {
        ...get(lastFetchAtom).individual,
        [symbol]: Date.now(),
      },
    })
  }
)

export const setChartDataInCacheAtom = atom(
  null,
  (get, set, symbol: string, period: string, data: ChartData[]) => {
    const key = `${symbol}-${period}`
    set(chartDataCacheAtom, {
      ...get(chartDataCacheAtom),
      [key]: data,
    })
    set(lastFetchAtom, {
      ...get(lastFetchAtom),
      charts: {
        ...get(lastFetchAtom).charts,
        [key]: Date.now(),
      },
    })
  }
)

export const setQuoteInCacheAtom = atom(
  null,
  (get, set, symbol: string, quote: StockQuote) => {
    set(quotesCacheAtom, {
      ...get(quotesCacheAtom),
      [symbol]: quote,
    })
    set(lastFetchAtom, {
      ...get(lastFetchAtom),
      quotes: {
        ...get(lastFetchAtom).quotes,
        [symbol]: Date.now(),
      },
    })
  }
)

// Action atoms - Loading states
export const setStocksLoadingAtom = atom(null, (get, set, loading: boolean) => {
  set(stockLoadingAtom, {
    ...get(stockLoadingAtom),
    stocks: loading,
  })
})

export const setIndividualLoadingAtom = atom(
  null,
  (get, set, symbol: string, loading: boolean) => {
    set(stockLoadingAtom, {
      ...get(stockLoadingAtom),
      individual: {
        ...get(stockLoadingAtom).individual,
        [symbol]: loading,
      },
    })
  }
)

export const setChartLoadingAtom = atom(
  null,
  (get, set, symbol: string, period: string, loading: boolean) => {
    const key = `${symbol}-${period}`
    set(stockLoadingAtom, {
      ...get(stockLoadingAtom),
      charts: {
        ...get(stockLoadingAtom).charts,
        [key]: loading,
      },
    })
  }
)

export const setQuoteLoadingAtom = atom(
  null,
  (get, set, symbol: string, loading: boolean) => {
    set(stockLoadingAtom, {
      ...get(stockLoadingAtom),
      quotes: {
        ...get(stockLoadingAtom).quotes,
        [symbol]: loading,
      },
    })
  }
)

// Action atoms - Error states
export const setStocksErrorAtom = atom(
  null,
  (get, set, error: string | null) => {
    set(stockErrorAtom, {
      ...get(stockErrorAtom),
      stocks: error,
    })
  }
)

export const setIndividualErrorAtom = atom(
  null,
  (get, set, symbol: string, error: string | null) => {
    set(stockErrorAtom, {
      ...get(stockErrorAtom),
      individual: {
        ...get(stockErrorAtom).individual,
        [symbol]: error,
      },
    })
  }
)

export const setChartErrorAtom = atom(
  null,
  (get, set, symbol: string, period: string, error: string | null) => {
    const key = `${symbol}-${period}`
    set(stockErrorAtom, {
      ...get(stockErrorAtom),
      charts: {
        ...get(stockErrorAtom).charts,
        [key]: error,
      },
    })
  }
)

export const setQuoteErrorAtom = atom(
  null,
  (get, set, symbol: string, error: string | null) => {
    set(stockErrorAtom, {
      ...get(stockErrorAtom),
      quotes: {
        ...get(stockErrorAtom).quotes,
        [symbol]: error,
      },
    })
  }
)

// Action atoms - Cache invalidation
export const invalidateStocksCacheAtom = atom(null, (get, set) => {
  set(lastFetchAtom, {
    ...get(lastFetchAtom),
    stocks: null,
  })
})

export const invalidateStockCacheAtom = atom(
  null,
  (get, set, symbol: string) => {
    set(lastFetchAtom, {
      ...get(lastFetchAtom),
      individual: {
        ...get(lastFetchAtom).individual,
        [symbol]: 0,
      },
    })
  }
)

export const invalidateChartCacheAtom = atom(
  null,
  (get, set, symbol: string, period?: string) => {
    const lastFetch = get(lastFetchAtom)
    const newChartsFetch = { ...lastFetch.charts }

    if (period) {
      const key = `${symbol}-${period}`
      newChartsFetch[key] = 0
    } else {
      // Invalidate all periods for this symbol
      Object.keys(newChartsFetch).forEach(key => {
        if (key.startsWith(`${symbol}-`)) {
          newChartsFetch[key] = 0
        }
      })
    }

    set(lastFetchAtom, {
      ...lastFetch,
      charts: newChartsFetch,
    })
  }
)

export const invalidateQuoteCacheAtom = atom(
  null,
  (get, set, symbol: string) => {
    set(lastFetchAtom, {
      ...get(lastFetchAtom),
      quotes: {
        ...get(lastFetchAtom).quotes,
        [symbol]: 0,
      },
    })
  }
)

// Combined stock state atom (for compatibility)
export const stockStateAtom = atom(get => ({
  stocks: get(stocksAtom),
  stockCache: get(stockCacheAtom),
  chartDataCache: get(chartDataCacheAtom),
  quotesCache: get(quotesCacheAtom),
  loading: get(stockLoadingAtom),
  error: get(stockErrorAtom),
  lastFetch: get(lastFetchAtom),
}))
