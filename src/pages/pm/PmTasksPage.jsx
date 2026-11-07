import React, { useState, useMemo } from 'react'
import { Card } from '../../components/common/Card.jsx'
import { Badge } from '../../components/common/Badge.jsx'
import { StatusPill } from '../../components/common/StatusPill.jsx'
import { Button } from '../../components/common/Button.jsx'
import { usePmData } from '../../hooks/usePmData.js'
import { useApp } from '../../context/AppContext.jsx'
import { formatDate } from '../../utils/formatters.js'
import {
  CheckSquare,
  Search,
  Clock,
  CheckCircle2,
} from 'lucide-react'

export function PmTasksPage() {
  const { pmPersonalTasks, pm } = usePmData()
  const { updatePmTaskStatus, setSelectedTaskModal } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'todo' | 'in_progress' | 'completed'
  const [priorityFilter, setPriorityFilter] = useState('all')

  const filteredTasks = useMemo(() => {
    return pmPersonalTasks.filter((task) => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const titleMatch = task.title.toLowerCase().includes(q)
        const descMatch = task.description.toLowerCase().includes(q)
        const tagMatch = task.tags?.some((t) => t.toLowerCase().includes(q))
        if (!titleMatch && !descMatch && !tagMatch) return false
      }
      return true
    })
  }, [pmPersonalTasks, statusFilter, priorityFilter, searchQuery])

  const totalCount = pmPersonalTasks.length
  const completedCount = pmPersonalTasks.filter((t) => t.status === 'completed').length
  const activeCount = totalCount - completedCount

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            My Operational Tasks
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Personal responsibilities assigned to {pm?.name || 'PM'} by C-Suite Executives (CTO, CFO, CPO, CEO)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="lime" size="sm">
            {activeCount} Active Responsibilities
          </Badge>
          <Badge variant="slate" size="sm">
            {completedCount} Completed
          </Badge>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0f1422] border border-slate-200/60 dark:border-slate-800/80 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] flex flex-wrap items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search operational tasks, tags, or briefs..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['all', 'todo', 'in_progress', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === st
                  ? 'bg-slate-900 text-white dark:bg-lime-400 dark:text-slate-950 shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700'
              }`}
            >
              {st === 'all'
                ? 'All Tasks'
                : st === 'todo'
                ? 'To Do'
                : st === 'in_progress'
                ? 'In Progress'
                : 'Completed'}
            </button>
          ))}

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 border-none focus:outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card>
            <div className="py-12 text-center space-y-2">
              <CheckSquare className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-900 dark:text-white">
                No tasks match your criteria
              </div>
              <p className="text-xs text-slate-400">
                Try clearing your search query or switching filters.
              </p>
            </div>
          </Card>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed'
            return (
              <Card key={task.id} noPadding>
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Task Content */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusPill status={task.status} size="sm" />
                      <Badge
                        variant={
                          task.priority === 'urgent'
                            ? 'rose'
                            : task.priority === 'high'
                            ? 'amber'
                            : 'sky'
                        }
                        size="xs"
                      >
                        {task.priority.toUpperCase()}
                      </Badge>
                      {task.deadlineInfo?.isOverdue && !isCompleted && (
                        <Badge variant="rose" size="xs">
                          {task.deadlineInfo.label}
                        </Badge>
                      )}
                      <span className="text-[11px] text-slate-400 font-medium">
                        Assigned by <strong className="text-slate-700 dark:text-slate-300">{task.creator?.name || 'Executive'}</strong>
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedTaskModal(task)}
                      className="text-sm font-bold text-slate-900 dark:text-white hover:text-lime-600 dark:hover:text-lime-400 cursor-pointer transition-colors"
                    >
                      {task.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Due {formatDate(task.dueDate, 'short')}
                      </span>
                      <span>•</span>
                      <span>Project: {task.project?.name || 'Company Wide'}</span>
                      {task.tags && task.tags.length > 0 && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            {task.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Quick Status Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => setSelectedTaskModal(task)}
                    >
                      Details
                    </Button>

                    {task.status !== 'in_progress' && !isCompleted && (
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => updatePmTaskStatus(task.id, 'in_progress')}
                      >
                        Start
                      </Button>
                    )}

                    {!isCompleted ? (
                      <Button
                        variant="lime"
                        size="xs"
                        icon={CheckCircle2}
                        onClick={() => updatePmTaskStatus(task.id, 'completed')}
                      >
                        Complete
                      </Button>
                    ) : (
                      <Button
                        variant="subtle"
                        size="xs"
                        onClick={() => updatePmTaskStatus(task.id, 'in_progress')}
                      >
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export default PmTasksPage
