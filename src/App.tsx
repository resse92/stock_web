import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { Dashboard } from '@/components/Dashboard'
import { TanStackPage } from '@/components/TanStackPage'

function App() {
  return (
    <SidebarProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tanstack" element={<TanStackPage />} />
        </Routes>
      </Router>
    </SidebarProvider>
  )
}

export default App
