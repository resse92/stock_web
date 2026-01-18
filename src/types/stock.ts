export interface RpsResp {
  items: RpsItemData[]
  count: number
}

export interface RpsItemData {
  code: string
  name: string
  concept?: string
  concepts?: string[]
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

export interface CapitalFlowData {
  date: string
  sec_code: string
  name?: string
  change_pct: number
  net_amount_main: number
  net_pct_main: number
  net_amount_xl: number
  net_pct_xl: number
  net_amount_l: number
  net_pct_l: number
  net_amount_m: number
  net_pct_m: number
  net_amount_s: number
  net_pct_s: number
}
