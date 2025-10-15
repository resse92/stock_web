import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useSidebarState } from '@/stores'

// Create a context that uses Zustand under the hood but maintains the same API
interface SidebarContextType {
  isCollapsed: boolean
  toggleSidebar: () => void
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

/**
 * Provider that bridges the old Context API with the new Zustand store
 * This maintains backward compatibility while using Zustand internally
 */
export const SidebarProviderZustand = ({
  children,
}: {
  children: ReactNode
}) => {
  const { isCollapsed, toggleSidebar, setCollapsed } = useSidebarState()

  const contextValue: SidebarContextType = {
    isCollapsed,
    toggleSidebar,
    setCollapsed,
  }

  return (
    <SidebarContext.Provider value={contextValue}>
      {children}
    </SidebarContext.Provider>
  )
}

/**
 * Hook that maintains the same API as the original useSidebar hook
 * This allows existing components to work without changes
 */
export const useSidebarZustand = () => {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error(
      'useSidebarZustand must be used within a SidebarProviderZustand'
    )
  }
  return context
}

// Also export the direct Zustand hook for new components that want to use it directly
export { useSidebarState } from '@/stores'
