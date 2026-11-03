import React, { useState } from 'react'
import { Modal } from './Modal.jsx'
import { Badge } from './Badge.jsx'
import { StatusPill } from './StatusPill.jsx'
import { Button } from './Button.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { formatDate } from '../../utils/formatters.js'
import {
  Calendar,
  Clock,
  CheckCircle2,
  Send,
} from 'lucide-react'

export function TaskDetailModal({ task, isOpen, onClose }) {
  const { data, updateTaskStatus, resolvers, showToast } = useApp()
  const [newComment, setNewComment] = useState('')

  if (!task) return null

  // Always read freshest task state from data
  const currentTask = data.tasks.find((t) => t.id === task.id) || task

  const project = resolvers.getProject(currentTask.projectId)
  const comments = data.comments.filter((c) => c.taskId === currentTask.id)

  const handleStatusChange = (newStatus) => {
    updateTaskStatus(currentTask.id, newStatus)
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    data.comments.push({
      id: `comm_${Date.now()}`,
      taskId: currentTask.id,
      authorId: 'user_dev_01',
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    })
    setNewComment('')
    showToast('Comment posted', 'success')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentTask.title}
      subtitle={project?.name || 'Project'}
      maxWidth="max-w-xl"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
          {currentTask.status !== 'completed' ? (
            <Button
              variant="lime"
              size="sm"
              icon={CheckCircle2}
              onClick={() => {
                handleStatusChange('completed')
                onClose()
              }}
            >
              Mark Done
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleStatusChange('in_progress')}
            >
              Reopen
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Status & Priority Row */}
        <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={currentTask.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-white text-slate-800 border border-slate-200 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-slate-400 cursor-pointer font-medium"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="in_review">In Review</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
            <StatusPill status={currentTask.status} size="sm" />
          </div>

          <Badge
            variant={
              currentTask.priority === 'urgent'
                ? 'rose'
                : currentTask.priority === 'high'
                ? 'amber'
                : 'slate'
            }
          >
            {currentTask.priority}
          </Badge>
        </div>

        {/* Due Date & Hours */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-[11px] text-slate-400">Due Date</div>
              <div className="font-medium text-slate-800">{formatDate(currentTask.dueDate)}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <div>
              <div className="text-[11px] text-slate-400">Time</div>
              <div className="font-medium text-slate-800">{currentTask.loggedHours}h / {currentTask.estimatedHours}h logged</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Description
          </div>
          <p className="text-slate-700 bg-slate-50/70 p-3 rounded-2xl border border-slate-100 leading-relaxed">
            {currentTask.description}
          </p>
        </div>

        {/* Discussion / Comments */}
        <div>
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Notes & Comments ({comments.length})
          </div>

          <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
            {comments.map((comm) => {
              const author = resolvers.getUser(comm.authorId)
              return (
                <div
                  key={comm.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">
                      {author?.name || 'Teammate'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {formatDate(comm.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-normal">{comm.content}</p>
                </div>
              )
            })}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a reply..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-400"
            />
            <Button type="submit" variant="primary" size="sm" icon={Send}>
              Reply
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  )
}
