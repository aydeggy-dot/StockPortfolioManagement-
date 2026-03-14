import React from 'react';
import { Stock } from '../types/stock';
import { formatCurrency } from '../utils/format';

interface AlertBannerProps {
  alerts: Stock[];
}

export default function AlertBanner({ alerts }: AlertBannerProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className="text-sm font-semibold text-red-800">Price Alerts</h3>
      </div>
      <ul className="space-y-1">
        {alerts.map((stock) => (
          <li key={stock.id} className="text-sm text-red-700">
            <span className="font-medium">{stock.ticker}</span> is at{' '}
            {formatCurrency(stock.currentPrice)} (below threshold{' '}
            {formatCurrency(stock.alertThreshold!)})
          </li>
        ))}
      </ul>
    </div>
  );
}
