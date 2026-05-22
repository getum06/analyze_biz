import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value, compact = false) {
  if (compact) {
    if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function formatPct(value) {
  return `${parseFloat(value).toFixed(1)}%`;
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function getScoreColor(score) {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 65) return 'text-blue-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

export function getScoreBg(score) {
  if (score >= 80) return 'bg-emerald-50 border-emerald-200';
  if (score >= 65) return 'bg-blue-50 border-blue-200';
  if (score >= 50) return 'bg-amber-50 border-amber-200';
  return 'bg-red-50 border-red-200';
}

export function getScoreBarColor(score) {
  if (score >= 80) return '#10b981';
  if (score >= 65) return '#3b82f6';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}
