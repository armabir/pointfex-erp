import React, { useState, useMemo } from 'react'
import { Card } from '../common/Card.jsx'
import { Badge } from '../common/Badge.jsx'
import { StatusPill } from '../common/StatusPill.jsx'
import { Button } from '../common/Button.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { formatDate } from '../../utils/formatters.js'
import { CheckSquare, ArrowRight, Filter, X } from 'lucide-react'

export function MyTasksOverview({ tasks }) {
  const { setRoute, setSelectedTaskModal } = useApp()
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false
      return true
    })
  }, [tasks, statusFilter, priorityFilter])

  const hasActiveFilters = statusFilter !== 'all' || priorityFilter !== 'all'

  const clearFilters = () => {
    setStatusFilter('all')
    setPriorityFilter('all')
  }

  return (
    <Card
      title="My Tasks"
      icon={CheckSquare}
      action={
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-3 h-3" />
              Reset filters
            </button>
          )}
          <Button
            variant="ghost"
            size="xs"
            rightIcon={ArrowRight}
            onClick={() => setRoute('tasks')}
          >
            Kanban View
          </Button>
        </div>
      }
      noPadding
    >
      {/* Filtering Toolbar */}
      <div className="px-5 py-2.5 bg-slate-50/60 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 dark:text-slate-400 font-medium">Filter:</span>

          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-slate-400 cursor-pointer shadow-2xs font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="todo">To Do</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>

          {/* Priority Select */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-slate-400 cursor-pointer shadow-2xs font-medium"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <span className="text-[11px] text-slate-400">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-medium bg-slate-50/30 dark:bg-slate-850">
              <th className="py-3 px-5 font-medium">Task</th>
              <th className="py-3 px-3 font-medium">Project</th>
              <th className="py-3 px-3 font-medium">Priority</th>
              <th className="py-3 px-3 font-medium">Status</th>
              <th className="py-3 px-5 font-medium text-right">Due Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-slate-500">
                  No tasks match the selected filters.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
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
