import { useState } from 'react'
import { Card } from '../common/Card'
import { Badge } from '../common/Badge'
import { formatDate } from '../../utils/formatters'
import { Megaphone, ChevronDown, ChevronUp } from 'lucide-react'
import type { Announcement } from '../../types'

export interface AnnouncementsWidgetProps {
  announcements: Announcement[]
}

export function AnnouncementsWidget({ announcements }: AnnouncementsWidgetProps) {
  const [expandedId, setExpandedId] = useState<string | null>(announcements[0]?.id || null)

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <Card title="Announcements" icon={Megaphone}>
      <div className="space-y-2.5">
        {announcements.map((ann) => {
          const isExpanded = expandedId === ann.id
          return (
            <div
              key={ann.id}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                isExpanded
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200/70 dark:border-amber-800/40 shadow-2xs'
                  : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
              }`}
              onClick={() => toggleExpand(ann.id)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={ann.category === 'pm' ? 'sky' : 'amber'} size="xs">
                      {ann.authorName?.split(' ')[0] || 'Team'}
                    </Badge>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      {formatDate(ann.date, 'short')}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {ann.title}
                  </h4>
                </div>

                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-750 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {ann.content}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
