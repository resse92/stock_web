import { Link, useLocation } from 'react-router-dom';
import Button from '@/components/ui/button';
import { useSidebarZustand } from '@/contexts/SidebarContextZustand';
import { Home, BarChart3, User, Settings, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

export const Header = () => {
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebarZustand();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/advanced', label: 'Advanced Dashboard', icon: BarChart3 },
    { path: '/rps', label: 'RPS 排名', icon: TrendingUp },
    { path: '/tanstack', label: 'TanStack Demo', icon: BarChart3 },
    { path: '/portfolio', label: 'Portfolio', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];
  
  return (
    <aside className={`fixed left-0 top-0 h-full bg-background border-r border-border z-50 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo and Toggle Button */}
        <div className={`p-6 border-b border-border flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <Link to="/" className="text-2xl font-bold text-primary">
              StockWeb
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="p-2 hover:bg-muted"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors group ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium whitespace-nowrap">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* User Actions */}
        {!isCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                Sign In
              </Button>
              <Button size="sm" className="w-full">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
