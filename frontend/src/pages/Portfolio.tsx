import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStocks, useSearchStocks, useDeleteStock } from '../hooks/useStocks';
import { formatCurrency, formatPercent, gainLossColor, gainLossBg } from '../utils/format';
import Modal from '../components/Modal';
import ErrorMessage from '../components/ErrorMessage';
import { TableSkeleton } from '../components/LoadingSkeleton';

export default function Portfolio() {
  const navigate = useNavigate();
  const { data: allStocks, isLoading, error } = useStocks();
  const [searchQuery, setSearchQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const { data: searchResults } = useSearchStocks(submittedQuery);
  const deleteStock = useDeleteStock();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const stocks = submittedQuery ? searchResults : allStocks;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery.trim());
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      deleteStock.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (error) return <ErrorMessage message="Failed to load portfolio." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value === '') setSubmittedQuery('');
            }}
            placeholder="Search ticker or company..."
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-500">Ticker</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Company</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Qty</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Avg Buy</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Current</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Market Value</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Gain/Loss</th>
              <th className="text-center px-4 py-3 font-medium text-gray-500">Alert</th>
              <th className="text-center px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks && stocks.length > 0 ? (
              stocks.map((stock) => (
                <tr
                  key={stock.id}
                  onClick={() => navigate(`/stock/${stock.id}`)}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-3 font-semibold text-gray-900">{stock.ticker}</td>
                  <td className="px-4 py-3 text-gray-600">{stock.companyName}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{stock.quantity}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(stock.averageBuyPrice)}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{formatCurrency(stock.currentPrice)}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">{formatCurrency(stock.marketValue)}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${gainLossBg(stock.gainLossPercent)}`}>
                      {formatPercent(stock.gainLossPercent)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {stock.alertActive && (
                      <span className="inline-block w-2 h-2 bg-red-500 rounded-full" title="Price alert active" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteId(stock.id);
                      }}
                      className="text-red-600 hover:text-red-800 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-400">
                  {submittedQuery ? 'No stocks match your search.' : 'No stocks in portfolio.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Stock"
        message="Are you sure you want to remove this stock from your portfolio? This action cannot be undone."
      />
    </div>
  );
}
