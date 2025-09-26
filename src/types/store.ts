import type { StockData, ChartData, StockQuote } from './stock';

// UI State Interface
export interface UIState {
  // Sidebar state
  isSidebarCollapsed: boolean;
  
  // Theme state
  theme: 'light' | 'dark' | 'system';
  
  // Loading states for different UI sections
  isLoading: {
    dashboard: boolean;
    stocks: boolean;
    charts: boolean;
  };
  
  // Modal and dialog states
  modals: {
    stockDetails: {
      isOpen: boolean;
      stockSymbol: string | null;
    };
    settings: {
      isOpen: boolean;
    };
  };
}

// Stock Data State Interface
export interface StockState {
  // Current stock data
  stocks: StockData[];
  
  // Individual stock cache for detailed views
  stockCache: Record<string, StockData>;
  
  // Historical chart data cache
  chartDataCache: Record<string, ChartData[]>;
  
  // Real-time quotes cache
  quotesCache: Record<string, StockQuote>;
  
  // Loading and error states
  loading: {
    stocks: boolean;
    individual: Record<string, boolean>;
    charts: Record<string, boolean>;  
    quotes: Record<string, boolean>;
  };
  
  error: {
    stocks: string | null;
    individual: Record<string, string | null>;
    charts: Record<string, string | null>;
    quotes: Record<string, string | null>;
  };
  
  // Last fetch timestamps for caching
  lastFetch: {
    stocks: number | null;
    individual: Record<string, number>;
    charts: Record<string, number>;
    quotes: Record<string, number>;
  };
}

// User Preferences State Interface
export interface UserState {
  // Watchlist
  watchlist: string[];
  
  // Portfolio (simplified for now)
  portfolio: {
    symbol: string;
    shares: number;
    avgPrice: number;
  }[];
  
  // User settings
  settings: {
    refreshInterval: number; // in milliseconds
    defaultChartPeriod: string;
    favoriteSymbols: string[];
    notifications: {
      priceAlerts: boolean;
      newsAlerts: boolean;
    };
  };
  
  // View preferences
  viewPreferences: {
    dashboardLayout: 'grid' | 'list';
    chartType: 'line' | 'candlestick';
    showVolume: boolean;
  };
}

// Combined Store State
export interface AppState {
  ui: UIState;
  stocks: StockState;
  user: UserState;
}

// Action interfaces for type safety
export interface UIActions {
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: UIState['theme']) => void;
  setLoading: (section: keyof UIState['isLoading'], loading: boolean) => void;
  openModal: (modal: keyof UIState['modals'], data?: any) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
}

export interface StockActions {
  // Stock data actions
  setStocks: (stocks: StockData[]) => void;
  addStock: (stock: StockData) => void;
  updateStock: (symbol: string, updates: Partial<StockData>) => void;
  
  // Cache management
  setStockInCache: (symbol: string, stock: StockData) => void;
  setChartDataInCache: (symbol: string, period: string, data: ChartData[]) => void;
  setQuoteInCache: (symbol: string, quote: StockQuote) => void;
  
  // Loading and error states
  setStocksLoading: (loading: boolean) => void;
  setIndividualLoading: (symbol: string, loading: boolean) => void;
  setChartLoading: (symbol: string, period: string, loading: boolean) => void;
  setQuoteLoading: (symbol: string, loading: boolean) => void;
  
  setStocksError: (error: string | null) => void;
  setIndividualError: (symbol: string, error: string | null) => void;
  setChartError: (symbol: string, period: string, error: string | null) => void;
  setQuoteError: (symbol: string, error: string | null) => void;
  
  // Cache invalidation
  invalidateStocksCache: () => void;
  invalidateStockCache: (symbol: string) => void;
  invalidateChartCache: (symbol: string, period?: string) => void;
  invalidateQuoteCache: (symbol: string) => void;
}

export interface UserActions {
  // Watchlist actions
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  setWatchlist: (symbols: string[]) => void;
  
  // Portfolio actions
  addToPortfolio: (symbol: string, shares: number, avgPrice: number) => void;
  updatePortfolioPosition: (symbol: string, shares: number, avgPrice: number) => void;
  removeFromPortfolio: (symbol: string) => void;
  
  // Settings actions
  updateSettings: (settings: Partial<UserState['settings']>) => void;
  updateViewPreferences: (preferences: Partial<UserState['viewPreferences']>) => void;
  
  // Favorites
  addToFavorites: (symbol: string) => void;
  removeFromFavorites: (symbol: string) => void;
}