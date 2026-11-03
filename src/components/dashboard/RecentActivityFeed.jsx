import React from 'react'
import { Card } from '../common/Card.jsx'
import {
  Activity,
  CheckCircle2,
  GitCommit,
  DollarSign,
  MessageSquare,
  Sparkles,
} from 'lucide-react'

export function RecentActivityFeed({ activities }) {
  const getActivityIcon = (category) => {
    switch (category) {
      case 'git':
        return <GitCommit className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      case 'task':
        return <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
      case 'comment':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
      case 'financial':
        return <DollarSign className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      case 'milestone':
        return <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
      default:
        return <Activity className="w-3.5 h-3.5 text-slate-500" />
    }
  }

  return (
    <Card
      title="Recent Activity"
      icon={Activity}
    >
      <div className="space-y-2">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-center justify-between gap-3 text-xs p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-xl bg-slate-100/80 dark:bg-slate-800 shrink-0">
                {getActivityIcon(act.category)}
              </div>
              <div className="min-w-0">
                <span className="font-medium text-slate-900 dark:text-slate-100 truncate block">
                  {act.entityTitle}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                  {act.description}
                </span>
              </div>
            </div>

            <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">
              {act.timestamp}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}
