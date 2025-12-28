import type { CSSProperties } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { Sidebar } from '@/components/Sidebar'
import { Dashboard } from '@/components/Dashboard'
import { RPSPage } from '@/components/rps/Page'
import { ConceptsPage } from '@/components/concepts/ConceptsPage'
import { NotFound } from '@/components/NotFound'
import { WebResearchPage } from '@/components/deepseek/WebResearchPage'
import { ExternalNavPage } from '@/components/external-nav/ExternalNavPage'
import {
  SidebarProvider as UISidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar'
import { useSidebar } from '@/components/ui/sidebar-context'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'

const AppLayout = () => {
  const { state } = useSidebar()
  const collapsed = state === 'collapsed'

  return (
    <>
      <Sidebar />
      <SidebarInset
        style={
          {
            '--inset-offset': collapsed
              ? 'var(--sidebar-width-icon)'
              : 'var(--sidebar-width)',
          } as CSSProperties
        }
        className={cn(
          'min-h-svh bg-background transition-[margin] duration-300 ease-in-out',
          'md:ml-(--inset-offset)'
        )}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rps" element={<RPSPage />} />
          <Route path="/concepts" element={<ConceptsPage />} />
          <Route path="/external-nav" element={<ExternalNavPage />} />
          <Route path="/web-research" element={<WebResearchPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </SidebarInset>
    </>
  )
}

function App() {
  return (
    <Router>
      <UISidebarProvider>
        <AppLayout />
      </UISidebarProvider>
    </Router>
  )
}

export default App
