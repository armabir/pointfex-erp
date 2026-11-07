import React from 'react'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  onClick?: () => void
}

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
}

export function Breadcrumbs({ items = [] }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-400" aria-label="Breadcrumb">
      <div className="flex items-center gap-1 text-slate-400">
        <Home className="w-3.5 h-3.5" />
      </div>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="font-medium text-slate-700 truncate">{item.label}</span>
            ) : (
              <span
                onClick={item.onClick}
                className={`truncate transition-colors ${
                  item.onClick ? 'cursor-pointer hover:text-slate-900 text-slate-500' : 'text-slate-400'
                }`}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

