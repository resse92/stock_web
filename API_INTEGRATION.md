# API Integration Guide

This document explains how to use the unified HTTP request management architecture implemented in the StockWeb application.

## Environment Configuration

### 1. Setup Environment Variables

Copy the example environment file and configure your API settings:

```bash
cp .env.example .env
```

Edit `.env` with your API configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000

# WebSocket Configuration (for future real-time features)
VITE_WS_URL=ws://localhost:3000/ws

# Environment
VITE_APP_ENV=development
```

### 2. Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for API requests | `http://localhost:3000` |
| `VITE_API_TIMEOUT` | Request timeout in milliseconds | `10000` |
| `VITE_WS_URL` | WebSocket URL for real-time updates | `ws://localhost:3000/ws` |
| `VITE_APP_ENV` | Application environment | `development` |

## Architecture Overview

### HTTP Client (`src/lib/http-client.ts`)

The unified HTTP client provides:
- Centralized error handling
- Request/response interceptors
- Timeout management
- Automatic JSON parsing
- Type-safe responses

```typescript
import { httpClient } from '@/lib/http-client';

// GET request
const response = await httpClient.get<StockData[]>('/api/stocks');

// POST request
const response = await httpClient.post<StockData>('/api/stocks', data);
```

### API Service Layer (`src/lib/api.ts`)

The stock API service provides:
- Fallback to mock data when API is unavailable
- Type-safe methods for stock operations
- Error handling with graceful degradation

```typescript
import { stockApi } from '@/lib/api';

// Get all stocks (with fallback to mock data)
const stocks = await stockApi.getStocks();

// Get single stock
const stock = await stockApi.getStock('AAPL');

// Get historical data
const chartData = await stockApi.getHistoricalData('AAPL', '1M');
```

### Custom Hooks (`src/hooks/useStockData.ts`)

React hooks for data management:

```typescript
import { useStockData, useStock, useChartData } from '@/hooks/useStockData';

// In your component
const { stocks, loading, error, refetch } = useStockData();
const { stock } = useStock('AAPL');
const { chartData } = useChartData('AAPL', '1M');
```

## API Endpoints Expected

The HTTP client expects the following API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks` | Get all stocks |
| GET | `/api/stocks/{symbol}` | Get single stock |
| GET | `/api/stocks/{symbol}/historical?period={period}` | Get historical data |
| GET | `/api/stocks/{symbol}/quote` | Get real-time quote |

### Response Format

All API responses should follow this format:

```typescript
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}
```

## Error Handling

The system provides graceful error handling:

1. **Network Errors**: Falls back to mock data in development
2. **API Errors**: Displays user-friendly error messages
3. **Timeout Errors**: Configurable timeout with retry capability

## Mode Detection

The application automatically detects:
- **API Mode**: When API is available and responding
- **Demo Mode**: When using mock data fallback

This is visually indicated in the UI with status badges.

## Development vs Production

### Development Mode
- API errors fallback to mock data
- Console warnings for debugging
- Extended timeout periods

### Production Mode
- Strict error handling
- No fallback to mock data (configurable)
- Production-optimized timeouts

## Usage Examples

### Basic Usage in Components

```typescript
import { useStockData } from '@/hooks/useStockData';

export const MyComponent = () => {
  const { stocks, loading, error, refetch } = useStockData();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {stocks.map(stock => (
        <StockCard key={stock.symbol} stock={stock} />
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
};
```

### Direct API Usage

```typescript
import { stockApi } from '@/lib/api';

const fetchStockData = async () => {
  try {
    const stocks = await stockApi.getStocks();
    console.log('Stocks:', stocks);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Testing

The architecture supports both API and mock data modes, making it easy to:
- Test with real API data
- Develop with mock data when API is unavailable
- Switch between modes based on environment configuration

## Future Enhancements

The architecture is designed to support:
- WebSocket real-time updates
- Request caching
- Authentication headers
- Rate limiting
- Request/response logging