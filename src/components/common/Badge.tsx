import type { ReactNode } from 'react'

export type BadgeVariant =
  'sky' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'purple' | 'lime' | 'slate' | string

const VARIANT_MAP: Record<string, string> = {
  sky: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200/70 dark:border-sky-800/60',
  emerald:
    'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/70 dark:border-emerald-800/60',
  amber:
    'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/70 dark:border-amber-800/60',
  rose: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/70 dark:border-rose-800/60',
  indigo:
    'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200/70 dark:border-indigo-800/60',
  purple:
    'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/70 dark:border-purple-800/60',
  lime: 'bg-[#d9f99d]/70 dark:bg-lime-950/40 text-[#1a2e05] dark:text-lime-300 border-[#bef264] dark:border-lime-800/60',
  slate:
    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
}

export interface BadgeProps {
  children?: ReactNode
  variant?: BadgeVariant
  size?: 'xs' | 'sm'
  className?: string
  dot?: boolean
  title?: string
}

export function Badge({
  children,
  variant = 'slate',
  size = 'sm',
  className = '',
  dot = false,
  title,
}: BadgeProps) {
  const variantClass = VARIANT_MAP[variant] || VARIANT_MAP.slate
  const sizeClass = size === 'xs' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5'

  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border whitespace-nowrap shrink-0 ${variantClass} ${sizeClass} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            variant === 'rose'
              ? 'bg-rose-500'
              : variant === 'amber'
                ? 'bg-amber-500'
                : variant === 'emerald'
                  ? 'bg-emerald-500'
                  : variant === 'sky'
                    ? 'bg-sky-500'
                    : variant === 'purple'
                      ? 'bg-purple-500'
                      : 'bg-slate-400'
          }`}
        />
      )}
      {children}
    </span>
  )
}
