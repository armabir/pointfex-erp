import React from 'react'

export function Card({
  children,
  className = '',
  title,
  subtitle,
  icon: Icon,
  action,
  headerBorder = false,
  noPadding = false,
}) {
  return (
    <div
      className={`bg-white border border-slate-100 rounded-2xl shadow-xs transition-colors ${className}`}
    >
      {(title || subtitle || action || Icon) && (
        <div
          className={`flex items-center justify-between px-5 py-4 ${
            headerBorder ? 'border-b border-slate-100' : ''
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-sm font-semibold text-slate-900 tracking-tight truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 truncate mt-0.5">
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
