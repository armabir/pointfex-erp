import React from 'react'
import { Card } from '../common/Card.jsx'
import { Badge } from '../common/Badge.jsx'
import { StatusPill } from '../common/StatusPill.jsx'
import { Button } from '../common/Button.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { formatDate } from '../../utils/formatters.js'
import { FolderGit2, ArrowRight } from 'lucide-react'

export function MyProjectsOverview({ projects }) {
  const { setRoute, setSelectedProjectModal } = useApp()

  return (
    <Card
      title="My Projects"
      icon={FolderGit2}
      action={
        <Button
          variant="ghost"
          size="xs"
          rightIcon={ArrowRight}
          onClick={() => setRoute('projects')}
        >
          View all
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProjectModal(project)}
            className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 hover:bg-slate-50 cursor-pointer transition-all duration-150 group"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <Badge variant="indigo" size="xs">
                  {project.code}
                </Badge>
                <h4 className="font-semibold text-xs text-slate-900 group-hover:text-sky-700 transition-colors truncate">
                  {project.name}
                </h4>
              </div>
              <StatusPill status={project.status} size="sm" />
            </div>

            {/* Clean Progress Bar */}
            <div className="space-y-1.5 mb-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Sprint Progress</span>
                <span className="font-semibold text-slate-800">
                  {project.progress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
              <span>{project.repo?.activeBranch || 'main'}</span>
              <span>Due {formatDate(project.deadline, 'short')}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
