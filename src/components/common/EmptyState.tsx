import type { ReactNode, ComponentType } from 'react'
import { Inbox } from 'lucide-react'

export interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>
  title?: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing to show yet',
  description = 'There are no items matching your current view.',
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 sm:p-8 text-center border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50/60 dark:bg-slate-900/40 ${className}`}
    >
      <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-gray-200/80 dark:border-gray-700/60 text-blue-600 dark:text-blue-400 shadow-2xs mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
        {title}
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
