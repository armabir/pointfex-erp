import React, { useState, useMemo } from 'react'
import { Card } from '../common/Card.jsx'
import { Badge } from '../common/Badge.jsx'
import { StatusPill } from '../common/StatusPill.jsx'
import { Button } from '../common/Button.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { formatDate } from '../../utils/formatters.js'
import {
  CheckSquare,
  ArrowRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'

export function MyTasksOverview({ tasks }) {
  const { setRoute, setSelectedTaskModal } = useApp()
  const [sortBy, setSortBy] = useState('dueDate') // 'dueDate' | 'priority' | 'status' | 'title'
  const [sortOrder, setSortOrder] = useState('asc') // 'asc' | 'desc'

  const handleSortToggle = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const sortedTasks = useMemo(() => {
    const list = [...tasks]
    const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 }
    const statusWeight = { in_progress: 5, in_review: 4, todo: 3, blocked: 2, completed: 1 }

    list.sort((a, b) => {
      let comparison = 0
      if (sortBy === 'dueDate') {
        const timeA = new Date(a.dueDate).getTime()
        const timeB = new Date(b.dueDate).getTime()
        comparison = timeA - timeB
      } else if (sortBy === 'priority') {
        comparison = (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0)
      } else if (sortBy === 'status') {
        comparison = (statusWeight[b.status] || 0) - (statusWeight[a.status] || 0)
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title)
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return list
  }, [tasks, sortBy, sortOrder])

  const sortOptions = [
    { id: 'dueDate', label: 'Due Date' },
    { id: 'priority', label: 'Priority' },
    { id: 'status', label: 'Status' },
    { id: 'title', label: 'Title (A-Z)' },
  ]

  return (
    <Card
      title="My Tasks"
      icon={CheckSquare}
      action={
        <Button
          variant="ghost"
          size="xs"
          rightIcon={ArrowRight}
          onClick={() => setRoute('tasks')}
        >
          Kanban View
        </Button>
      }
      noPadding
    >
      {/* Sorting Toolbar */}
      <div className="px-5 py-2.5 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort by:
          </span>

          <div className="flex items-center gap-1.5 flex-wrap">
            {sortOptions.map((opt) => {
              const isActive = sortBy === opt.id
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSortToggle(opt.id)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-lime-400 dark:text-slate-950 shadow-2xs'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isActive && (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <span className="text-[11px] text-slate-400 dark:text-slate-500">
          {sortedTasks.length} tasks
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-medium bg-slate-50/30 dark:bg-slate-800/20">
              <th className="py-3 px-5 font-medium">Task</th>
              <th className="py-3 px-3 font-medium">Project</th>
              <th className="py-3 px-3 font-medium">Priority</th>
              <th className="py-3 px-3 font-medium">Status</th>
              <th className="py-3 px-5 font-medium text-right">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sortedTasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-slate-500">
                  No active tasks.
                </td>
              </tr>
            ) : (
              sortedTasks.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => setSelectedTaskModal(task)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  {/* Title */}
                  <td className="py-3.5 px-5 min-w-[220px]">
                    <span className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-1">
                      {task.title}
                    </span>
                  </td>

                  {/* Project */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <Badge variant="indigo" size="xs">
                      {task.project?.code || 'PROJ'}
                    </Badge>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <Badge
                      variant={
                        task.priority === 'urgent'
                          ? 'rose'
                          : task.priority === 'high'
                          ? 'amber'
                          : 'slate'
                      }
                      size="xs"
                    >
                      {task.priority}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <StatusPill status={task.status} size="sm" />
                  </td>

                  {/* Deadline */}
                  <td className="py-3.5 px-5 whitespace-nowrap text-right text-slate-500 dark:text-slate-400">
                    {formatDate(task.dueDate, 'short')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
