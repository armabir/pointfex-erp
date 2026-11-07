import type { ReactNode, ComponentType } from 'react'

export interface CardProps {
  children?: ReactNode
  className?: string
  title?: ReactNode
  subtitle?: ReactNode
  icon?: ComponentType<{ className?: string }>
  action?: ReactNode
  headerBorder?: boolean
  noPadding?: boolean
}

export function Card({
  children,
  className = '',
  title,
  subtitle,
  icon: Icon,
  action,
  headerBorder = false,
  noPadding = false,
}: CardProps) {
  return (
    <div
      className={`bg-white dark:bg-[#0f1422] border border-slate-200/60 dark:border-slate-800/80 rounded-3xl shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03),0_2px_6px_-1px_rgba(15,23,42,0.02)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.35)] transition-all ${className}`}
    >
      {(title || subtitle || action || Icon) && (
        <div
          className={`flex items-center justify-between px-5 py-4 ${
            headerBorder ? 'border-b border-slate-100 dark:border-slate-800/70' : ''
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="shrink-0 ml-3">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'px-5 pb-5 pt-1'}>{children}</div>
    </div>
  )
}

