import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SidebarProviderZustand } from '@/contexts/SidebarContextZustand'
import { Dashboard } from '@/components/Dashboard'
import { TanStackPage } from '@/components/TanStackPage'
import { StockDashboardAdvanced } from '@/components/StockDashboardAdvanced'

function App() {
  return (
    <SidebarProviderZustand>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tanstack" element={<TanStackPage />} />
          <Route path="/advanced" element={<StockDashboardAdvanced />} />
        </Routes>
      </Router>
    </SidebarProviderZustand>
  )
}

export default App
