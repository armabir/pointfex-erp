import React, { useState } from 'react'
import { Card } from '../../components/common/Card.jsx'
import { Badge } from '../../components/common/Badge.jsx'
import { Button } from '../../components/common/Button.jsx'
import { Modal } from '../../components/common/Modal.jsx'
import { usePmData } from '../../hooks/usePmData.js'
import { useApp } from '../../context/AppContext.jsx'
import {
  Mail,
  ArrowRightLeft,
} from 'lucide-react'

export function PmTeamManagementPage() {
  const { team, developerWorkloads, teamMembers, pm } = usePmData()
  const { reassignTask, setSelectedTaskModal } = useApp()

  const [selectedDevForTasks, setSelectedDevForTasks] = useState(null)
  const [reassigningTask, setReassigningTask] = useState(null)
  const [targetDevId, setTargetDevId] = useState('')

  const handleConfirmReassign = (e) => {
    e.preventDefault()
    if (!reassigningTask || !targetDevId) return
    reassignTask(reassigningTask.id, targetDevId)
    setReassigningTask(null)
    setTargetDevId('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Team Management & Capacity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Resource allocation, active workload, and delivery capacity for <span className="font-semibold text-slate-700 dark:text-slate-300">{team?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="lime" size="sm">
            4 Dedicated Engineers
          </Badge>
          <Badge variant="emerald" size="sm" dot>
            Sprint Velocity: {team?.weeklyVelocity || 42} pts
          </Badge>
        </div>
      </div>

      {/* Squad Overview Card */}
      <Card noPadding>
        <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-800/40">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Squad Mission Focus
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              {team?.focus}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assigned PM: <strong className="text-slate-700 dark:text-slate-200">{pm?.name}</strong> · Sprint Health: <strong className="text-emerald-600 dark:text-emerald-400">On Track</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs shrink-0">
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Active Tasks</span>
              <span className="font-bold text-slate-900 dark:text-white font-display text-base">
                {developerWorkloads.reduce((sum, d) => sum + d.activeTasks, 0)}
              </span>
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Completed Tasks</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-display text-base">
                {developerWorkloads.reduce((sum, d) => sum + d.completedTasks, 0)}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* 4 Developer Squad Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {developerWorkloads.map((member) => (
          <Card key={member.id} noPadding>
            <div className="p-5 space-y-4 text-xs">
              {/* Header: Avatar, Name, Title, Online Status */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white dark:bg-slate-800 flex items-center justify-center font-bold text-sm border border-slate-200/60 dark:border-slate-700 shrink-0 shadow-xs">
                    {member.initials || 'DEV'}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {member.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {member.title}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge
                    variant={member.status === 'online' ? 'emerald' : 'slate'}
                    size="xs"
                    dot
                  >
                    {member.status}
                  </Badge>
                  {member.isOverloaded ? (
                    <Badge variant="rose" size="xs">
                      High Load ({member.activeTasks} active)
                    </Badge>
                  ) : (
                    <Badge variant="emerald" size="xs">
                      Balanced Load
                    </Badge>
                  )}
                </div>
              </div>

              {/* Workload Breakdown Tiles */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block">Active Tasks</span>
                  <span className="text-base font-bold font-display text-slate-900 dark:text-white mt-0.5 block">
                    {member.activeTasks}
                  </span>
                </div>
                <div className="border-x border-slate-200/60 dark:border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Completed</span>
                  <span className="text-base font-bold font-display text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {member.completedTasks}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Quality Score</span>
                  <span className="text-base font-bold font-display text-purple-600 dark:text-purple-400 mt-0.5 block">
                    {member.performance?.overallScore || 94}%
                  </span>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-medium block">Technical Expertise:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {member.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer: Contacts & Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{member.email}</span>
                </div>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => setSelectedDevForTasks(member)}
                >
                  View Tasks ({member.tasks?.length || 0})
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Developer Tasks Inspection Modal */}
      <Modal
        isOpen={Boolean(selectedDevForTasks)}
        onClose={() => setSelectedDevForTasks(null)}
        title={`${selectedDevForTasks?.name}'s Assigned Tasks`}
        subtitle={`${selectedDevForTasks?.title} · ${selectedDevForTasks?.tasks?.length || 0} total tasks`}
        maxWidth="max-w-2xl"
        footer={
          <Button variant="secondary" size="sm" onClick={() => setSelectedDevForTasks(null)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3 text-xs">
          {selectedDevForTasks?.tasks?.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              No tasks currently assigned to this engineer.
            </div>
          ) : (
            selectedDevForTasks?.tasks?.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="indigo" size="xs">
                      {task.project?.code || 'PROJ'}
                    </Badge>
                    <span className="font-semibold text-slate-900 dark:text-white truncate">
                      {task.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span>Status: <strong className="capitalize">{task.status.replace('_', ' ')}</strong></span>
                    <span>•</span>
                    <span>Priority: {task.priority}</span>
                    <span>•</span>
                    <span>Due: {task.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="subtle"
                    size="xs"
                    onClick={() => {
                      setSelectedDevForTasks(null)
                      setSelectedTaskModal(task)
                    }}
                  >
                    Inspect
                  </Button>
                  <Button
                    variant="outline"
                    size="xs"
                    icon={ArrowRightLeft}
                    onClick={() => {
                      setReassigningTask(task)
                      setTargetDevId('')
                    }}
                  >
                    Reassign
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Reassign Task Modal */}
      <Modal
        isOpen={Boolean(reassigningTask)}
        onClose={() => setReassigningTask(null)}
        title="Reassign Task"
        subtitle={`Shift "${reassigningTask?.title}" to another squad engineer`}
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setReassigningTask(null)}>
              Cancel
            </Button>
            <Button
              variant="lime"
              size="sm"
              disabled={!targetDevId}
              onClick={handleConfirmReassign}
            >
              Confirm Reassignment
            </Button>
          </div>
        }
      >
        <form onSubmit={handleConfirmReassign} className="space-y-3 text-xs">
          <label className="block font-medium text-slate-700 dark:text-slate-300">
            Select New Assignee:
          </label>
          <select
            required
            value={targetDevId}
            onChange={(e) => setTargetDevId(e.target.value)}
            className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
          >
            <option value="">-- Choose Team Engineer --</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.title})
              </option>
            ))}
          </select>
        </form>
      </Modal>
    </div>
  )
}

export default PmTeamManagementPage
