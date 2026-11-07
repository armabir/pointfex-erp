import React, { useState, useMemo } from 'react'
import { Badge } from '../../components/common/Badge.jsx'
import { Button } from '../../components/common/Button.jsx'
import { Modal } from '../../components/common/Modal.jsx'
import { usePmData } from '../../hooks/usePmData.js'
import { useApp } from '../../context/AppContext.jsx'
import { formatDate } from '../../utils/formatters.js'
import {
  Plus,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

export function PmTaskManagementPage() {
  const { teamTasks, teamProjects, teamMembers, pendingReviewTasks, team } = usePmData()
  const {
    createTask,
    approveTask,
    rejectTask,
    reassignTask,
    updateTaskStatus,
    setSelectedTaskModal,
  } = useApp()

  // Filters
  const [selectedProjectId, setSelectedProjectId] = useState('all')
  const [selectedDevId, setSelectedDevId] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [rejectingTask, setRejectingTask] = useState(null)
  const [rejectFeedback, setRejectFeedback] = useState('')

  // Drag and drop state
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const [dragOverColId, setDragOverColId] = useState(null)

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDesc, setNewTaskDesc] = useState('')
  const [newTaskProject, setNewTaskProject] = useState(teamProjects[0]?.id || '')
  const [newTaskDev, setNewTaskDev] = useState(teamMembers[0]?.id || '')
  const [newTaskPriority, setNewTaskPriority] = useState('medium')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [newTaskHours, setNewTaskHours] = useState('8')
  const [newTaskTags, setNewTaskTags] = useState('')

  const columns = [
    { id: 'todo', label: 'To Do', dot: 'bg-slate-400 dark:bg-slate-500' },
    { id: 'in_progress', label: 'In Progress', dot: 'bg-sky-500' },
    { id: 'in_review', label: 'In Review', dot: 'bg-purple-500', isReview: true },
    { id: 'completed', label: 'Completed', dot: 'bg-emerald-500', isApproval: true },
    { id: 'blocked', label: 'Blocked', dot: 'bg-rose-500' },
  ]

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return teamTasks.filter((task) => {
      if (selectedProjectId !== 'all' && task.projectId !== selectedProjectId) return false
      if (selectedDevId !== 'all' && task.assigneeId !== selectedDevId) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const titleMatch = task.title.toLowerCase().includes(q)
        const descMatch = task.description.toLowerCase().includes(q)
        const tagMatch = task.tags?.some((t) => t.toLowerCase().includes(q))
        if (!titleMatch && !descMatch && !tagMatch) return false
      }
      return true
    })
  }, [teamTasks, selectedProjectId, selectedDevId, searchQuery])

  // Drag handlers
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId)
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, colId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverColId !== colId) {
      setDragOverColId(colId)
    }
  }

  const handleDrop = (e, targetColId) => {
    e.preventDefault()
    setDragOverColId(null)
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId
    if (!taskId) return

    const task = teamTasks.find((t) => t.id === taskId)
    if (!task || task.status === targetColId) return

    // If moving to completed, trigger approval
    if (targetColId === 'completed') {
      approveTask(taskId, 'Directly approved via PM Kanban board')
    } else {
      updateTaskStatus(taskId, targetColId)
    }
    setDraggedTaskId(null)
  }

  // Handle task creation
  const handleCreateSubmit = (e) => {
    e.preventDefault()
    if (!newTaskTitle.trim() || !newTaskProject || !newTaskDev) return

    const tagList = newTaskTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    createTask({
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      projectId: newTaskProject,
      assigneeId: newTaskDev,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      estimatedHours: newTaskHours,
      tags: tagList,
    })

    // Reset and close
    setNewTaskTitle('')
    setNewTaskDesc('')
    setNewTaskTags('')
    setIsCreateModalOpen(false)
  }

  // Handle reject with feedback
  const handleConfirmReject = (e) => {
    e.preventDefault()
    if (!rejectingTask || !rejectFeedback.trim()) return

    rejectTask(rejectingTask.id, rejectFeedback.trim())
    setRejectingTask(null)
    setRejectFeedback('')
  }

  return (
    <div className="space-y-6">
      {/* Header with New Task Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Team Task Management
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage, assign, and verify sprint tasks for <span className="font-semibold text-slate-700 dark:text-slate-300">{team?.name || 'Squad'}</span> (4 Developers)
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {pendingReviewTasks.length > 0 && (
            <Badge variant="rose" size="sm">
              {pendingReviewTasks.length} Awaiting Approval
            </Badge>
          )}
          <Button
            variant="lime"
            size="sm"
            icon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#0f1422] border border-slate-200/60 dark:border-slate-800/80 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, descriptions, or tags..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
          />
        </div>

        {/* Project Selector Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Project:</span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Team Projects</option>
            {teamProjects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Developer Selector Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Developer:</span>
          <select
            value={selectedDevId}
            onChange={(e) => setSelectedDevId(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="all">All Developers ({teamMembers.length})</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.title?.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id)
          const isDragOver = dragOverColId === col.id

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`flex flex-col rounded-3xl border transition-all duration-150 min-h-[480px] p-3 ${
                isDragOver
                  ? 'bg-lime-50/60 dark:bg-lime-950/20 border-lime-300 dark:border-lime-700/60'
                  : 'bg-[#0f1422]/5 dark:bg-[#0f1422] border-slate-200/70 dark:border-slate-800/80'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/50 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {col.label}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-400 bg-white dark:bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700/50">
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards Container */}
              <div className="flex-1 space-y-2.5 pt-3">
                {colTasks.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-[11px] text-slate-400 border border-dashed border-slate-200/60 dark:border-slate-800 rounded-2xl">
                    No tasks in {col.label}
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const isReview = task.status === 'in_review'
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="p-3.5 rounded-2xl bg-white dark:bg-[#182033] border border-slate-200/80 dark:border-slate-700/70 shadow-2xs hover:shadow-xs transition-all cursor-grab active:cursor-grabbing group space-y-2.5"
                      >
                        {/* Top: Project tag & priority */}
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          <Badge variant="indigo" size="xs">
                            {task.project?.code || 'PROJ'}
                          </Badge>
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
                            {task.priority}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => setSelectedTaskModal(task)}
                          className="font-semibold text-xs text-slate-900 dark:text-white hover:text-lime-600 dark:hover:text-lime-400 cursor-pointer line-clamp-2 leading-snug"
                        >
                          {task.title}
                        </h4>

                        {/* Assignee & Deadline */}
                        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[110px]">
                            {task.assignee?.name?.split(' ')[0] || 'Dev'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {formatDate(task.dueDate, 'short')}
                          </span>
                        </div>

                        {/* PM Quick Actions on "In Review" tasks */}
                        {isReview && (
                          <div className="pt-2 border-t border-purple-100 dark:border-purple-900/30 flex items-center justify-between gap-1.5">
                            <button
                              onClick={() => approveTask(task.id, 'Approved by PM')}
                              className="flex-1 py-1 px-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              title="Approve deliverable and mark task Completed"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Approve
                            </button>
                            <button
                              onClick={() => {
                                setRejectingTask(task)
                                setRejectFeedback('')
                              }}
                              className="flex-1 py-1 px-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              title="Return to developer with review feedback"
                            >
                              <XCircle className="w-3 h-3" /> Revise
                            </button>
                          </div>
                        )}

                        {/* Reassignment Dropdown (Allows PM to quickly shift developer) */}
                        <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                          <span>Reassign:</span>
                          <select
                            value={task.assigneeId}
                            onChange={(e) => reassignTask(task.id, e.target.value)}
                            className="bg-transparent border-none text-[10px] text-slate-600 dark:text-slate-300 font-medium cursor-pointer focus:outline-none"
                          >
                            {teamMembers.map((m) => (
                              <option key={m.id} value={m.id} className="dark:bg-slate-900">
                                {m.name.split(' ')[0]}
                              </option>
                            ))}
                          </select>
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

      {/* Task Creation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create & Assign New Task"
        subtitle={`Assign task to one of ${team?.name || 'Team 1'} developers`}
        maxWidth="max-w-xl"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="lime" size="sm" onClick={handleCreateSubmit}>
              Create Task
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="e.g. Implement WebSocket heartbeat retry telemetry"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-lime-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Project <span className="text-rose-500">*</span>
              </label>
              <select
                value={newTaskProject}
                onChange={(e) => setNewTaskProject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {teamProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} - {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Assigned Developer <span className="text-rose-500">*</span>
              </label>
              <select
                value={newTaskDev}
                onChange={(e) => setNewTaskDev(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {teamMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.title})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                min="1"
                max="80"
                value={newTaskHours}
                onChange={(e) => setNewTaskHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description & Acceptance Criteria
            </label>
            <textarea
              rows="3"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              placeholder="Outline functional requirements and acceptance criteria for the engineer..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={newTaskTags}
              onChange={(e) => setNewTaskTags(e.target.value)}
              placeholder="e.g. WebSocket, Performance, Telemetry"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </form>
      </Modal>

      {/* Reject / Request Revisions Modal */}
      <Modal
        isOpen={Boolean(rejectingTask)}
        onClose={() => setRejectingTask(null)}
        title="Request Task Revision"
        subtitle={`Return "${rejectingTask?.title}" to In Progress with review feedback`}
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setRejectingTask(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={!rejectFeedback.trim()}
              onClick={handleConfirmReject}
            >
              Send Revision Feedback
            </Button>
          </div>
        }
      >
        <form onSubmit={handleConfirmReject} className="space-y-3 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            Explain what issues need to be resolved before this deliverable can be marked as Completed:
          </p>
          <textarea
            rows="4"
            required
            value={rejectFeedback}
            onChange={(e) => setRejectFeedback(e.target.value)}
            placeholder="e.g. Profiler shows frame drops during zoom in Canvas renderer; please optimize WebGL draw calls before final approval."
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none resize-none"
          />
        </form>
      </Modal>
    </div>
  )
}

export default PmTaskManagementPage
