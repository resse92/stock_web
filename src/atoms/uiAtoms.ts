import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import type { UIState } from '@/types/store'

// Initial UI state
const initialUIState: UIState = {
  isSidebarCollapsed: false,
  theme: 'system',
  isLoading: {
    dashboard: false,
    stocks: false,
    charts: false,
  },
  modals: {
    stockDetails: {
      isOpen: false,
      stockSymbol: null,
    },
    settings: {
      isOpen: false,
    },
  },
}

// Persistent atoms (using localStorage)
export const sidebarCollapsedAtom = atomWithStorage(
  'stock-web-sidebar-collapsed',
  initialUIState.isSidebarCollapsed
)

export const themeAtom = atomWithStorage<UIState['theme']>(
  'stock-web-theme',
  initialUIState.theme
)

// Non-persistent atoms (session state)
export const loadingAtom = atom<UIState['isLoading']>(initialUIState.isLoading)

export const modalsAtom = atom<UIState['modals']>(initialUIState.modals)

// Derived/action atoms
export const toggleSidebarAtom = atom(
  null,
  (get, set) => {
    set(sidebarCollapsedAtom, !get(sidebarCollapsedAtom))
  }
)

export const setSidebarCollapsedAtom = atom(
  null,
  (_get, set, collapsed: boolean) => {
    set(sidebarCollapsedAtom, collapsed)
  }
)

export const setThemeAtom = atom(
  null,
  (_get, set, theme: UIState['theme']) => {
    set(themeAtom, theme)
  }
)

export const setLoadingAtom = atom(
  null,
  (get, set, section: keyof UIState['isLoading'], loading: boolean) => {
    set(loadingAtom, {
      ...get(loadingAtom),
      [section]: loading,
    })
  }
)

export const openModalAtom = atom(
  null,
  (get, set, modal: keyof UIState['modals'], data?: any) => {
    set(modalsAtom, {
      ...get(modalsAtom),
      [modal]: {
        isOpen: true,
        ...(data || {}),
      },
    })
  }
)

export const closeModalAtom = atom(
  null,
  (get, set, modal: keyof UIState['modals']) => {
    set(modalsAtom, {
      ...get(modalsAtom),
      [modal]: {
        ...get(modalsAtom)[modal],
        isOpen: false,
      },
    })
  }
)

// Combined UI state atom (for compatibility)
export const uiStateAtom = atom((get) => ({
  isSidebarCollapsed: get(sidebarCollapsedAtom),
  theme: get(themeAtom),
  isLoading: get(loadingAtom),
  modals: get(modalsAtom),
}))
