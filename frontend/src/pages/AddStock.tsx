import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateStock } from '../hooks/useStocks';

const stockSchema = z.object({
  ticker: z.string().min(1, 'Ticker is required').transform((v) => v.toUpperCase()),
  companyName: z.string().min(1, 'Company name is required'),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  averageBuyPrice: z.coerce.number().positive('Average buy price must be positive'),
  currentPrice: z.coerce.number().positive('Current price must be positive'),
  alertThreshold: z.coerce.number().positive('Alert threshold must be positive').nullable().optional(),
});

type StockFormValues = z.infer<typeof stockSchema>;

export default function AddStock() {
  const navigate = useNavigate();
  const createStock = useCreateStock();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: { alertThreshold: null },
  });

  const onSubmit = (data: StockFormValues) => {
    createStock.mutate(
      {
        ...data,
        alertThreshold: data.alertThreshold || null,
      },
      {
        onSuccess: () => navigate('/portfolio'),
      }
    );
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Add Stock</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ticker</label>
          <input
            {...register('ticker')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            placeholder="e.g. AAPL"
          />
          {errors.ticker && <p className="text-red-600 text-xs mt-1">{errors.ticker.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            {...register('companyName')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Apple Inc."
          />
          {errors.companyName && <p className="text-red-600 text-xs mt-1">{errors.companyName.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              step="any"
              {...register('quantity')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.quantity && <p className="text-red-600 text-xs mt-1">{errors.quantity.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avg Buy Price ($)</label>
            <input
              type="number"
              step="any"
              {...register('averageBuyPrice')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.averageBuyPrice && <p className="text-red-600 text-xs mt-1">{errors.averageBuyPrice.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Price ($)</label>
            <input
              type="number"
              step="any"
              {...register('currentPrice')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.currentPrice && <p className="text-red-600 text-xs mt-1">{errors.currentPrice.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alert Threshold ($)</label>
            <input
              type="number"
              step="any"
              {...register('alertThreshold')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional"
            />
            {errors.alertThreshold && <p className="text-red-600 text-xs mt-1">{errors.alertThreshold.message}</p>}
          </div>
        </div>

        {createStock.error && (
          <p className="text-red-600 text-sm">
            {(createStock.error as any)?.response?.data?.message || 'Failed to create stock.'}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={createStock.isPending}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {createStock.isPending ? 'Adding...' : 'Add Stock'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/portfolio')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
