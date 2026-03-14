export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function gainLossColor(value: number): string {
  if (value > 0) return 'text-green-600';
  if (value < 0) return 'text-red-600';
  return 'text-gray-600';
}

export function gainLossBg(value: number): string {
  if (value > 0) return 'bg-green-100 text-green-800';
  if (value < 0) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
}
