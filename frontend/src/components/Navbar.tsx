import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAlerts } from '../hooks/useStocks';
import { formatCurrency } from '../utils/format';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1' },
  { to: '/portfolio', label: 'Portfolio', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { to: '/add', label: 'Add Stock', icon: 'M12 4v16m8-8H4' },
];

export default function Navbar() {
  const location = useLocation();
  const { data: alerts = [] } = useAlerts();
  const [showAlerts, setShowAlerts] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-900">StockPortfolio</h1>
          <p className="text-xs text-gray-500">Portfolio Manager</p>
        </div>

        <div className="space-y-1 flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              {link.label}
            </Link>
          ))}
        </div>

        {/* Alert bell */}
        <div className="relative mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 w-full"
          >
            <div className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </div>
            Alerts
          </button>

          {showAlerts && alerts.length > 0 && (
            <div className="absolute bottom-full left-0 mb-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 p-3 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Active Alerts</p>
              {alerts.map((alert) => (
                <Link
                  key={alert.id}
                  to={`/stock/${alert.id}`}
                  onClick={() => setShowAlerts(false)}
                  className="block p-2 rounded-lg hover:bg-red-50 text-sm"
                >
                  <span className="font-semibold text-red-700">{alert.ticker}</span>
                  <span className="text-gray-500"> — {formatCurrency(alert.currentPrice)}</span>
                  <span className="text-gray-400 text-xs block">
                    Below {formatCurrency(alert.alertThreshold!)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around py-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium ${
                location.pathname === link.to ? 'text-blue-700' : 'text-gray-500'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              {link.label}
            </Link>
          ))}
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium text-gray-500"
          >
            <div className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {alerts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {alerts.length}
                </span>
              )}
            </div>
            Alerts
          </button>
        </div>

        {showAlerts && alerts.length > 0 && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-xl shadow-lg border border-gray-200 p-3 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase">Active Alerts</p>
            {alerts.map((alert) => (
              <Link
                key={alert.id}
                to={`/stock/${alert.id}`}
                onClick={() => setShowAlerts(false)}
                className="block p-2 rounded-lg hover:bg-red-50 text-sm"
              >
                <span className="font-semibold text-red-700">{alert.ticker}</span>
                <span className="text-gray-500"> — {formatCurrency(alert.currentPrice)}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
