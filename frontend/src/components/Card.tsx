import React from 'react';

interface CardProps {
  title: string;
  value: string;
  subtitle?: string;
  color?: string;
}

export default function Card({ title, value, subtitle, color = 'text-gray-900' }: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}
