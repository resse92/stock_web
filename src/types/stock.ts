export interface RpsResp {
  items: RpsItemData[]
  count: number
}

export interface RpsItemData {
  code: string
  name: string
  rps3: number
  rps5: number
  rps15: number
  rps30: number
  listed_days: number
  market_cap: number
  circulating_market_cap: number
}

export interface ChartData {
  date: string
  price: number
  volume: number
}

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  timestamp: string
}

export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
}
