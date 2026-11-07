import { Card } from '../common/Card'
import { Badge } from '../common/Badge'
import { StatusPill } from '../common/StatusPill'
import { Button } from '../common/Button'
import { useApp } from '../../context/AppContext'
import { formatDate } from '../../utils/formatters'
import { FolderGit2, ArrowRight } from 'lucide-react'
import type { DeveloperProject } from '../../hooks/useDeveloperData'

export interface MyProjectsOverviewProps {
  projects: DeveloperProject[]
}

export function MyProjectsOverview({ projects }: MyProjectsOverviewProps) {
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
            className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-all duration-150 group shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <Badge variant="indigo" size="xs">
                  {project.code}
                </Badge>
                <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                  {project.name}
                </h4>
              </div>
              <StatusPill status={project.status} size="sm" />
            </div>

            {/* Clean Progress Bar */}
            <div className="space-y-1.5 mb-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Sprint Progress</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {project.progress}%
                </span>
              </div>
              <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 dark:text-slate-500">
              <span className="font-mono">{project.repo?.activeBranch || 'main'}</span>
              <span>Due {formatDate(project.deadline, 'short')}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

