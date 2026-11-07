// Formatting helpers for the ERP system
import type { RelativeDeadline } from '../types'

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString?: string | null, format: 'short' | 'full' | 'medium' = 'medium'): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return dateString

  if (format === 'short') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  if (format === 'full') {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function getRelativeDeadline(dueDateString?: string | null): RelativeDeadline {
  if (!dueDateString) return { label: 'No date', isOverdue: false, isUrgent: false, days: 0 }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDateString)
  due.setHours(0, 0, 0, 0)

  const diffTime = due.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays)
    return {
      label: `${overdueDays}d overdue`,
      isOverdue: true,
      isUrgent: true,
      days: diffDays,
      badgeColor: 'rose',
    }
  }
  if (diffDays === 0) {
    return {
      label: 'Due today',
      isOverdue: false,
      isUrgent: true,
      days: 0,
      badgeColor: 'amber',
    }
  }
  if (diffDays === 1) {
    return {
      label: 'Due tomorrow',
      isOverdue: false,
      isUrgent: true,
      days: 1,
      badgeColor: 'amber',
    }
  }
  if (diffDays <= 3) {
    return {
      label: `In ${diffDays} days`,
      isOverdue: false,
      isUrgent: true,
      days: diffDays,
      badgeColor: 'sky',
    }
  }
  return {
    label: `In ${diffDays} days`,
    isOverdue: false,
    isUrgent: false,
    days: diffDays,
    badgeColor: 'slate',
  }
}

export interface StatusBadgeConfig {
  label: string
  bg: string
  text: string
  border: string
  dot?: string
}

// Softer, relaxing status pill configurations
export const STATUS_CONFIG: Record<string, StatusBadgeConfig> = {
  // Task statuses
  todo: { label: 'To Do', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
  in_progress: { label: 'In Progress', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200/80', dot: 'bg-sky-500' },
  in_review: { label: 'In Review', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200/80', dot: 'bg-purple-500' },
  completed: { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/80', dot: 'bg-emerald-500' },
  blocked: { label: 'Blocked', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/80', dot: 'bg-rose-500' },

  // Project statuses
  active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/80', dot: 'bg-emerald-500' },
  planning: { label: 'Planning', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/80', dot: 'bg-amber-500' },

  // Priority
  urgent: { label: 'Urgent', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/80' },
  high: { label: 'High', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/80' },
  medium: { label: 'Medium', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200/80' },
  low: { label: 'Low', bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200' },
}

export function getStatusBadge(statusKey: string): StatusBadgeConfig {
  return STATUS_CONFIG[statusKey] || {
    label: statusKey,
    bg: 'bg-slate-100',
    text: 'text-slate-600',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  }
}

