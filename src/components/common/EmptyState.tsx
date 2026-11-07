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
  title = 'No items found',
  description = 'There are no records matching your current filter.',
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center border border-dashed border-[#1e2538] rounded-md bg-[#0a0d14]/50 ${className}`}
    >
      <div className="p-3 rounded-full bg-slate-800/40 border border-slate-700/40 text-slate-400 mb-3">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="text-xs font-semibold text-slate-200 tracking-tight">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

