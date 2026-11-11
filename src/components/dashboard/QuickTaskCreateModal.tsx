import React, { useState } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { useApp } from '../../context/AppContext'
import { Plus } from 'lucide-react'
import type { TaskPriority } from '../../types'

export interface QuickTaskCreateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickTaskCreateModal({ isOpen, onClose }: QuickTaskCreateModalProps) {
  const { data, createTask, currentUser, currentDevId } = useApp()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState('proj_01')
  const [priority, setPriority] = useState<TaskPriority>('high')
  const [dueDate, setDueDate] = useState('2026-11-18')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const assigneeId = currentUser?.id || currentDevId
    createTask({
      title: title.trim(),
      description: description.trim() || 'No detailed description provided.',
      projectId: data.projects.some((p) => p.id === projectId)
        ? projectId
        : data.projects[0]?.id || 'proj_01',
      assigneeId,
      priority,
      dueDate,
      estimatedHours: 6,
      tags: ['Sprint3'],
    })

    onClose()
    setTitle('')
    setDescription('')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Task"
      subtitle="Add a deliverable to your active queue"
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="lime" size="sm" icon={Plus} onClick={handleSubmit}>
            Create Task
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-700 font-medium mb-1.5">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Implement WebSocket reconnection metrics"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-medium mb-1.5">Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
          >
            {data.projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.code})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-medium mb-1.5">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1.5">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-slate-400"
            />
          </div>
        </div>
      </form>
    </Modal>
  )
}
