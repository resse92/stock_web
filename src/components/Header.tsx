import Button from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-primary">StockWeb</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Portfolio
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              Watchlist
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
              News
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
          <Button size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};