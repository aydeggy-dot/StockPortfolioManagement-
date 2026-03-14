export interface Stock {
  id: number;
  ticker: string;
  companyName: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  alertThreshold: number | null;
  marketValue: number;
  gainLossPercent: number;
  alertActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockFormData {
  ticker: string;
  companyName: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  alertThreshold?: number | null;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export interface PriceUpdate {
  currentPrice: number;
}
