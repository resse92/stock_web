import React from 'react'
import { RPSTable } from './Table'
import { Header } from '../Header'
import { useSidebarZustand } from '@/contexts/SidebarContextZustand'
import RPSFilters, { type RPSFilterValues } from './RPSFilters'

export const RPSPage: React.FC = () => {
  const { isCollapsed } = useSidebarZustand()

  const handleFiltersChange = (filters: RPSFilterValues) => {
    console.log('筛选条件变化:', filters)
    // 这里可以添加筛选逻辑，比如传递给表格组件
  }

  return (
    <div className="h-screen overflow-hidden bg-background">
      <Header />

      {/* Main content with dynamic left margin for sidebar */}
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        } h-full overflow-hidden`}
      >
        <main className="container mx-auto px-4 py-4 h-full flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-3xl font-bold tracking-tight">RPS</h2>

            <RPSFilters onFiltersChange={handleFiltersChange} />
          </div>

          <div className="w-full flex-1 min-h-0">
            <RPSTable />
          </div>
        </main>
      </div>
    </div>
  )
}
