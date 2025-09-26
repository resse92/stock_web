import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { UIState, UIActions } from '@/types/store';

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
};

// UI Store with actions
export interface UIStore extends UIState, UIActions {}

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialUIState,

        // Sidebar actions
        toggleSidebar: () => {
          set(
            (state) => ({
              isSidebarCollapsed: !state.isSidebarCollapsed,
            }),
            false,
            'ui/toggleSidebar'
          );
        },

        setSidebarCollapsed: (collapsed: boolean) => {
          set(
            { isSidebarCollapsed: collapsed },
            false,
            'ui/setSidebarCollapsed'
          );
        },

        // Theme actions
        setTheme: (theme: UIState['theme']) => {
          set({ theme }, false, 'ui/setTheme');
        },

        // Loading actions
        setLoading: (section: keyof UIState['isLoading'], loading: boolean) => {
          set(
            (state) => ({
              isLoading: {
                ...state.isLoading,
                [section]: loading,
              },
            }),
            false,
            `ui/setLoading/${section}`
          );
        },

        // Modal actions
        openModal: (modal: keyof UIState['modals'], data?: any) => {
          set(
            (state) => ({
              modals: {
                ...state.modals,
                [modal]: {
                  isOpen: true,
                  ...(data || {}),
                },
              },
            }),
            false,
            `ui/openModal/${modal}`
          );
        },

        closeModal: (modal: keyof UIState['modals']) => {
          set(
            (state) => ({
              modals: {
                ...state.modals,
                [modal]: {
                  ...state.modals[modal],
                  isOpen: false,
                },
              },
            }),
            false,
            `ui/closeModal/${modal}`
          );
        },
      }),
      {
        name: 'stock-web-ui-store',
        // Only persist certain UI state (not loading states or modals)
        partialize: (state) => ({
          isSidebarCollapsed: state.isSidebarCollapsed,
          theme: state.theme,
        }),
      }
    ),
    {
      name: 'UIStore',
    }
  )
);

// Selector hooks for better performance
export const useSidebarState = () => useUIStore((state) => ({
  isCollapsed: state.isSidebarCollapsed,
  toggleSidebar: state.toggleSidebar,
  setCollapsed: state.setSidebarCollapsed,
}));

export const useThemeState = () => useUIStore((state) => ({
  theme: state.theme,
  setTheme: state.setTheme,
}));

export const useLoadingState = () => useUIStore((state) => ({
  isLoading: state.isLoading,
  setLoading: state.setLoading,
}));

export const useModalState = () => useUIStore((state) => ({
  modals: state.modals,
  openModal: state.openModal,
  closeModal: state.closeModal,
}));