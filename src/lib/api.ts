import type { StockData, ChartData, StockQuote } from '@/types/stock'
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
    getRps: (date: string, filter: RpsFilter) =>
      `/api/v1/joinquant/rps?date=${date}&rps3=(${filter.rps3.min},${filter.rps3.max})&rps5=(${filter.rps5.min},${filter.rps5.max})&rps15=(${filter.rps15.min},${filter.rps15.max})&rps30=(${filter.rps30.min},${filter.rps30.max})&marketCap=${filter.marketCap}&listingDays=${filter.listingDays}`,
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
        const mockStock = mockStockData.find((stock) => stock.symbol === symbol)
        if (mockStock) {
          return mockStock
        }
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
        const mockStock = mockStockData.find((stock) => stock.symbol === symbol)
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
      const promises = symbols.map((symbol) => this.getQuote(symbol))
      return await Promise.all(promises)
    } catch (error) {
      console.error('Error fetching multiple quotes:', error)
      throw error
    }
  }

  /**
   * Get RPS data with filters
   */
  public async getRps(date: string, filter: RpsFilter): Promise<StockData[]> {
    const response = await httpClient.get<StockData[]>(
      this.endpoints.getRps(date, filter)
    )
    return response.data
  }
}

// Export singleton instance
export const stockApi = new StockApiService()
export default stockApi
