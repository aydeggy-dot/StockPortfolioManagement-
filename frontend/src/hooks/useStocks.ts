import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as stockApi from '../api/stockApi';
import { StockFormData, PriceUpdate } from '../types/stock';

export function useStocks() {
  return useQuery({
    queryKey: ['stocks'],
    queryFn: stockApi.getAllStocks,
    refetchInterval: 30000,
  });
}

export function useStock(id: number) {
  return useQuery({
    queryKey: ['stocks', id],
    queryFn: () => stockApi.getStockById(id),
    refetchInterval: 30000,
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: stockApi.getAlerts,
    refetchInterval: 30000,
  });
}

export function useSearchStocks(query: string) {
  return useQuery({
    queryKey: ['stocks', 'search', query],
    queryFn: () => stockApi.searchStocks(query),
    enabled: query.length > 0,
  });
}

export function useCreateStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StockFormData) => stockApi.createStock(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: StockFormData }) =>
      stockApi.updateStock(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useDeleteStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => stockApi.deleteStock(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}

export function useUpdatePrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PriceUpdate }) =>
      stockApi.updatePrice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stocks'] });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
}
