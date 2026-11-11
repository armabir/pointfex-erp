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
      className={`bg-white dark:bg-[#0f1422] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      {(title || subtitle || action || Icon) && (
        <div
          className={`flex items-center justify-between px-6 py-4 ${
            headerBorder ? 'border-b border-slate-100 dark:border-slate-800' : ''
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            {Icon && (
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 shrink-0">
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
      <div className={noPadding ? '' : 'px-6 pb-6 pt-2'}>{children}</div>
    </div>
  )
}
