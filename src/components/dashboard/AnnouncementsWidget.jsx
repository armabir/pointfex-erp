import React, { useState } from 'react'
import { Card } from '../common/Card.jsx'
import { Badge } from '../common/Badge.jsx'
import { formatDate } from '../../utils/formatters.js'
import { Megaphone, ChevronDown, ChevronUp } from 'lucide-react'

export function AnnouncementsWidget({ announcements }) {
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <Card
      title="Announcements"
      icon={Megaphone}
    >
      <div className="space-y-2">
        {announcements.map((ann) => {
          const isExpanded = expandedId === ann.id
          return (
            <div
              key={ann.id}
              className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer"
              onClick={() => toggleExpand(ann.id)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={ann.category === 'pm' ? 'sky' : 'slate'} size="xs">
                      {ann.authorName.split(' ')[0]}
                    </Badge>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(ann.date, 'short')}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 truncate">
                    {ann.title}
                  </h4>
                </div>

                <button className="text-slate-400 p-1 shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-600 leading-relaxed">
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
