import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { UserState, UserActions } from '@/types/store'

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

// User Store with actions
export interface UserStore extends UserState, UserActions {}

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialUserState,

        // Watchlist actions
        addToWatchlist: (symbol: string) => {
          set(
            (state) => ({
              watchlist: state.watchlist.includes(symbol)
                ? state.watchlist
                : [...state.watchlist, symbol],
            }),
            false,
            'user/addToWatchlist'
          )
        },

        removeFromWatchlist: (symbol: string) => {
          set(
            (state) => ({
              watchlist: state.watchlist.filter((s) => s !== symbol),
            }),
            false,
            'user/removeFromWatchlist'
          )
        },

        setWatchlist: (symbols: string[]) => {
          set({ watchlist: symbols }, false, 'user/setWatchlist')
        },

        // Portfolio actions
        addToPortfolio: (symbol: string, shares: number, avgPrice: number) => {
          set(
            (state) => {
              const existingIndex = state.portfolio.findIndex(
                (p) => p.symbol === symbol
              )
              if (existingIndex >= 0) {
                // Update existing position
                const newPortfolio = [...state.portfolio]
                const existing = newPortfolio[existingIndex]
                const totalShares = existing.shares + shares
                const newAvgPrice =
                  (existing.avgPrice * existing.shares + avgPrice * shares) /
                  totalShares

                newPortfolio[existingIndex] = {
                  symbol,
                  shares: totalShares,
                  avgPrice: newAvgPrice,
                }

                return { portfolio: newPortfolio }
              } else {
                // Add new position
                return {
                  portfolio: [...state.portfolio, { symbol, shares, avgPrice }],
                }
              }
            },
            false,
            'user/addToPortfolio'
          )
        },

        updatePortfolioPosition: (
          symbol: string,
          shares: number,
          avgPrice: number
        ) => {
          set(
            (state) => ({
              portfolio: state.portfolio.map((p) =>
                p.symbol === symbol ? { ...p, shares, avgPrice } : p
              ),
            }),
            false,
            'user/updatePortfolioPosition'
          )
        },

        removeFromPortfolio: (symbol: string) => {
          set(
            (state) => ({
              portfolio: state.portfolio.filter((p) => p.symbol !== symbol),
            }),
            false,
            'user/removeFromPortfolio'
          )
        },

        // Settings actions
        updateSettings: (settings: Partial<UserState['settings']>) => {
          set(
            (state) => ({
              settings: {
                ...state.settings,
                ...settings,
                notifications: {
                  ...state.settings.notifications,
                  ...(settings.notifications || {}),
                },
              },
            }),
            false,
            'user/updateSettings'
          )
        },

        updateViewPreferences: (
          preferences: Partial<UserState['viewPreferences']>
        ) => {
          set(
            (state) => ({
              viewPreferences: {
                ...state.viewPreferences,
                ...preferences,
              },
            }),
            false,
            'user/updateViewPreferences'
          )
        },

        // Favorites actions
        addToFavorites: (symbol: string) => {
          set(
            (state) => ({
              settings: {
                ...state.settings,
                favoriteSymbols: state.settings.favoriteSymbols.includes(symbol)
                  ? state.settings.favoriteSymbols
                  : [...state.settings.favoriteSymbols, symbol],
              },
            }),
            false,
            'user/addToFavorites'
          )
        },

        removeFromFavorites: (symbol: string) => {
          set(
            (state) => ({
              settings: {
                ...state.settings,
                favoriteSymbols: state.settings.favoriteSymbols.filter(
                  (s) => s !== symbol
                ),
              },
            }),
            false,
            'user/removeFromFavorites'
          )
        },
      }),
      {
        name: 'stock-web-user-store',
        // Persist all user data
      }
    ),
    {
      name: 'UserStore',
    }
  )
)

// Selector hooks for better performance
export const useWatchlist = () =>
  useUserStore(
    useShallow((state) => ({
      watchlist: state.watchlist,
      addToWatchlist: state.addToWatchlist,
      removeFromWatchlist: state.removeFromWatchlist,
      setWatchlist: state.setWatchlist,
    }))
  )

export const usePortfolio = () =>
  useUserStore(
    useShallow((state) => ({
      portfolio: state.portfolio,
      addToPortfolio: state.addToPortfolio,
      updatePortfolioPosition: state.updatePortfolioPosition,
      removeFromPortfolio: state.removeFromPortfolio,
    }))
  )

export const useUserSettings = () =>
  useUserStore(
    useShallow((state) => ({
      settings: state.settings,
      updateSettings: state.updateSettings,
    }))
  )

export const useViewPreferences = () =>
  useUserStore(
    useShallow((state) => ({
      viewPreferences: state.viewPreferences,
      updateViewPreferences: state.updateViewPreferences,
    }))
  )

export const useFavorites = () =>
  useUserStore(
    useShallow((state) => ({
      favoriteSymbols: state.settings.favoriteSymbols,
      addToFavorites: state.addToFavorites,
      removeFromFavorites: state.removeFromFavorites,
    }))
  )
