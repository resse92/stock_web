// HTTP Client Types
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

export interface HttpClientConfig {
  baseURL: string;
  timeout: number;
  headers?: Record<string, string>;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  signal?: AbortSignal;
}

// Stock API Endpoints
export interface StockApiEndpoints {
  getStocks: () => string;
  getStock: (symbol: string) => string;
  getHistoricalData: (symbol: string, period?: string) => string;
  getQuote: (symbol: string) => string;
}

// Environment Configuration
export interface AppConfig {
  apiBaseUrl: string;
  wsUrl: string;
  apiTimeout: number;
  environment: string;
}