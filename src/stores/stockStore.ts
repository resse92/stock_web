import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import type { StockState, StockActions } from '@/types/store';
import type { StockData, ChartData, StockQuote } from '@/types/stock';

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
};

// Stock Store with actions
export interface StockStore extends StockState, StockActions {}

export const useStockStore = create<StockStore>()(
  devtools(
    (set, get) => ({
      ...initialStockState,

      // Stock data actions
      setStocks: (stocks: StockData[]) => {
        set(
          {
            stocks,
            lastFetch: {
              ...get().lastFetch,
              stocks: Date.now(),
            },
          },
          false,
          'stocks/setStocks'
        );
      },

      addStock: (stock: StockData) => {
        set(
          (state) => ({
            stocks: [...state.stocks.filter(s => s.symbol !== stock.symbol), stock],
            stockCache: {
              ...state.stockCache,
              [stock.symbol]: stock,
            },
          }),
          false,
          'stocks/addStock'
        );
      },

      updateStock: (symbol: string, updates: Partial<StockData>) => {
        set(
          (state) => ({
            stocks: state.stocks.map(stock => 
              stock.symbol === symbol ? { ...stock, ...updates } : stock
            ),
            stockCache: {
              ...state.stockCache,
              [symbol]: state.stockCache[symbol] 
                ? { ...state.stockCache[symbol], ...updates }
                : state.stockCache[symbol],
            },
          }),
          false,
          'stocks/updateStock'
        );
      },

      // Cache management
      setStockInCache: (symbol: string, stock: StockData) => {
        set(
          (state) => ({
            stockCache: {
              ...state.stockCache,
              [symbol]: stock,
            },
            lastFetch: {
              ...state.lastFetch,
              individual: {
                ...state.lastFetch.individual,
                [symbol]: Date.now(),
              },
            },
          }),
          false,
          'stocks/setStockInCache'
        );
      },

      setChartDataInCache: (symbol: string, period: string, data: ChartData[]) => {
        const key = `${symbol}-${period}`;
        set(
          (state) => ({
            chartDataCache: {
              ...state.chartDataCache,
              [key]: data,
            },
            lastFetch: {
              ...state.lastFetch,
              charts: {
                ...state.lastFetch.charts,
                [key]: Date.now(),
              },
            },
          }),
          false,
          'stocks/setChartDataInCache'
        );
      },

      setQuoteInCache: (symbol: string, quote: StockQuote) => {
        set(
          (state) => ({
            quotesCache: {
              ...state.quotesCache,
              [symbol]: quote,
            },
            lastFetch: {
              ...state.lastFetch,
              quotes: {
                ...state.lastFetch.quotes,
                [symbol]: Date.now(),
              },
            },
          }),
          false,
          'stocks/setQuoteInCache'
        );
      },

      // Loading states
      setStocksLoading: (loading: boolean) => {
        set(
          (state) => ({
            loading: {
              ...state.loading,
              stocks: loading,
            },
          }),
          false,
          'stocks/setStocksLoading'
        );
      },

      setIndividualLoading: (symbol: string, loading: boolean) => {
        set(
          (state) => ({
            loading: {
              ...state.loading,
              individual: {
                ...state.loading.individual,
                [symbol]: loading,
              },
            },
          }),
          false,
          'stocks/setIndividualLoading'
        );
      },

      setChartLoading: (symbol: string, period: string, loading: boolean) => {
        const key = `${symbol}-${period}`;
        set(
          (state) => ({
            loading: {
              ...state.loading,
              charts: {
                ...state.loading.charts,
                [key]: loading,
              },
            },
          }),
          false,
          'stocks/setChartLoading'
        );
      },

      setQuoteLoading: (symbol: string, loading: boolean) => {
        set(
          (state) => ({
            loading: {
              ...state.loading,
              quotes: {
                ...state.loading.quotes,
                [symbol]: loading,
              },
            },
          }),
          false,
          'stocks/setQuoteLoading'
        );
      },

      // Error states
      setStocksError: (error: string | null) => {
        set(
          (state) => ({
            error: {
              ...state.error,
              stocks: error,
            },
          }),
          false,
          'stocks/setStocksError'
        );
      },

      setIndividualError: (symbol: string, error: string | null) => {
        set(
          (state) => ({
            error: {
              ...state.error,
              individual: {
                ...state.error.individual,
                [symbol]: error,
              },
            },
          }),
          false,
          'stocks/setIndividualError'
        );
      },

      setChartError: (symbol: string, period: string, error: string | null) => {
        const key = `${symbol}-${period}`;
        set(
          (state) => ({
            error: {
              ...state.error,
              charts: {
                ...state.error.charts,
                [key]: error,
              },
            },
          }),
          false,
          'stocks/setChartError'
        );
      },

      setQuoteError: (symbol: string, error: string | null) => {
        set(
          (state) => ({
            error: {
              ...state.error,
              quotes: {
                ...state.error.quotes,
                [symbol]: error,
              },
            },
          }),
          false,
          'stocks/setQuoteError'
        );
      },

      // Cache invalidation
      invalidateStocksCache: () => {
        set(
          (state) => ({
            lastFetch: {
              ...state.lastFetch,
              stocks: null,
            },
          }),
          false,
          'stocks/invalidateStocksCache'
        );
      },

      invalidateStockCache: (symbol: string) => {
        set(
          (state) => ({
            lastFetch: {
              ...state.lastFetch,
              individual: {
                ...state.lastFetch.individual,
                [symbol]: 0,
              },
            },
          }),
          false,
          'stocks/invalidateStockCache'
        );
      },

      invalidateChartCache: (symbol: string, period?: string) => {
        set(
          (state) => {
            const newChartsFetch = { ...state.lastFetch.charts };
            
            if (period) {
              const key = `${symbol}-${period}`;
              newChartsFetch[key] = 0;
            } else {
              // Invalidate all periods for this symbol
              Object.keys(newChartsFetch).forEach(key => {
                if (key.startsWith(`${symbol}-`)) {
                  newChartsFetch[key] = 0;
                }
              });
            }
            
            return {
              lastFetch: {
                ...state.lastFetch,
                charts: newChartsFetch,
              },
            };
          },
          false,
          'stocks/invalidateChartCache'
        );
      },

      invalidateQuoteCache: (symbol: string) => {
        set(
          (state) => ({
            lastFetch: {
              ...state.lastFetch,
              quotes: {
                ...state.lastFetch.quotes,
                [symbol]: 0,
              },
            },
          }),
          false,
          'stocks/invalidateQuoteCache'
        );
      },
    }),
    {
      name: 'StockStore',
    }
  )
);

// Selector hooks for better performance
export const useStocksData = () => {
  return useStockStore((state) => ({
    stocks: state.stocks,
    loading: state.loading.stocks,
    error: state.error.stocks,
    setStocks: state.setStocks,
    setStocksLoading: state.setStocksLoading,
    setStocksError: state.setStocksError,
  }), shallow);
};

export const useStockCache = () => {
  return useStockStore((state) => ({
    stockCache: state.stockCache,
    setStockInCache: state.setStockInCache,
    loading: state.loading.individual,
    error: state.error.individual,
    setIndividualLoading: state.setIndividualLoading,
    setIndividualError: state.setIndividualError,
  }), shallow);
};

export const useChartCache = () => {
  return useStockStore((state) => ({
    chartDataCache: state.chartDataCache,
    setChartDataInCache: state.setChartDataInCache,
    loading: state.loading.charts,
    error: state.error.charts,
    setChartLoading: state.setChartLoading,
    setChartError: state.setChartError,
  }), shallow);
};

export const useQuoteCache = () => {
  return useStockStore((state) => ({
    quotesCache: state.quotesCache,
    setQuoteInCache: state.setQuoteInCache,
    loading: state.loading.quotes,
    error: state.error.quotes,
    setQuoteLoading: state.setQuoteLoading,
    setQuoteError: state.setQuoteError,
  }), shallow);
};