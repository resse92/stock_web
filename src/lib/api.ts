import type {
  ApiResponse,
  RpsItemData,
  ChartData,
  StockQuote,
  StockData,
} from '@/types/stock'
import type { StockApiEndpoints, RpsFilter } from '@/types/api'
import { httpClient } from './http-client'
import { mockStockData, generateChartData } from '@/utils/mockData'
import { config } from './config'

/**
 * Stock API Service
 * Provides methods for fetching stock data from the API with fallback to mock data
 */
class StockApiService {
  private endpoints: StockApiEndpoints = {
    getStocks: () => '/api/stocks',
    getStock: (symbol: string) => `/api/stocks/${symbol}`,
    getHistoricalData: (symbol: string, period = '1M') =>
      `/api/stocks/${symbol}/historical?period=${period}`,
    getQuote: (symbol: string) => `/api/stocks/${symbol}/quote`,
    getRps: (date: string, filter: RpsFilter) => {
      let url = `/api/v1/joinquant/rps?date=${date}`
      if (filter.rps3) {
        url += `&rps3=(${filter.rps3.min},${filter.rps3.max})`
      }
      if (filter.rps5) {
        url += `&rps5=(${filter.rps5.min},${filter.rps5.max})`
      }
      if (filter.rps15) {
        url += `&rps15=(${filter.rps15.min},${filter.rps15.max})`
      }
      if (filter.rps30) {
        url += `&rps30=(${filter.rps30.min},${filter.rps30.max})`
      }
      if (filter.marketCap) {
        url += `&circulating_market_cap=(${filter.marketCap},)`
      }
      if (filter.listingDays) {
        url += `&listed_days=(${filter.listingDays},)`
      }
      return url
    },
  }

  /**
   * Get all stocks
   */
  public async getStocks(): Promise<StockData[]> {
    try {
      const response = await httpClient.get<StockData[]>(
        this.endpoints.getStocks()
      )
      return response.data
    } catch (error) {
      // Fallback to mock data in development or when API is unavailable
      if (config.isDevelopment) {
        console.warn('API unavailable, using mock data:', error)
        return mockStockData
      }
      throw error
    }
  }

  /**
   * Get single stock by symbol
   */
  public async getStock(symbol: string): Promise<StockData> {
    try {
      const response = await httpClient.get<StockData>(
        this.endpoints.getStock(symbol)
      )
      return response.data
    } catch (error) {
      // Fallback to mock data
      if (config.isDevelopment) {
        console.warn(`API unavailable for ${symbol}, using mock data:`, error)
        const mockStock = mockStockData.find(stock => stock.symbol === symbol)
        if (mockStock) {
          return mockStock
        }
        throw new Error(`Stock ${symbol} not found`)
      }
      throw error
    }
  }

  /**
   * Get historical data for a stock
   */
  public async getHistoricalData(
    symbol: string,
    period = '1M'
  ): Promise<ChartData[]> {
    try {
      const response = await httpClient.get<ChartData[]>(
        this.endpoints.getHistoricalData(symbol, period)
      )
      return response.data
    } catch (error) {
      // Fallback to mock data
      if (config.isDevelopment) {
        console.warn(
          `API unavailable for ${symbol} historical data, using mock data:`,
          error
        )
        return generateChartData(30)
      }
      throw error
    }
  }

  /**
   * Get real-time quote for a stock
   */
  public async getQuote(symbol: string): Promise<StockQuote> {
    try {
      const response = await httpClient.get<StockQuote>(
        this.endpoints.getQuote(symbol)
      )
      return response.data
    } catch (error) {
      // Fallback to mock data
      if (config.isDevelopment) {
        console.warn(
          `API unavailable for ${symbol} quote, using mock data:`,
          error
        )
        const mockStock = mockStockData.find(stock => stock.symbol === symbol)
        if (mockStock) {
          return {
            symbol: mockStock.symbol,
            price: mockStock.price,
            change: mockStock.change,
            changePercent: mockStock.changePercent,
            timestamp: new Date().toISOString(),
          }
        }
      }
      throw error
    }
  }

  /**
   * Get multiple quotes at once
   */
  public async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      const promises = symbols.map(symbol => this.getQuote(symbol))
      return await Promise.all(promises)
    } catch (error) {
      console.error('Error fetching multiple quotes:', error)
      throw error
    }
  }

  /**
   * Get RPS data with filters
   */
  public async getRps(date: string, filter: RpsFilter): Promise<RpsItemData[]> {
    const response = await httpClient.get<ApiResponse<RpsItemData[]>>(
      this.endpoints.getRps(date, filter)
    )
    return response.data.data
  }
}

// Export singleton instance
export const stockApi = new StockApiService()
export default stockApi
