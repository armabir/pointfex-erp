import React from 'react'

const VARIANT_MAP = {
  sky: 'bg-sky-50 text-sky-700 border-sky-200/70',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
  amber: 'bg-amber-50 text-amber-700 border-amber-200/70',
  rose: 'bg-rose-50 text-rose-700 border-rose-200/70',
  indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
  purple: 'bg-purple-50 text-purple-700 border-purple-200/70',
  lime: 'bg-[#d9f99d]/70 text-[#1a2e05] border-[#bef264]',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
}

export function Badge({ children, variant = 'slate', size = 'sm', className = '', dot = false }) {
  const variantClass = VARIANT_MAP[variant] || VARIANT_MAP.slate
  const sizeClass = size === 'xs' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-0.5'

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantClass} ${sizeClass} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
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
