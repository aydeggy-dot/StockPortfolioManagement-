import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStock, useUpdateStock, useDeleteStock, useUpdatePrice } from '../hooks/useStocks';
import { formatCurrency, formatPercent, gainLossColor } from '../utils/format';
import ErrorMessage from '../components/ErrorMessage';
import { CardSkeleton } from '../components/LoadingSkeleton';
import Modal from '../components/Modal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stockSchema = z.object({
  ticker: z.string().min(1, 'Ticker is required').transform((v) => v.toUpperCase()),
  companyName: z.string().min(1, 'Company name is required'),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  averageBuyPrice: z.coerce.number().positive('Average buy price must be positive'),
  currentPrice: z.coerce.number().positive('Current price must be positive'),
  alertThreshold: z.coerce.number().positive('Alert threshold must be positive').nullable().optional(),
});

type StockFormValues = z.infer<typeof stockSchema>;

export default function StockDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const stockId = Number(id);
  const { data: stock, isLoading, error } = useStock(stockId);
  const updateStock = useUpdateStock();
  const deleteStock = useDeleteStock();
  const updatePrice = useUpdatePrice();

  const [showDelete, setShowDelete] = useState(false);
  const [quickPrice, setQuickPrice] = useState('');
  const [priceHistory, setPriceHistory] = useState<{ time: string; price: number }[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema),
    values: stock
      ? {
          ticker: stock.ticker,
          companyName: stock.companyName,
          quantity: stock.quantity,
          averageBuyPrice: stock.averageBuyPrice,
          currentPrice: stock.currentPrice,
          alertThreshold: stock.alertThreshold,
        }
      : undefined,
  });

  const onSubmit = (data: StockFormValues) => {
    updateStock.mutate(
      { id: stockId, data: { ...data, alertThreshold: data.alertThreshold || null } },
      {
        onSuccess: () => navigate('/portfolio'),
      }
    );
  };

  const handleQuickPrice = () => {
    const price = parseFloat(quickPrice);
    if (isNaN(price) || price <= 0) return;
    updatePrice.mutate(
      { id: stockId, data: { currentPrice: price } },
      {
        onSuccess: () => {
          setPriceHistory((prev) => [
            ...prev,
            { time: new Date().toLocaleTimeString(), price },
          ]);
          setQuickPrice('');
        },
      }
    );
  };

  const handleDelete = () => {
    deleteStock.mutate(stockId, {
      onSuccess: () => navigate('/portfolio'),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (error || !stock) return <ErrorMessage message="Stock not found." />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{stock.ticker}</h1>
          <p className="text-gray-500">{stock.companyName}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{formatCurrency(stock.currentPrice)}</p>
          <p className={`text-sm font-medium ${gainLossColor(stock.gainLossPercent)}`}>
            {formatPercent(stock.gainLossPercent)}
          </p>
        </div>
      </div>

      {/* Quick Price Update */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">Quick Price Update</h2>
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            value={quickPrice}
            onChange={(e) => setQuickPrice(e.target.value)}
            placeholder="New price..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleQuickPrice}
            disabled={updatePrice.isPending}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {updatePrice.isPending ? 'Updating...' : 'Update Price'}
          </button>
        </div>
      </div>

      {/* Price History Chart */}
      {priceHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">Session Price History</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={priceHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-500">Edit Stock</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ticker</label>
            <input
              {...register('ticker')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
            />
            {errors.ticker && <p className="text-red-600 text-xs mt-1">{errors.ticker.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <input
              {...register('companyName')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.companyName && <p className="text-red-600 text-xs mt-1">{errors.companyName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input type="number" step="any" {...register('quantity')} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.quantity && <p className="text-red-600 text-xs mt-1">{errors.quantity.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avg Buy Price ($)</label>
            <input type="number" step="any" {...register('averageBuyPrice')} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.averageBuyPrice && <p className="text-red-600 text-xs mt-1">{errors.averageBuyPrice.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Price ($)</label>
            <input type="number" step="any" {...register('currentPrice')} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            {errors.currentPrice && <p className="text-red-600 text-xs mt-1">{errors.currentPrice.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alert Threshold ($)</label>
            <input type="number" step="any" {...register('alertThreshold')} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Optional" />
          </div>
        </div>

        {updateStock.error && (
          <p className="text-red-600 text-sm">
            {(updateStock.error as any)?.response?.data?.message || 'Failed to update stock.'}
          </p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={updateStock.isPending}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {updateStock.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => navigate('/portfolio')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Back
          </button>
        </div>
      </form>

      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Stock"
        message={`Are you sure you want to delete ${stock.ticker}? This cannot be undone.`}
      />
    </div>
  );
}
