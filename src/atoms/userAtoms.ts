import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { UserState } from '@/types/store'

// Initial user state
const initialUserState: UserState = {
  watchlist: [],
  portfolio: [],
  settings: {
    refreshInterval: 30000, // 30 seconds
    defaultChartPeriod: '1M',
    favoriteSymbols: [],
    notifications: {
      priceAlerts: true,
      newsAlerts: false,
    },
  },
  viewPreferences: {
    dashboardLayout: 'grid',
    chartType: 'line',
    showVolume: true,
  },
}

// Persistent atoms (using localStorage)
export const watchlistAtom = atomWithStorage<string[]>(
  'stock-web-watchlist',
  initialUserState.watchlist
)

export const portfolioAtom = atomWithStorage<UserState['portfolio']>(
  'stock-web-portfolio',
  initialUserState.portfolio
)

export const userSettingsAtom = atomWithStorage<UserState['settings']>(
  'stock-web-user-settings',
  initialUserState.settings
)

export const viewPreferencesAtom = atomWithStorage<UserState['viewPreferences']>(
  'stock-web-view-preferences',
  initialUserState.viewPreferences
)

// Action atoms - Watchlist
export const addToWatchlistAtom = atom(
  null,
  (get, set, symbol: string) => {
    const current = get(watchlistAtom)
    if (!current.includes(symbol)) {
      set(watchlistAtom, [...current, symbol])
    }
  }
)

export const removeFromWatchlistAtom = atom(
  null,
  (get, set, symbol: string) => {
    set(watchlistAtom, get(watchlistAtom).filter((s) => s !== symbol))
  }
)

export const setWatchlistAtom = atom(
  null,
  (_get, set, symbols: string[]) => {
    set(watchlistAtom, symbols)
  }
)

// Action atoms - Portfolio
export const addToPortfolioAtom = atom(
  null,
  (get, set, symbol: string, shares: number, avgPrice: number) => {
    const current = get(portfolioAtom)
    const existingIndex = current.findIndex((p) => p.symbol === symbol)

    if (existingIndex >= 0) {
      // Update existing position
      const existing = current[existingIndex]
      const totalShares = existing.shares + shares
      const newAvgPrice =
        (existing.avgPrice * existing.shares + avgPrice * shares) / totalShares

      const newPortfolio = [...current]
      newPortfolio[existingIndex] = {
        symbol,
        shares: totalShares,
        avgPrice: newAvgPrice,
      }
      set(portfolioAtom, newPortfolio)
    } else {
      // Add new position
      set(portfolioAtom, [...current, { symbol, shares, avgPrice }])
    }
  }
)

export const updatePortfolioPositionAtom = atom(
  null,
  (get, set, symbol: string, shares: number, avgPrice: number) => {
    set(
      portfolioAtom,
      get(portfolioAtom).map((p) =>
        p.symbol === symbol ? { ...p, shares, avgPrice } : p
      )
    )
  }
)

export const removeFromPortfolioAtom = atom(
  null,
  (get, set, symbol: string) => {
    set(portfolioAtom, get(portfolioAtom).filter((p) => p.symbol !== symbol))
  }
)

// Action atoms - Settings
export const updateSettingsAtom = atom(
  null,
  (get, set, settings: Partial<UserState['settings']>) => {
    const current = get(userSettingsAtom)
    set(userSettingsAtom, {
      ...current,
      ...settings,
      notifications: {
        ...current.notifications,
        ...(settings.notifications || {}),
      },
    })
  }
)

export const updateViewPreferencesAtom = atom(
  null,
  (get, set, preferences: Partial<UserState['viewPreferences']>) => {
    set(viewPreferencesAtom, {
      ...get(viewPreferencesAtom),
      ...preferences,
    })
  }
)

// Action atoms - Favorites
export const addToFavoritesAtom = atom(
  null,
  (get, set, symbol: string) => {
    const current = get(userSettingsAtom)
    if (!current.favoriteSymbols.includes(symbol)) {
      set(userSettingsAtom, {
        ...current,
        favoriteSymbols: [...current.favoriteSymbols, symbol],
      })
    }
  }
)

export const removeFromFavoritesAtom = atom(
  null,
  (get, set, symbol: string) => {
    const current = get(userSettingsAtom)
    set(userSettingsAtom, {
      ...current,
      favoriteSymbols: current.favoriteSymbols.filter((s) => s !== symbol),
    })
  }
)

// Combined user state atom (for compatibility)
export const userStateAtom = atom((get) => ({
  watchlist: get(watchlistAtom),
  portfolio: get(portfolioAtom),
  settings: get(userSettingsAtom),
  viewPreferences: get(viewPreferencesAtom),
}))
