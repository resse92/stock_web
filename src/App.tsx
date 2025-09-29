import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SidebarProviderZustand } from '@/contexts/SidebarContextZustand'
import { Dashboard } from '@/components/Dashboard'
import { TanStackPage } from '@/components/TanStackPage'
import { StockDashboardAdvanced } from '@/components/StockDashboardAdvanced'
import { NotFound } from '@/components/NotFound'

function App() {
  return (
    <SidebarProviderZustand>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tanstack" element={<TanStackPage />} />
          <Route path="/advanced" element={<StockDashboardAdvanced />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </SidebarProviderZustand>
  )
}

export default App
