export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface ChartData {
  date: string;
  price: number;
  volume: number;
}

export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface RPSData {
  symbol: string;
  name: string;
  price: number;
  rps: number;
  rps_50: number;
  rps_120: number;
  rps_250: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
}

export interface RPSFilters {
  minRPS?: number;
  maxRPS?: number;
  minPrice?: number;
  maxPrice?: number;
  minVolume?: number;
  sector?: string;
  sortBy?: 'rps' | 'rps_50' | 'rps_120' | 'rps_250' | 'price' | 'volume';
  sortOrder?: 'asc' | 'desc';
}