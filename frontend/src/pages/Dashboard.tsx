import React from 'react';
import { useStocks, useAlerts } from '../hooks/useStocks';
import { formatCurrency, formatPercent, gainLossColor } from '../utils/format';
import Card from '../components/Card';
import AlertBanner from '../components/AlertBanner';
import ErrorMessage from '../components/ErrorMessage';
import { CardSkeleton, ChartSkeleton } from '../components/LoadingSkeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function Dashboard() {
  const { data: stocks, isLoading, error } = useStocks();
  const { data: alerts = [] } = useAlerts();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  if (error) return <ErrorMessage message="Failed to load dashboard data." />;
  if (!stocks) return null;

  const totalValue = stocks.reduce((sum, s) => sum + s.marketValue, 0);
  const totalCost = stocks.reduce((sum, s) => sum + s.quantity * s.averageBuyPrice, 0);
  const totalGainLoss = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;

  // Simulated portfolio value over time using cumulative cost basis
  const sortedStocks = [...stocks].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  let cumValue = 0;
  const lineData = sortedStocks.map((s, i) => {
    cumValue += s.marketValue;
    return { name: s.ticker, value: cumValue, index: i + 1 };
  });

  // Pie chart data
  const pieData = stocks.map((s) => ({
    name: s.ticker,
    value: parseFloat(((s.marketValue / totalValue) * 100).toFixed(2)),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {alerts.length > 0 && <AlertBanner alerts={alerts} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Portfolio Value" value={formatCurrency(totalValue)} />
        <Card
          title="Total Gain/Loss"
          value={formatPercent(totalGainLoss)}
          color={gainLossColor(totalGainLoss)}
        />
        <Card title="Holdings" value={String(stocks.length)} />
        <Card
          title="Active Alerts"
          value={String(alerts.length)}
          color={alerts.length > 0 ? 'text-red-600' : 'text-gray-900'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">Cumulative Portfolio Value</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-4">Portfolio Allocation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
