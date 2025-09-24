import type { StockData } from '@/types/stock';

// Generate a large dataset for TanStack Table + React Virtual demo
export const generateLargeStockDataset = (count: number = 1000): StockData[] => {
  const stockSymbols = [
    'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'NVDA', 'META', 'NFLX',
    'AMD', 'INTC', 'CRM', 'ORCL', 'ADBE', 'PYPL', 'SHOP', 'SQ',
    'TWTR', 'UBER', 'LYFT', 'ZOOM', 'SPOT', 'ROKU', 'SNAP', 'PIN',
    'BA', 'GE', 'F', 'GM', 'COST', 'WMT', 'TGT', 'HD', 'LOW',
    'JNJ', 'PFE', 'UNH', 'CVS', 'WBA', 'MRK', 'ABBV', 'GILD',
    'JPM', 'BAC', 'WFC', 'GS', 'MS', 'C', 'AXP', 'V', 'MA',
    'KO', 'PEP', 'MCD', 'SBUX', 'NKE', 'DIS', 'T', 'VZ',
  ];

  const companyNames = [
    'Apple Inc.', 'Alphabet Inc.', 'Microsoft Corporation', 'Tesla, Inc.',
    'Amazon.com Inc.', 'NVIDIA Corporation', 'Meta Platforms Inc.', 'Netflix Inc.',
    'Advanced Micro Devices Inc.', 'Intel Corporation', 'Salesforce Inc.', 'Oracle Corporation',
    'Adobe Inc.', 'PayPal Holdings Inc.', 'Shopify Inc.', 'Block Inc.',
    'Twitter Inc.', 'Uber Technologies Inc.', 'Lyft Inc.', 'Zoom Video Communications Inc.',
    'Spotify Technology S.A.', 'Roku Inc.', 'Snap Inc.', 'Pinterest Inc.',
    'Boeing Company', 'General Electric Company', 'Ford Motor Company', 'General Motors Company',
    'Costco Wholesale Corporation', 'Walmart Inc.', 'Target Corporation', 'Home Depot Inc.',
    'Lowe\'s Companies Inc.', 'Johnson & Johnson', 'Pfizer Inc.', 'UnitedHealth Group Inc.',
    'CVS Health Corporation', 'Walgreens Boots Alliance Inc.', 'Merck & Co. Inc.', 'AbbVie Inc.',
    'Gilead Sciences Inc.', 'JPMorgan Chase & Co.', 'Bank of America Corporation', 'Wells Fargo & Company',
    'Goldman Sachs Group Inc.', 'Morgan Stanley', 'Citigroup Inc.', 'American Express Company',
    'Visa Inc.', 'Mastercard Inc.', 'Coca-Cola Company', 'PepsiCo Inc.',
    'McDonald\'s Corporation', 'Starbucks Corporation', 'Nike Inc.', 'Walt Disney Company',
    'AT&T Inc.', 'Verizon Communications Inc.'
  ];

  const data: StockData[] = [];

  for (let i = 0; i < count; i++) {
    const symbolIndex = i % stockSymbols.length;
    const symbol = stockSymbols[symbolIndex];
    const name = companyNames[symbolIndex] || `Company ${i + 1}`;
    
    // Generate realistic price data
    const basePrice = Math.random() * 500 + 10; // $10 - $510
    const changePercent = (Math.random() - 0.5) * 10; // -5% to +5%
    const change = (basePrice * changePercent) / 100;
    const price = basePrice + change;
    
    // Generate realistic volume and market cap
    const volume = Math.floor(Math.random() * 100000000) + 1000000; // 1M - 100M
    const sharesOutstanding = Math.floor(Math.random() * 10000000000) + 100000000; // 100M - 10B shares
    const marketCap = price * sharesOutstanding;

    data.push({
      symbol: i > stockSymbols.length - 1 ? `${symbol}${Math.floor(i / stockSymbols.length)}` : symbol,
      name,
      price: Math.round(price * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      volume,
      marketCap: Math.round(marketCap),
    });
  }

  return data;
};