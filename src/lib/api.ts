import type { RpsItemData, RpsResp } from '@/types/stock'
import type { StockApiEndpoints, RpsFilter } from '@/types/api'
import { httpClient } from './http-client'

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
   * Get RPS data with filters
   */
  public async getRps(date: string, filter: RpsFilter): Promise<RpsItemData[]> {
    const response = await httpClient.get<RpsResp>(
      this.endpoints.getRps(date, filter)
    )

    return response.data?.items || []
  }
}

// Export singleton instance
export const stockApi = new StockApiService()
export default stockApi
