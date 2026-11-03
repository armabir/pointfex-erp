import React from 'react'
import { Card } from '../common/Card.jsx'
import { Badge } from '../common/Badge.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { formatDate } from '../../utils/formatters.js'
import { Clock, CheckCircle2 } from 'lucide-react'

export function UpcomingDeadlines({ deadlines, overdueTasks }) {
  const { setSelectedTaskModal, updateTaskStatus, currentRole } = useApp()

  return (
    <Card
      title="Upcoming Deadlines"
      icon={Clock}
      action={
        overdueTasks.length > 0 ? (
          <Badge variant="rose" size="xs" dot>
            {overdueTasks.length} overdue
          </Badge>
        ) : (
          <Badge variant="emerald" size="xs" dot>
            On track
          </Badge>
        )
      }
    >
      <div className="space-y-2.5">
        {deadlines.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 py-3 text-center">
            No upcoming deadlines.
          </p>
        ) : (
          deadlines.map((task) => {
            const isOverdue = task.deadlineInfo.isOverdue
            return (
              <div
                key={task.id}
                onClick={() => setSelectedTaskModal(task)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  isOverdue
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40 hover:border-rose-200'
                    : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                    {task.title}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {formatDate(task.dueDate, 'short')}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={task.deadlineInfo.badgeColor} size="xs">
                    {task.deadlineInfo.label}
                  </Badge>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (currentRole === 'developer') {
                        // Submit for review instead of completed
                        updateTaskStatus(task.id, 'in_review')
                      } else {
                        updateTaskStatus(task.id, 'completed')
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                    title={currentRole === 'developer' ? 'Submit for Review' : 'Mark Completed'}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </Card>
  )
}
