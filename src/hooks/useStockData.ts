import { useState, useEffect, useCallback } from 'react'
import type { StockData, ChartData, StockQuote } from '@/types/stock'
import { stockApi } from '@/lib/api'

/**
 * Custom hook for managing stock data with API integration
 */
export const useStockData = () => {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStocks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await stockApi.getStocks()
      setStocks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stocks')
      console.error('Error fetching stocks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStocks()
  }, [fetchStocks])

  return {
    stocks,
    loading,
    error,
    refetch: fetchStocks,
  }
}

/**
 * Custom hook for managing single stock data
 */
export const useStock = (symbol: string) => {
  const [stock, setStock] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStock = useCallback(async () => {
    if (!symbol) return

    try {
      setLoading(true)
      setError(null)
      const data = await stockApi.getStock(symbol)
      setStock(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : `Failed to fetch stock ${symbol}`
      )
      console.error(`Error fetching stock ${symbol}:`, err)
    } finally {
      setLoading(false)
    }
  }, [symbol])

  useEffect(() => {
    fetchStock()
  }, [fetchStock])

  return {
    stock,
    loading,
    error,
    refetch: fetchStock,
  }
}

/**
 * Custom hook for managing historical chart data
 */
export const useChartData = (symbol: string, period = '1M') => {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchChartData = useCallback(async () => {
    if (!symbol) return

    try {
      setLoading(true)
      setError(null)
      const data = await stockApi.getHistoricalData(symbol, period)
      setChartData(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to fetch chart data for ${symbol}`
      )
      console.error(`Error fetching chart data for ${symbol}:`, err)
    } finally {
      setLoading(false)
    }
  }, [symbol, period])

  useEffect(() => {
    fetchChartData()
  }, [fetchChartData])

  return {
    chartData,
    loading,
    error,
    refetch: fetchChartData,
  }
}

/**
 * Custom hook for real-time stock quotes
 */
export const useStockQuote = (symbol: string, refreshInterval = 0) => {
  const [quote, setQuote] = useState<StockQuote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchQuote = useCallback(async () => {
    if (!symbol) return

    try {
      setLoading(true)
      setError(null)
      const data = await stockApi.getQuote(symbol)
      setQuote(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to fetch quote for ${symbol}`
      )
      console.error(`Error fetching quote for ${symbol}:`, err)
    } finally {
      setLoading(false)
    }
  }, [symbol])

  useEffect(() => {
    fetchQuote()

    // Set up refresh interval if specified
    if (refreshInterval > 0) {
      const interval = setInterval(fetchQuote, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [fetchQuote, refreshInterval])

  return {
    quote,
    loading,
    error,
    refetch: fetchQuote,
  }
}
