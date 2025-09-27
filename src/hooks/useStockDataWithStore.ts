import { useEffect, useCallback, useMemo } from 'react';
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
  const stocksDataSelector = useStocksData();
  
  // Memoize the selector result to prevent object recreation
  const stocksData = useMemo(() => stocksDataSelector, [
    stocksDataSelector.stocks,
    stocksDataSelector.loading,
    stocksDataSelector.error,
    stocksDataSelector.setStocks,
    stocksDataSelector.setStocksLoading,
    stocksDataSelector.setStocksError,
  ]);

  const fetchStocks = useCallback(async (force = false) => {
    try {
      stocksData.setStocksLoading(true);
      stocksData.setStocksError(null);
      
      const data = await stockApi.getStocks();
      stocksData.setStocks(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch stocks';
      stocksData.setStocksError(errorMessage);
      
      // Log error but don't throw to prevent component crashes
      console.error('Error fetching stocks:', err);
    } finally {
      stocksData.setStocksLoading(false);
    }
  }, [stocksData.setStocks, stocksData.setStocksLoading, stocksData.setStocksError]);

  // Auto-fetch on mount - removed dependency on stocks.length to prevent infinite loop
  useEffect(() => {
    if (stocksData.stocks.length === 0 && !stocksData.loading) {
      fetchStocks();
    }
  }, [stocksData.stocks.length, stocksData.loading]); // Removed fetchStocks from deps

  return {
    stocks: stocksData.stocks,
    loading: stocksData.loading,
    error: stocksData.error,
    refetch: fetchStocks,
  };
};

/**
 * Enhanced hook for managing individual stock data with caching
 */
export const useStockWithStore = (symbol: string) => {
  const stockCacheSelector = useStockCache();
  
  // Memoize the cache data to prevent unnecessary re-renders
  const stockCache = useMemo(() => stockCacheSelector, [
    stockCacheSelector.stockCache,
    stockCacheSelector.loading,
    stockCacheSelector.error,
    stockCacheSelector.setStockInCache,
    stockCacheSelector.setIndividualLoading,
    stockCacheSelector.setIndividualError,
  ]);

  const stock = stockCache.stockCache[symbol] || null;
  const isLoading = stockCache.loading[symbol] || false;
  const stockError = stockCache.error[symbol] || null;

  const fetchStock = useCallback(async (force = false) => {
    if (!symbol) return;

    try {
      stockCache.setIndividualLoading(symbol, true);
      stockCache.setIndividualError(symbol, null);
      
      const data = await stockApi.getStock(symbol);
      stockCache.setStockInCache(symbol, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch stock ${symbol}`;
      stockCache.setIndividualError(symbol, errorMessage);
      
      console.error(`Error fetching stock ${symbol}:`, err);
    } finally {
      stockCache.setIndividualLoading(symbol, false);
    }
  }, [symbol, stockCache.setStockInCache, stockCache.setIndividualLoading, stockCache.setIndividualError]);

  // Auto-fetch if not in cache - use ref to prevent infinite loop
  useEffect(() => {
    if (symbol && !stock && !isLoading) {
      fetchStock();
    }
  }, [symbol, stock, isLoading]); // Removed fetchStock from deps

  return useMemo(() => ({
    stock,
    loading: isLoading,
    error: stockError,
    refetch: fetchStock,
  }), [stock, isLoading, stockError, fetchStock]);
};

/**
 * Enhanced hook for managing chart data with caching
 */
export const useChartDataWithStore = (symbol: string, period = '1M') => {
  const chartCacheSelector = useChartCache();
  
  // Memoize chart cache to prevent unnecessary re-renders
  const chartCache = useMemo(() => chartCacheSelector, [
    chartCacheSelector.chartDataCache,
    chartCacheSelector.loading,
    chartCacheSelector.error,
    chartCacheSelector.setChartDataInCache,
    chartCacheSelector.setChartLoading,
    chartCacheSelector.setChartError,
  ]);

  const cacheKey = `${symbol}-${period}`;
  const chartData = chartCache.chartDataCache[cacheKey] || [];
  const isLoading = chartCache.loading[cacheKey] || false;
  const chartError = chartCache.error[cacheKey] || null;

  const fetchChartData = useCallback(async (force = false) => {
    if (!symbol) return;

    try {
      chartCache.setChartLoading(symbol, period, true);
      chartCache.setChartError(symbol, period, null);
      
      const data = await stockApi.getHistoricalData(symbol, period);
      chartCache.setChartDataInCache(symbol, period, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch chart data for ${symbol}`;
      chartCache.setChartError(symbol, period, errorMessage);
      
      console.error(`Error fetching chart data for ${symbol}:`, err);
    } finally {
      chartCache.setChartLoading(symbol, period, false);
    }
  }, [symbol, period, chartCache.setChartDataInCache, chartCache.setChartLoading, chartCache.setChartError]);

  // Auto-fetch if not in cache
  useEffect(() => {
    if (symbol && chartData.length === 0 && !isLoading) {
      fetchChartData();
    }
  }, [symbol, chartData.length, isLoading]); // Removed fetchChartData from deps

  return useMemo(() => ({
    chartData,
    loading: isLoading,
    error: chartError,
    refetch: fetchChartData,
  }), [chartData, isLoading, chartError, fetchChartData]);
};

/**
 * Enhanced hook for managing real-time quotes with caching
 */
export const useStockQuoteWithStore = (symbol: string, refreshInterval = 0) => {
  const quoteCacheSelector = useQuoteCache();
  
  // Memoize quote cache to prevent unnecessary re-renders
  const quoteCache = useMemo(() => quoteCacheSelector, [
    quoteCacheSelector.quotesCache,
    quoteCacheSelector.loading,
    quoteCacheSelector.error,
    quoteCacheSelector.setQuoteInCache,
    quoteCacheSelector.setQuoteLoading,
    quoteCacheSelector.setQuoteError,
  ]);

  const quote = quoteCache.quotesCache[symbol] || null;
  const isLoading = quoteCache.loading[symbol] || false;
  const quoteError = quoteCache.error[symbol] || null;

  const fetchQuote = useCallback(async (force = false) => {
    if (!symbol) return;

    try {
      quoteCache.setQuoteLoading(symbol, true);
      quoteCache.setQuoteError(symbol, null);
      
      const data = await stockApi.getQuote(symbol);
      quoteCache.setQuoteInCache(symbol, data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch quote for ${symbol}`;
      quoteCache.setQuoteError(symbol, errorMessage);
      
      console.error(`Error fetching quote for ${symbol}:`, err);
    } finally {
      quoteCache.setQuoteLoading(symbol, false);
    }
  }, [symbol, quoteCache.setQuoteInCache, quoteCache.setQuoteLoading, quoteCache.setQuoteError]);

  // Auto-fetch and set up refresh interval
  useEffect(() => {
    if (symbol && !quote && !isLoading) {
      fetchQuote();
    }
  }, [symbol, quote, isLoading]); // Removed fetchQuote from deps

  // Set up refresh interval effect separately to avoid dependency issues
  useEffect(() => {
    if (refreshInterval > 0 && symbol) {
      const interval = setInterval(() => fetchQuote(true), refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, symbol, fetchQuote]);

  return useMemo(() => ({
    quote,
    loading: isLoading,
    error: quoteError,
    refetch: fetchQuote,
  }), [quote, isLoading, quoteError, fetchQuote]);
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