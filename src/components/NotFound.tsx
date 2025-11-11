import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'
import Button from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* 404 Header */}
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              页面未找到
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md">
              抱歉，您访问的页面不存在或已被移除。
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  返回首页
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  回到主页面查看股票数据和市场概览
                </p>
                <Button asChild className="w-full">
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    回到首页
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  浏览功能
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  探索我们的其他功能和页面
                </p>
                <div className="space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/advanced">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      高级仪表板
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/tanstack">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      TanStack 演示
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Navigation */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4">快速导航</h3>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button asChild variant="ghost" size="sm">
                <Link to="/">Dashboard</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/advanced">Advanced</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/tanstack">TanStack</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/test">Test</Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link to="/test-comprehensive">Comprehensive Test</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
