import { Link, useLocation } from 'react-router-dom'
import { Home, Crown, Globe2, ChevronLeft, ChevronRight } from 'lucide-react'

import Button from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { useSidebar } from '@/components/ui/sidebar-context'

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/tanstack', label: 'RPS', icon: Crown },
  { path: '/web-research', label: '网页调研', icon: Globe2 },
]

const CollapseButton = () => {
  const { state, toggleSidebar } = useSidebar()
  const collapsed = state === 'collapsed'

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-center gap-2 hover:bg-muted"
      onClick={toggleSidebar}
    >
      {collapsed ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
      {!collapsed && <span>收起侧边栏</span>}
    </Button>
  )
}

export const Sidebar = () => {
  const location = useLocation()
  const { state } = useSidebar()
  const collapsed = state === 'collapsed'

  return (
    <>
      <ShadcnSidebar
        variant="sidebar"
        collapsible="icon"
        className=" border-r border-border shadow-sm"
      >
        <SidebarHeader className="border-b border-border">
          <Link
            to="/"
            className={`flex items-center gap-3 px-2 py-3 transition-opacity ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <img
              src="/logo.svg"
              alt="StockWeb Logo"
              className="w-10 shrink-0 rounded-md bg-primary/10 p-2 aspect-square object-contain"
              style={{ aspectRatio: '1 / 1' }}
            />
            {!collapsed && (
              <div className="leading-tight">
                <p className="text-xl font-semibold text-primary">Dashboard</p>
              </div>
            )}
          </Link>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <SidebarGroup>
            {/*<SidebarGroupLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
              导航
            </SidebarGroupLabel>*/}
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map(item => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path

                  return (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={collapsed ? item.label : undefined}
                        className={cn(
                          'px-4 py-3 text-sm font-medium transition-colors',
                          'rounded-lg',
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                      >
                        <Link to={item.path}>
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarSeparator />

        <SidebarFooter className="border-t border-border">
          <CollapseButton />
        </SidebarFooter>
      </ShadcnSidebar>
      <SidebarRail />
    </>
  )
}
