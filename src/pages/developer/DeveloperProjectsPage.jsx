import React from 'react'
import { Card } from '../../components/common/Card.jsx'
import { StatusPill } from '../../components/common/StatusPill.jsx'
import { Button } from '../../components/common/Button.jsx'
import { useDeveloperData } from '../../hooks/useDeveloperData.js'
import { useApp } from '../../context/AppContext.jsx'
import { formatCurrency, formatDate } from '../../utils/formatters.js'
import { FolderGit2, GitBranch } from 'lucide-react'

export function DeveloperProjectsPage() {
  const { devProjects } = useDeveloperData()
  const { setSelectedProjectModal } = useApp()

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            My Projects
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active projects assigned to Team 1
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {devProjects.map((project) => (
          <Card
            key={project.id}
            title={project.name}
            icon={FolderGit2}
            action={
              <Button
                variant="secondary"
                size="xs"
                onClick={() => setSelectedProjectModal(project)}
              >
                Details
              </Button>
            }
          >
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                {project.description}
              </p>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-semibold text-slate-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-sky-500 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Status</span>
                  <StatusPill status={project.status} size="sm" className="mt-1" />
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Budget</span>
                  <span className="font-semibold text-slate-800 mt-1 block">
                    {formatCurrency(project.budget)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Due</span>
                  <span className="font-medium text-slate-800 mt-1 block">
                    {formatDate(project.deadline, 'short')}
                  </span>
                </div>
              </div>

              {project.repo && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-slate-600 font-mono text-[11px]">
                  <div className="flex items-center gap-1.5 truncate">
                    <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="truncate">{project.repo.activeBranch}</span>
                  </div>
                  <span>{project.repo.openPRsCount} PRs</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
