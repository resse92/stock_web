import React from 'react'
import { TanStackTableDemo } from './TanStackTableDemo'
import { Header } from './Header'
import { useSidebarZustand } from '@/contexts/SidebarContextZustand'

export const TanStackPage: React.FC = () => {
  const { isCollapsed } = useSidebarZustand()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main content with dynamic left margin for sidebar */}
      <div
        className={`transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                TanStack Table Demo
              </h2>
              <p className="text-muted-foreground">
                高性能虚拟化表格演示，支持大量数据渲染
              </p>
            </div>
          </div>

          <div className="w-full">
            <TanStackTableDemo />
          </div>

          {/* <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>
              TanStack Table 与 React Virtual 结合，实现高性能的大数据表格渲染
            </p>
          </footer> */}
        </main>
      </div>
    </div>
  )
}
