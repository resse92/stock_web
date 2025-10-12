import type { StockData, ChartData, StockQuote, RPSData, RPSFilters } from '@/types/stock';
import type { StockApiEndpoints } from '@/types/api';
import { httpClient } from './http-client';
import { mockStockData, generateChartData } from '@/utils/mockData';
import { config } from './config';

/**
 * Stock API Service
 * Provides methods for fetching stock data from the API with fallback to mock data
 */
class StockApiService {
  private endpoints: StockApiEndpoints = {
    getStocks: () => '/api/stocks',
    getStock: (symbol: string) => `/api/stocks/${symbol}`,
    getHistoricalData: (symbol: string, period = '1M') => `/api/stocks/${symbol}/historical?period=${period}`,
    getQuote: (symbol: string) => `/api/stocks/${symbol}/quote`,
    getRPS: (filters?: Record<string, any>) => {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, String(value));
          }
        });
      }
      const queryString = queryParams.toString();
      return `/api/rps${queryString ? `?${queryString}` : ''}`;
    },
  };

  /**
   * Get all stocks
   */
  public async getStocks(): Promise<StockData[]> {
    try {
      const response = await httpClient.get<StockData[]>(this.endpoints.getStocks());
      return response.data;
    } catch (error) {
      // Fallback to mock data in development or when API is unavailable
      if (config.isDevelopment) {
        console.warn('API unavailable, using mock data:', error);
        return mockStockData;
      }
      throw error;
    }
  }

  /**
   * Get single stock by symbol
   */
  public async getStock(symbol: string): Promise<StockData> {
    try {
      const response = await httpClient.get<StockData>(this.endpoints.getStock(symbol));
      return response.data;
    } catch (error) {
      // Fallback to mock data
      if (config.isDevelopment) {
        console.warn(`API unavailable for ${symbol}, using mock data:`, error);
        const mockStock = mockStockData.find(stock => stock.symbol === symbol);
        if (mockStock) {
          return mockStock;
        }
      }
      throw error;
    }
  }

  /**
   * Get historical data for a stock
   */
  public async getHistoricalData(symbol: string, period = '1M'): Promise<ChartData[]> {
    try {
      const response = await httpClient.get<ChartData[]>(
        this.endpoints.getHistoricalData(symbol, period)
      );
      return response.data;
    } catch (error) {
      // Fallback to mock data
      if (config.isDevelopment) {
        console.warn(`API unavailable for ${symbol} historical data, using mock data:`, error);
        return generateChartData(30);
      }
      throw error;
    }
  }

  /**
   * Get real-time quote for a stock
   */
  public async getQuote(symbol: string): Promise<StockQuote> {
    try {
      const response = await httpClient.get<StockQuote>(this.endpoints.getQuote(symbol));
      return response.data;
    } catch (error) {
      // Fallback to mock data
      if (config.isDevelopment) {
        console.warn(`API unavailable for ${symbol} quote, using mock data:`, error);
        const mockStock = mockStockData.find(stock => stock.symbol === symbol);
        if (mockStock) {
          return {
            symbol: mockStock.symbol,
            price: mockStock.price,
            change: mockStock.change,
            changePercent: mockStock.changePercent,
            timestamp: new Date().toISOString(),
          };
        }
      }
      throw error;
    }
  }

  /**
   * Get multiple quotes at once
   */
  public async getMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    try {
      const promises = symbols.map(symbol => this.getQuote(symbol));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching multiple quotes:', error);
      throw error;
    }
  }

  /**
   * Get RPS (Relative Price Strength) data with optional filters
   */
  public async getRPS(filters?: RPSFilters): Promise<RPSData[]> {
    try {
      const response = await httpClient.get<RPSData[]>(this.endpoints.getRPS(filters));
      return response.data;
    } catch (error) {
      // Fallback to mock data in development
      if (config.isDevelopment) {
        console.warn('API unavailable for RPS data, using mock data:', error);
        return this.generateMockRPSData(filters);
      }
      throw error;
    }
  }

  /**
   * Generate mock RPS data for development
   */
  private generateMockRPSData(filters?: RPSFilters): RPSData[] {
    const mockData: RPSData[] = mockStockData.map((stock) => ({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.price,
      rps: 50 + Math.random() * 50, // RPS between 50-100
      rps_50: 40 + Math.random() * 60, // RPS 50-day
      rps_120: 45 + Math.random() * 55, // RPS 120-day
      rps_250: 50 + Math.random() * 50, // RPS 250-day
      change: stock.change,
      changePercent: stock.changePercent,
      volume: stock.volume,
      marketCap: stock.marketCap,
    }));

    // Apply filters
    let filteredData = mockData;

    if (filters?.minRPS) {
      filteredData = filteredData.filter(d => d.rps >= filters.minRPS!);
    }
    if (filters?.maxRPS) {
      filteredData = filteredData.filter(d => d.rps <= filters.maxRPS!);
    }
    if (filters?.minPrice) {
      filteredData = filteredData.filter(d => d.price >= filters.minPrice!);
    }
    if (filters?.maxPrice) {
      filteredData = filteredData.filter(d => d.price <= filters.maxPrice!);
    }
    if (filters?.minVolume) {
      filteredData = filteredData.filter(d => d.volume >= filters.minVolume!);
    }

    // Apply sorting
    if (filters?.sortBy) {
      const sortBy = filters.sortBy;
      const sortOrder = filters.sortOrder || 'desc';
      filteredData.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
    }

    return filteredData;
  }
}

// Export singleton instance
export const stockApi = new StockApiService();
export default stockApi;