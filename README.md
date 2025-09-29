# StockWeb - React 股票仪表板

一个现代化、响应式的股票仪表板，使用 React、TypeScript、Tailwind CSS、shadcn/ui、Recharts 和 Zustand 构建。

## 🚀 快速开始

### 环境要求
- Node.js 18+ 和 pnpm
- 现代浏览器

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd stock_web
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   pnpm dev
   ```

4. **在浏览器中打开**
   访问 `http://localhost:5173`

### 生产构建
```bash
pnpm build
pnpm preview  # 本地预览生产构建
```

## 🏗️ 基础架构

### 技术栈架构
```
React 19 (前端框架)
├── TypeScript (类型安全)
├── Vite (构建工具)
├── Tailwind CSS (样式框架)
└── ESLint (代码规范)
```

### 状态管理架构
```
Zustand (状态管理)
├── React Hooks (状态集成)
├── localStorage (持久化)
└── Redux DevTools (调试)
```

### UI 组件架构
```
shadcn/ui (组件库)
├── Radix UI (底层组件原语)
├── Lucide React (图标库)
├── class-variance-authority (样式变体)
├── clsx (条件样式)
└── tailwind-merge (样式合并)
```

### 数据流架构
```
HTTP Client → API Service → Zustand Store → React Components
     ↓              ↓            ↓              ↓
  Mock Data    Error Handling   Caching      UI Updates
```

## 📚 使用教程

### 1. Zustand 状态管理

#### 基础用法
```tsx
import { useSidebarState, useThemeState } from '@/stores';

function MyComponent() {
  const { isCollapsed, toggleSidebar } = useSidebarState();
  const { theme, setTheme } = useThemeState();
  
  return (
    <div>
      <button onClick={toggleSidebar}>
        {isCollapsed ? '展开' : '收起'} 侧边栏
      </button>
      <button onClick={() => setTheme('dark')}>
        切换到深色主题
      </button>
    </div>
  );
}
```

#### 股票数据管理
```tsx
import { useStockDataWithStore, useChartDataWithStore } from '@/hooks/useStockDataWithStore';

function StockComponent() {
  const { stocks, loading, error, refetch } = useStockDataWithStore();
  const { chartData, loading: chartLoading } = useChartDataWithStore('AAPL', '1M');
  
  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  
  return (
    <div>
      <button onClick={() => refetch()}>刷新数据</button>
      {stocks.map(stock => (
        <div key={stock.symbol}>
          {stock.symbol}: ${stock.price}
        </div>
      ))}
    </div>
  );
}
```

#### 用户偏好管理
```tsx
import { useWatchlist, usePortfolio, useUserSettings } from '@/stores';

function UserPreferencesComponent() {
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { portfolio, addToPortfolio } = usePortfolio();
  const { settings, updateSettings } = useUserSettings();
  
  return (
    <div>
      <h3>关注列表 ({watchlist.length})</h3>
      {watchlist.map(symbol => (
        <div key={symbol}>
          {symbol}
          <button onClick={() => removeFromWatchlist(symbol)}>移除</button>
        </div>
      ))}
      
      <button onClick={() => addToWatchlist('MSFT')}>
        添加 MSFT
      </button>
      
      <button onClick={() => updateSettings({ refreshInterval: 60000 })}>
        设置 1 分钟刷新
      </button>
    </div>
  );
}
```

### 2. API 集成

#### 环境配置
创建 `.env` 文件：
```env
# API 配置
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

# WebSocket 配置
VITE_WS_URL=ws://localhost:3000/ws

# 环境设置
VITE_APP_ENV=development
```

#### HTTP 客户端使用
```typescript
import { httpClient } from '@/lib/http-client';

// GET 请求
const response = await httpClient.get<StockData[]>('/api/stocks');

// POST 请求
const response = await httpClient.post<StockData>('/api/stocks', data);
```

#### API 服务层使用
```typescript
import { stockApi } from '@/lib/api';

// 获取所有股票（自动回退到模拟数据）
const stocks = await stockApi.getStocks();

// 获取单个股票
const stock = await stockApi.getStock('AAPL');

// 获取历史数据
const chartData = await stockApi.getHistoricalData('AAPL', '1M');
```

### 3. 组件开发

#### 创建新组件
```tsx
// src/components/MyComponent.tsx
interface MyComponentProps {
  data: StockData;
  onAction?: (id: string) => void;
  className?: string;
}

export const MyComponent = ({ data, onAction, className }: MyComponentProps) => {
  return (
    <div className={className}>
      {/* 组件内容 */}
    </div>
  );
};
```

#### 使用 shadcn/ui 组件
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const StockCard = ({ stock }: { stock: StockData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{stock.symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>${stock.price}</p>
        <Button onClick={() => console.log('点击')}>
          查看详情
        </Button>
      </CardContent>
    </Card>
  );
};
```

### 4. 图表可视化

#### 基础图表
```tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const StockChart = ({ data }: { data: ChartData[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

### 5. 主题定制

#### CSS 变量定制
```css
/* src/index.css */
:root {
  --primary: 221.2 83.2% 53.3%;
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
}

.dark {
  --primary: 217.2 91.2% 59.8%;
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

#### 主题切换
```tsx
import { useThemeState } from '@/stores';

export const ThemeToggle = () => {
  const { theme, setTheme } = useThemeState();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      切换主题
    </button>
  );
};
```

## 🔄 状态管理策略

### 全局状态 (Zustand) 使用场景
- ✅ **用户偏好和设置**: 主题、布局、刷新间隔
- ✅ **缓存的 API 数据**: 股票数据、图表、报价
- ✅ **跨组件 UI 状态**: 侧边栏状态、模态框
- ✅ **持久化数据**: 关注列表、投资组合、收藏

### 局部状态 (React useState) 使用场景
- ✅ **表单输入**: 输入字段值、验证状态
- ✅ **组件特定 UI**: 悬停状态、下拉选择
- ✅ **临时数据**: 搜索查询、分页状态
- ✅ **动画状态**: 过渡效果、加载动画

### 混合使用示例
```tsx
const StockCard = ({ stock }) => {
  // 局部状态 - 组件特定 UI
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // 全局状态 - 用户操作
  const { addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { addToFavorites, favoriteSymbols } = useFavorites();
  
  const isFavorite = favoriteSymbols.includes(stock.symbol);
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 组件渲染... */}
    </div>
  );
};
```

## 🛠️ 开发工具

### 可用脚本
- `pnpm dev` - 启动开发服务器
- `pnpm build` - 生产构建
- `pnpm preview` - 预览生产构建
- `pnpm lint` - 运行 ESLint

### 调试工具
- **Redux DevTools**: Zustand 集成了 Redux DevTools 用于状态调试
- **TypeScript**: 完整的类型检查和 IntelliSense
- **ESLint**: 代码质量检查

## 🚀 部署指南

### Netlify/Vercel 部署
1. 连接仓库到平台
2. 设置构建命令: `pnpm build`
3. 设置发布目录: `dist`

### 手动部署
1. 运行 `pnpm build`
2. 将 `dist/` 文件夹上传到 Web 服务器

### 环境变量配置
生产环境需要设置：
```env
VITE_API_BASE_URL=https://your-api.com
VITE_API_TIMEOUT=10000
VITE_APP_ENV=production
```

## 🔍 最佳实践

### 状态管理最佳实践
1. **使用浅层相等比较**: 对于返回对象的 Zustand 选择器钩子
2. **避免不稳定引用**: 在 useEffect 依赖数组中
3. **记忆化返回值**: 自定义钩子中包含对象时
4. **分离关注点**: useEffect 钩子中不要混合数据获取和间隔

### 性能优化
1. **选择性订阅**: 使用有针对性的选择器防止不必要的重新渲染
2. **代码分割**: 使用 React.lazy 进行路由级代码分割
3. **记忆化**: 对昂贵的计算使用 useMemo 和 useCallback

### 类型安全
1. **定义完整的 TypeScript 接口**
2. **对所有存储操作使用严格类型**
3. **为外部数据实现运行时类型验证**

## 🐛 故障排除

### 常见问题
1. **无限循环错误**: 检查 useEffect 依赖数组中的不稳定引用
2. **状态不更新**: 确保使用浅层相等比较的选择器
3. **性能问题**: 检查不必要的重新渲染，使用 React DevTools

### 调试技巧
- 使用 Redux DevTools 检查状态变化
- 使用 React DevTools Profiler 分析性能
- 检查控制台中的 TypeScript 错误

---
