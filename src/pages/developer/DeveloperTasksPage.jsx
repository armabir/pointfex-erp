import React, { useState } from 'react'
import { Badge } from '../../components/common/Badge.jsx'
import { useDeveloperData } from '../../hooks/useDeveloperData.js'
import { useApp } from '../../context/AppContext.jsx'
import { getRelativeDeadline } from '../../utils/formatters.js'
import { Clock } from 'lucide-react'

export function DeveloperTasksPage() {
  const { allDevTasks } = useDeveloperData()
  const { setSelectedTaskModal } = useApp()
  const [filterProject, setFilterProject] = useState('all')

  const columns = [
    { id: 'todo', label: 'To Do', color: 'slate', dot: 'bg-slate-400' },
    { id: 'in_progress', label: 'In Progress', color: 'sky', dot: 'bg-sky-500' },
    { id: 'in_review', label: 'In Review', color: 'purple', dot: 'bg-purple-500' },
    { id: 'completed', label: 'Completed', color: 'emerald', dot: 'bg-emerald-500' },
    { id: 'blocked', label: 'Blocked', color: 'rose', dot: 'bg-rose-500' },
  ]

  const filteredTasks = allDevTasks.filter((task) => {
    if (filterProject !== 'all' && task.projectId !== filterProject) return false
    return true
  })

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            My Tasks
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your sprint deliverables
          </p>
        </div>

        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          className="bg-white text-xs text-slate-700 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-slate-400 cursor-pointer shadow-2xs"
        >
          <option value="all">All Projects</option>
          <option value="proj_01">PulseFlow Analytics</option>
          <option value="proj_02">CloudMesh Gateway</option>
        </select>
      </div>

      {/* 5-Column Soft Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id)

          return (
            <div
              key={col.id}
              className="bg-slate-100/60 rounded-3xl p-3.5 flex flex-col min-h-[460px] border border-slate-200/40"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="text-xs font-semibold text-slate-800">
                    {col.label}
                  </span>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards in this Column */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="h-28 rounded-2xl flex items-center justify-center text-xs text-slate-400 italic">
                    Empty
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const deadline = getRelativeDeadline(task.dueDate)
                    return (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskModal(task)}
                        className="p-3.5 bg-white border border-slate-100/80 hover:border-slate-200/80 rounded-2xl cursor-pointer transition-all duration-150 shadow-2xs hover:shadow-xs group"
                      >
                        <div className="flex items-center justify-between gap-1.5 mb-2">
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

                          <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{task.loggedHours}h</span>
                          </div>
                        </div>

                        <h4 className="text-xs font-medium text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-2 leading-snug">
                          {task.title}
                        </h4>

                        <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-end">
                          <span className="text-[11px] text-slate-400">
                            {deadline.label}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
