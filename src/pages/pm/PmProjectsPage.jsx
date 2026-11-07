import React from 'react'
import { Card } from '../../components/common/Card.jsx'
import { Badge } from '../../components/common/Badge.jsx'
import { StatusPill } from '../../components/common/StatusPill.jsx'
import { Button } from '../../components/common/Button.jsx'
import { usePmData } from '../../hooks/usePmData.js'
import { useApp } from '../../context/AppContext.jsx'
import { formatCurrency, formatDate } from '../../utils/formatters.js'
import {
  FolderGit2,
  GitBranch,
  FileCode,
  ExternalLink,
} from 'lucide-react'

export function PmProjectsPage() {
  const { teamProjects, team } = usePmData()
  const { setSelectedProjectModal } = useApp()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Team Projects & Milestones
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active projects assigned to <span className="font-semibold text-slate-700 dark:text-slate-300">{team?.name || 'Squad'}</span> · Sprint Week {team?.currentSprintWeek || 3} of {team?.totalSprintWeeks || 5}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="sm">
            {teamProjects.length} Managed Projects
          </Badge>
          <Badge variant="emerald" size="sm" dot>
            Milestone 3 Active
          </Badge>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {teamProjects.map((project) => {
          const srs = project.srs
          return (
            <Card
              key={project.id}
              title={project.name}
              subtitle={`Project Code: ${project.code}`}
              icon={FolderGit2}
              action={
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => setSelectedProjectModal(project)}
                >
                  Full Specification
                </Button>
              }
            >
              <div className="space-y-4 text-xs">
                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500 dark:text-slate-400">Sprint Delivery Progress</span>
                    <span className="font-bold text-slate-900 dark:text-white font-display">
                      {project.progress}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-sky-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{project.completedTasksCount || 0} tasks completed</span>
                    <span>{project.inReviewTasksCount || 0} in review</span>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Status</span>
                    <StatusPill status={project.status} size="sm" className="mt-1" />
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Approved Budget</span>
                    <span className="font-bold text-slate-900 dark:text-white block mt-1">
                      {formatCurrency(project.budget)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 block">Deadline</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 block mt-1">
                      {formatDate(project.deadline, 'short')}
                    </span>
                  </div>
                </div>

                {/* Assigned Squad Engineers */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Assigned Engineers ({project.assignedDevs?.length || 4})
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {project.assignedDevs?.map((dev) => (
                      <span
                        key={dev.id}
                        className="px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {dev.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Software Requirements Specification (SRS) info */}
                {srs && (
                  <div className="p-3 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileCode className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900 dark:text-white truncate block">
                          {srs.documentTitle}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                          {srs.version} · {srs.requirementsCount} Requirements
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="subtle"
                      size="xs"
                      rightIcon={ExternalLink}
                      onClick={() => setSelectedProjectModal(project)}
                    >
                      Spec
                    </Button>
                  </div>
                )}

                {/* Repository Details */}
                {project.repo && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 font-mono text-slate-600 dark:text-slate-300">
                      <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                      <span>{project.repo.activeBranch}</span>
                    </div>
                    <span>{project.repo.openPRsCount || 0} open PRs</span>
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default PmProjectsPage
