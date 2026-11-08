import React, { useState, useMemo } from 'react'
import { Badge } from '../../components/common/Badge'
import { useCtoData } from '../../hooks/useCtoData'
import { useApp } from '../../context/AppContext'
import { formatDate } from '../../utils/formatters'
import type { TaskStatus } from '../../types'
import {
  Clock,
  Layers,
  Search,
  Lock,
  Crown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'

interface ColumnDef {
  id: TaskStatus
  label: string
  dot: string
  isLocked?: boolean
}

interface StrategicCategory {
  id: string
  name: string
  tag: string
  description: string
  icon: typeof Crown
}

const COLUMNS: ColumnDef[] = [
  { id: 'todo', label: 'To Do', dot: 'bg-slate-400 dark:bg-slate-500' },
  { id: 'in_progress', label: 'In Progress', dot: 'bg-sky-500' },
  { id: 'in_review', label: 'In Review', dot: 'bg-purple-500' },
  { id: 'completed', label: 'Completed', dot: 'bg-emerald-500', isLocked: true },
  { id: 'blocked', label: 'Blocked', dot: 'bg-rose-500' },
]

const CATEGORIES: StrategicCategory[] = [
  {
    id: 'arch',
    name: 'System Architecture',
    tag: 'Architecture',
    description: 'Distributed engines, microservices, and database sharding',
    icon: Layers,
  },
  {
    id: 'sec',
    name: 'Security & Compliance',
    tag: 'Security',
    description: 'SOC2 Type II, zero-trust perimeter, and secret encryption',
    icon: ShieldCheck,
  },
  {
    id: 'ai',
    name: 'AI & Data Platforms',
    tag: 'Platform',
    description: 'Vector pipelines, LLM inference nodes, and analytics mesh',
    icon: Sparkles,
  },
]

export function CtoTasksPage() {
  const { ctoPersonalTasks } = useCtoData()
  const { updateCtoPersonalTaskStatus, setSelectedTaskModal, showToast } = useApp()

  // Filters (Category filter on left + Search on right)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)
  const [dragOverColId, setDragOverColId] = useState<string | null>(null)

  const columns = COLUMNS
  const categories = CATEGORIES

  // Filter tasks based on category and search
  const filteredTasks = useMemo(() => {
    return ctoPersonalTasks.filter((task) => {
      if (selectedCategory !== 'all') {
        const cat = CATEGORIES.find((c) => c.id === selectedCategory)
        const tagMatch = cat ? task.tags?.some((t) => t.toLowerCase() === cat.tag.toLowerCase()) : false
        const titleMatch = cat ? task.title.toLowerCase().includes(cat.tag.toLowerCase()) : false
        if (!tagMatch && !titleMatch) return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const titleMatch = task.title.toLowerCase().includes(q)
        const descMatch = task.description?.toLowerCase().includes(q)
        const tagMatch = task.tags?.some((t) => t.toLowerCase().includes(q))
        if (!titleMatch && !descMatch && !tagMatch) return false
      }

      return true
    })
  }, [ctoPersonalTasks, selectedCategory, searchQuery])

  // Overall stats for left sidebar
  const totalTasksCount = ctoPersonalTasks.length
  const totalCompletedCount = ctoPersonalTasks.filter((t) => t.status === 'completed').length
  const totalActiveCount = totalTasksCount - totalCompletedCount
  const overallProgress = totalTasksCount > 0 ? Math.round((totalCompletedCount / totalTasksCount) * 100) : 0

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragEnd = () => {
    setDraggedTaskId(null)
    setDragOverColId(null)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, colId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverColId !== colId) {
      setDragOverColId(colId)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetColId: TaskStatus) => {
    e.preventDefault()
    setDragOverColId(null)
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId
    if (!taskId) return

    const task = ctoPersonalTasks.find((t) => t.id === taskId)
    if (!task || task.status === targetColId) return

    // CTO cannot drag directly to Completed (requires CEO sign-off)
    if (targetColId === 'completed') {
      showToast(
        'Permission denied: CTO strategic directives require CEO verification & Board sign-off to be completed. Please move to "In Review" for review.',
        'error'
      )
      setDraggedTaskId(null)
      return
    }

    updateCtoPersonalTaskStatus(taskId, targetColId)
    showToast(`Task moved to ${targetColId.replace('_', ' ')}`, 'success')
    setDraggedTaskId(null)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Strategic Directives & Tasks
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Board-mandated initiatives, architecture milestones, and executive objectives assigned by the CEO
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60">
            <Crown className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            Assigned by CEO Victoria Sterling-Fox
          </span>
        </div>
      </div>

      {/* Main Layout: Left Strategic Pillar Filter Cards + Right Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (3 cols): Strategic Filters */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Strategic Pillars
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
              {totalTasksCount} Total
            </span>
          </div>

          {/* "All Initiatives" Card */}
          <div
            onClick={() => setSelectedCategory('all')}
            className={`p-3.5 rounded-2xl cursor-pointer transition-all duration-150 border ${
              selectedCategory === 'all'
                ? 'bg-lime-50/70 dark:bg-lime-950/20 border-lime-300 dark:border-lime-700/60 shadow-xs'
                : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                    selectedCategory === 'all'
                      ? 'bg-lime-500 text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
                    All Strategic Directives
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    {totalActiveCount} Active • {totalCompletedCount} Signed Off
                  </span>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Completion</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {overallProgress}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-lime-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Individual Category Cards */}
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id
            const catTasks = ctoPersonalTasks.filter(
              (t) =>
                t.tags?.some((tg) => tg.toLowerCase() === cat.tag.toLowerCase()) ||
                t.title.toLowerCase().includes(cat.tag.toLowerCase())
            )
            const catCompleted = catTasks.filter((t) => t.status === 'completed').length
            const catProgress =
              catTasks.length > 0 ? Math.round((catCompleted / catTasks.length) * 100) : 0
            const Icon = cat.icon

            return (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-2xl cursor-pointer transition-all duration-150 border ${
                  isSelected
                    ? 'bg-lime-50/70 dark:bg-lime-950/20 border-lime-300 dark:border-lime-700/60 shadow-xs'
                    : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-lime-500 text-slate-950'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                        {cat.name}
                      </h4>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                    {catTasks.length}
                  </span>
                </div>

                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                  {cat.description}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1 overflow-hidden">
                  <div
                    className="bg-sky-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${catProgress}%` }}
                  />
                </div>
              </div>
            )
          })}

          {/* CEO Sign-off Reminder Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <span>CEO Sign-Off Requirement</span>
            </div>
            <p className="text-[11px] text-amber-700 dark:text-amber-400/90 leading-relaxed">
              CTO strategic deliverables require CEO review and verification before transitioning to Completed status.
            </p>
          </div>
        </div>

        {/* Right Column (9 cols): Search bar + Kanban Columns */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search directives by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-lime-500"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5 items-start">
            {columns.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.id)
              const isOver = dragOverColId === col.id

              return (
                <div
                  key={col.id}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDrop={(e) => handleDrop(e, col.id)}
                  className={`rounded-2xl p-3 border transition-colors min-h-[500px] flex flex-col ${
                    isOver
                      ? 'border-lime-500 bg-lime-50/20 dark:bg-lime-950/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40'
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                      <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                        {col.label}
                      </span>
                      {col.isLocked && (
                        <span title="Locked: Requires CEO sign-off">
                          <Lock className="w-3 h-3 text-slate-400" />
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2.5 flex-1">
                    {colTasks.length === 0 ? (
                      <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center p-3 text-center">
                        <span className="text-[11px] text-slate-400">
                          {col.isLocked ? 'No verified tasks' : 'Drag directives here'}
                        </span>
                      </div>
                    ) : (
                      colTasks.map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setSelectedTaskModal(task)}
                          className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/70 hover:border-lime-400 dark:hover:border-lime-500 hover:shadow-xs transition-all duration-150 cursor-grab active:cursor-grabbing group space-y-2"
                        >
                          {/* Task Top: Project Code badge & Priority */}
                          <div className="flex items-center justify-between gap-1">
                            <Badge variant="indigo" size="xs">
                              {task.project?.code || 'EXEC'}
                            </Badge>
                            {task.priority && (
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                  task.priority === 'urgent'
                                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                    : task.priority === 'high'
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {task.priority}
                              </span>
                            )}
                          </div>

                          {/* Task Title */}
                          <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors line-clamp-2">
                            {task.title}
                          </h4>

                          {/* Description snippet */}
                          {task.description && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Tags */}
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {task.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 font-mono"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Card Footer: Deadline & Assignor */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] text-slate-400">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{formatDate(task.dueDate, 'short')}</span>
                            </div>
                            <span className="truncate max-w-[100px] text-purple-600 dark:text-purple-400 font-medium">
                              CEO Assigned
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
