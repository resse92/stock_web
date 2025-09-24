import type { StockData, ChartData } from '@/types/stock';

export const mockStockData: StockData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 175.43,
    change: 2.34,
    changePercent: 1.35,
    volume: 52486789,
    marketCap: 2800000000000,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 138.21,
    change: -1.87,
    changePercent: -1.33,
    volume: 28976543,
    marketCap: 1750000000000,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.85,
    change: 4.23,
    changePercent: 1.13,
    volume: 35678901,
    marketCap: 2810000000000,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 248.87,
    change: -5.67,
    changePercent: -2.23,
    volume: 89456123,
    marketCap: 793000000000,
  },
];

export const generateChartData = (days: number = 30): ChartData[] => {
  const data: ChartData[] = [];
  const startPrice = 150;
  
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    
    const randomChange = (Math.random() - 0.5) * 10;
    const price = Math.max(50, startPrice + randomChange * (i + 1) * 0.1);
    const volume = Math.floor(Math.random() * 100000000) + 10000000;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
      volume,
    });
  }
  
  return data;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};

export const formatMarketCap = (value: number): string => {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  return `$${value.toLocaleString()}`;
};

export const formatVolume = (value: number): string => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(2)}K`;
  }
  return value.toLocaleString();
};