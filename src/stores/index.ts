import { useAtomValue, useSetAtom } from 'jotai'
import {
  sidebarCollapsedAtom,
  toggleSidebarAtom,
  setSidebarCollapsedAtom,
  themeAtom,
  setThemeAtom,
  loadingAtom,
  setLoadingAtom,
  modalsAtom,
  openModalAtom,
  closeModalAtom,
} from '@/atoms/uiAtoms'
import {
  watchlistAtom,
  addToWatchlistAtom,
  removeFromWatchlistAtom,
  setWatchlistAtom,
  portfolioAtom,
  addToPortfolioAtom,
  updatePortfolioPositionAtom,
  removeFromPortfolioAtom,
  userSettingsAtom,
  updateSettingsAtom,
  viewPreferencesAtom,
  updateViewPreferencesAtom,
  addToFavoritesAtom,
  removeFromFavoritesAtom,
} from '@/atoms/userAtoms'
import {
  stocksAtom,
  setStocksAtom,
  setStocksLoadingAtom,
  setStocksErrorAtom,
  stockCacheAtom,
  setStockInCacheAtom,
  stockLoadingAtom,
  stockErrorAtom,
  setIndividualLoadingAtom,
  setIndividualErrorAtom,
  chartDataCacheAtom,
  setChartDataInCacheAtom,
  setChartLoadingAtom,
  setChartErrorAtom,
  quotesCacheAtom,
  setQuoteInCacheAtom,
  setQuoteLoadingAtom,
  setQuoteErrorAtom,
} from '@/atoms/stockAtoms'

// UI Store Hooks
export const useSidebarState = () => {
  const isCollapsed = useAtomValue(sidebarCollapsedAtom)
  const toggleSidebar = useSetAtom(toggleSidebarAtom)
  const setSidebarCollapsed = useSetAtom(setSidebarCollapsedAtom)

  return {
    isCollapsed,
    toggleSidebar,
    setCollapsed: setSidebarCollapsed,
  }
}

export const useThemeState = () => {
  const theme = useAtomValue(themeAtom)
  const setTheme = useSetAtom(setThemeAtom)

  return {
    theme,
    setTheme,
  }
}

export const useLoadingState = () => {
  const isLoading = useAtomValue(loadingAtom)
  const setLoading = useSetAtom(setLoadingAtom)

  return {
    isLoading,
    setLoading,
  }
}

export const useModalState = () => {
  const modals = useAtomValue(modalsAtom)
  const openModal = useSetAtom(openModalAtom)
  const closeModal = useSetAtom(closeModalAtom)

  return {
    modals,
    openModal,
    closeModal,
  }
}

// User Store Hooks
export const useWatchlist = () => {
  const watchlist = useAtomValue(watchlistAtom)
  const addToWatchlist = useSetAtom(addToWatchlistAtom)
  const removeFromWatchlist = useSetAtom(removeFromWatchlistAtom)
  const setWatchlist = useSetAtom(setWatchlistAtom)

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    setWatchlist,
  }
}

export const usePortfolio = () => {
  const portfolio = useAtomValue(portfolioAtom)
  const addToPortfolio = useSetAtom(addToPortfolioAtom)
  const updatePortfolioPosition = useSetAtom(updatePortfolioPositionAtom)
  const removeFromPortfolio = useSetAtom(removeFromPortfolioAtom)

  return {
    portfolio,
    addToPortfolio,
    updatePortfolioPosition,
    removeFromPortfolio,
  }
}

export const useUserSettings = () => {
  const settings = useAtomValue(userSettingsAtom)
  const updateSettings = useSetAtom(updateSettingsAtom)

  return {
    settings,
    updateSettings,
  }
}

export const useViewPreferences = () => {
  const viewPreferences = useAtomValue(viewPreferencesAtom)
  const updateViewPreferences = useSetAtom(updateViewPreferencesAtom)

  return {
    viewPreferences,
    updateViewPreferences,
  }
}

export const useFavorites = () => {
  const settings = useAtomValue(userSettingsAtom)
  const addToFavorites = useSetAtom(addToFavoritesAtom)
  const removeFromFavorites = useSetAtom(removeFromFavoritesAtom)

  return {
    favoriteSymbols: settings.favoriteSymbols,
    addToFavorites,
    removeFromFavorites,
  }
}

// Stock Store Hooks
export const useStocksData = () => {
  const stocks = useAtomValue(stocksAtom)
  const loading = useAtomValue(stockLoadingAtom)
  const error = useAtomValue(stockErrorAtom)
  const setStocks = useSetAtom(setStocksAtom)
  const setStocksLoading = useSetAtom(setStocksLoadingAtom)
  const setStocksError = useSetAtom(setStocksErrorAtom)

  return {
    stocks,
    loading: loading.stocks,
    error: error.stocks,
    setStocks,
    setStocksLoading,
    setStocksError,
  }
}

export const useStockCache = () => {
  const stockCache = useAtomValue(stockCacheAtom)
  const loading = useAtomValue(stockLoadingAtom)
  const error = useAtomValue(stockErrorAtom)
  const setStockInCache = useSetAtom(setStockInCacheAtom)
  const setIndividualLoading = useSetAtom(setIndividualLoadingAtom)
  const setIndividualError = useSetAtom(setIndividualErrorAtom)

  return {
    stockCache,
    setStockInCache,
    loading: loading.individual,
    error: error.individual,
    setIndividualLoading,
    setIndividualError,
  }
}

export const useChartCache = () => {
  const chartDataCache = useAtomValue(chartDataCacheAtom)
  const loading = useAtomValue(stockLoadingAtom)
  const error = useAtomValue(stockErrorAtom)
  const setChartDataInCache = useSetAtom(setChartDataInCacheAtom)
  const setChartLoading = useSetAtom(setChartLoadingAtom)
  const setChartError = useSetAtom(setChartErrorAtom)

  return {
    chartDataCache,
    setChartDataInCache,
    loading: loading.charts,
    error: error.charts,
    setChartLoading,
    setChartError,
  }
}

export const useQuoteCache = () => {
  const quotesCache = useAtomValue(quotesCacheAtom)
  const loading = useAtomValue(stockLoadingAtom)
  const error = useAtomValue(stockErrorAtom)
  const setQuoteInCache = useSetAtom(setQuoteInCacheAtom)
  const setQuoteLoading = useSetAtom(setQuoteLoadingAtom)
  const setQuoteError = useSetAtom(setQuoteErrorAtom)

  return {
    quotesCache,
    setQuoteInCache,
    loading: loading.quotes,
    error: error.quotes,
    setQuoteLoading,
    setQuoteError,
  }
}

// Re-export types for convenience
export type * from '@/types/store'