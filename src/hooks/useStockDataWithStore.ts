import { useEffect, useCallback } from 'react';
import { useStocksData, useStockCache, useChartCache, useQuoteCache } from '@/stores';
import { stockApi } from '@/lib/api';
import type { StockData, ChartData, StockQuote } from '@/types/stock';

// Cache duration in milliseconds
const CACHE_DURATION = {
  STOCKS: 5 * 60 * 1000, // 5 minutes
  INDIVIDUAL: 2 * 60 * 1000, // 2 minutes
  CHARTS: 10 * 60 * 1000, // 10 minutes
  QUOTES: 30 * 1000, // 30 seconds
};

/**
 * Enhanced hook for managing stocks with Zustand store and caching
 */
export const useStockDataWithStore = () => {
  const {
    stocks,
    loading,
    error,
    setStocks,
    setStocksLoading,
    setStocksError,
  } = useStocksData();

  const fetchStocks = useCallback(async (force = false) => {
    try {
      setStocksLoading(true);
      setStocksError(null);
      
      const data = await stockApi.getStocks();
      setStocks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stocks';
      setStocksError(errorMessage);
      
      // Log error but don't throw to prevent component crashes
      console.error('Error fetching stocks:', err);
    } finally {
      setStocksLoading(false);
    }
  }, [setStocks, setStocksLoading, setStocksError]);

  // Auto-fetch on mount
  useEffect(() => {
    if (stocks.length === 0) {
      fetchStocks();
    }
  }, [fetchStocks, stocks.length]);

  return {
    stocks,
    loading,
    error,
    refetch: fetchStocks,
  };
};

/**
 * Enhanced hook for managing individual stock data with caching
 */
export const useStockWithStore = (symbol: string) => {
  const {
    stockCache,
    setStockInCache,
    loading,
    error,
    setIndividualLoading,
    setIndividualError,
  } = useStockCache();

  const stock = stockCache[symbol] || null;
  const isLoading = loading[symbol] || false;
  const stockError = error[symbol] || null;

  const fetchStock = useCallback(async (force = false) => {
    if (!symbol) return;

    try {
      setIndividualLoading(symbol, true);
      setIndividualError(symbol, null);
      
      const data = await stockApi.getStock(symbol);
      setStockInCache(symbol, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch stock ${symbol}`;
      setIndividualError(symbol, errorMessage);
      
      console.error(`Error fetching stock ${symbol}:`, err);
    } finally {
      setIndividualLoading(symbol, false);
    }
  }, [symbol, setStockInCache, setIndividualLoading, setIndividualError]);

  // Auto-fetch if not in cache
  useEffect(() => {
    if (symbol && !stock && !isLoading) {
      fetchStock();
    }
  }, [symbol, stock, isLoading, fetchStock]);

  return {
    stock,
    loading: isLoading,
    error: stockError,
    refetch: fetchStock,
  };
};

/**
 * Enhanced hook for managing chart data with caching
 */
export const useChartDataWithStore = (symbol: string, period = '1M') => {
  const {
    chartDataCache,
    setChartDataInCache,
    loading,
    error,
    setChartLoading,
    setChartError,
  } = useChartCache();

  const cacheKey = `${symbol}-${period}`;
  const chartData = chartDataCache[cacheKey] || [];
  const isLoading = loading[cacheKey] || false;
  const chartError = error[cacheKey] || null;

  const fetchChartData = useCallback(async (force = false) => {
    if (!symbol) return;

    try {
      setChartLoading(symbol, period, true);
      setChartError(symbol, period, null);
      
      const data = await stockApi.getHistoricalData(symbol, period);
      setChartDataInCache(symbol, period, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch chart data for ${symbol}`;
      setChartError(symbol, period, errorMessage);
      
      console.error(`Error fetching chart data for ${symbol}:`, err);
    } finally {
      setChartLoading(symbol, period, false);
    }
  }, [symbol, period, setChartDataInCache, setChartLoading, setChartError]);

  // Auto-fetch if not in cache
  useEffect(() => {
    if (symbol && chartData.length === 0 && !isLoading) {
      fetchChartData();
    }
  }, [symbol, chartData.length, isLoading, fetchChartData]);

  return {
    chartData,
    loading: isLoading,
    error: chartError,
    refetch: fetchChartData,
  };
};

/**
 * Enhanced hook for managing real-time quotes with caching
 */
export const useStockQuoteWithStore = (symbol: string, refreshInterval = 0) => {
  const {
    quotesCache,
    setQuoteInCache,
    loading,
    error,
    setQuoteLoading,
    setQuoteError,
  } = useQuoteCache();

  const quote = quotesCache[symbol] || null;
  const isLoading = loading[symbol] || false;
  const quoteError = error[symbol] || null;

  const fetchQuote = useCallback(async (force = false) => {
    if (!symbol) return;

    try {
      setQuoteLoading(symbol, true);
      setQuoteError(symbol, null);
      
      const data = await stockApi.getQuote(symbol);
      setQuoteInCache(symbol, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch quote for ${symbol}`;
      setQuoteError(symbol, errorMessage);
      
      console.error(`Error fetching quote for ${symbol}:`, err);
    } finally {
      setQuoteLoading(symbol, false);
    }
  }, [symbol, setQuoteInCache, setQuoteLoading, setQuoteError]);

  // Auto-fetch and set up refresh interval
  useEffect(() => {
    if (symbol && !quote && !isLoading) {
      fetchQuote();
    }

    // Set up refresh interval if specified
    if (refreshInterval > 0 && symbol) {
      const interval = setInterval(() => fetchQuote(true), refreshInterval);
      return () => clearInterval(interval);
    }
  }, [symbol, quote, isLoading, fetchQuote, refreshInterval]);

  return {
    quote,
    loading: isLoading,
    error: quoteError,
    refetch: fetchQuote,
  };
};

/**
 * Composite hook that provides all stock-related data for a dashboard
 */
export const useDashboardData = () => {
  const stocksData = useStockDataWithStore();
  
  return {
    ...stocksData,
    // Add convenience methods for common dashboard operations
    refreshAll: async () => {
      await stocksData.refetch();
    },
  };
};