import React from 'react'
import { Modal } from './Modal.jsx'
import { Badge } from './Badge.jsx'
import { Button } from './Button.jsx'
import { StatusPill } from './StatusPill.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { formatCurrency, formatDate } from '../../utils/formatters.js'
import { GitBranch, Calendar } from 'lucide-react'

export function ProjectDetailModal({ project, isOpen, onClose }) {
  const { data, resolvers } = useApp()

  if (!project) return null

  const repo = project.repoId ? resolvers.getRepo(project.repoId) : null
  const milestones = data.milestones.filter((m) => m.projectId === project.id)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="sm">
            {project.code}
          </Badge>
          <span>{project.name}</span>
        </div>
      }
      subtitle={`Sprint Week ${project.currentWeek || 3} of ${project.totalWeeks || 5}`}
      maxWidth="max-w-xl"
      footer={
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Progress Card */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <StatusPill status={project.status} />
            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Due {formatDate(project.deadline, 'short')}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500">Progress</span>
              <span className="font-semibold text-slate-900">{project.progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-sky-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-600 leading-relaxed bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100">
          {project.description}
        </p>

        {/* Repository details */}
        {repo && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
              <span>{repo.activeBranch}</span>
            </div>
            <span>{repo.openPRsCount} open PRs</span>
          </div>
        )}

        {/* Sprint Milestones */}
        {milestones.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Milestones
            </div>
            <div className="space-y-1.5">
              {milestones.map((ms) => (
                <div
                  key={ms.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 border border-slate-100"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Badge variant={ms.status === 'completed' ? 'emerald' : 'slate'} size="xs">
                      Week {ms.sprintWeek}
                    </Badge>
                    <span className="text-slate-800 font-medium truncate">{ms.title}</span>
                  </div>
                  <span className="font-medium text-slate-600">{formatCurrency(ms.payoutAmount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
