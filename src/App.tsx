import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SidebarProviderZustand } from '@/contexts/SidebarContextZustand'
import { Dashboard } from '@/components/Dashboard'
import { RPSPage } from '@/components/rps/Page'
import { StockDashboardAdvanced } from '@/components/StockDashboardAdvanced'
import { NotFound } from '@/components/NotFound'
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <SidebarProviderZustand>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tanstack" element={<RPSPage />} />
          <Route path="/advanced" element={<StockDashboardAdvanced />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </SidebarProviderZustand>
  )
}

export default App
