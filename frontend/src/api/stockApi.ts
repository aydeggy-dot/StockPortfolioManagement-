import api from './axios';
import { ApiResponse, Stock, StockFormData, PriceUpdate } from '../types/stock';

export const getAllStocks = async (): Promise<Stock[]> => {
  const { data } = await api.get<ApiResponse<Stock[]>>('/stocks');
  return data.data;
};

export const getStockById = async (id: number): Promise<Stock> => {
  const { data } = await api.get<ApiResponse<Stock>>(`/stocks/${id}`);
  return data.data;
};

export const createStock = async (stock: StockFormData): Promise<Stock> => {
  const { data } = await api.post<ApiResponse<Stock>>('/stocks', stock);
  return data.data;
};

export const updateStock = async (id: number, stock: StockFormData): Promise<Stock> => {
  const { data } = await api.put<ApiResponse<Stock>>(`/stocks/${id}`, stock);
  return data.data;
};

export const deleteStock = async (id: number): Promise<void> => {
  await api.delete(`/stocks/${id}`);
};

export const searchStocks = async (query: string): Promise<Stock[]> => {
  const { data } = await api.get<ApiResponse<Stock[]>>('/stocks/search', { params: { q: query } });
  return data.data;
};

export const getAlerts = async (): Promise<Stock[]> => {
  const { data } = await api.get<ApiResponse<Stock[]>>('/stocks/alerts');
  return data.data;
};

export const updatePrice = async (id: number, price: PriceUpdate): Promise<Stock> => {
  const { data } = await api.patch<ApiResponse<Stock>>(`/stocks/${id}/price`, price);
  return data.data;
};
