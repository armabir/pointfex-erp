import { useState, useMemo } from 'react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { StatusPill } from '../../components/common/StatusPill'
import { useCtoData } from '../../hooks/useCtoData'
import { useApp } from '../../context/AppContext'
import type { EnrichedProject } from '../../types'
import {
  Search,
  Settings2,
  Star,
  GitFork,
  GitPullRequest,
  FileText,
  Save,
} from 'lucide-react'

export function CtoProjectsReposPage() {
  const { projects, repositories } = useCtoData()
  const { setSelectedProjectModal, updateRepoConfig, showToast } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'planning'>('all')

  // Config Modal State
  const [editingProject, setEditingProject] = useState<EnrichedProject | null>(null)
  const [repoUrl, setRepoUrl] = useState('')
  const [defaultBranch, setDefaultBranch] = useState('main')
  const [srsUrl, setSrsUrl] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const nameMatch = p.name.toLowerCase().includes(q)
        const codeMatch = p.code.toLowerCase().includes(q)
        const descMatch = p.description?.toLowerCase().includes(q)
        const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(q))
        if (!nameMatch && !codeMatch && !descMatch && !tagMatch) return false
      }
      return true
    })
  }, [projects, statusFilter, searchQuery])

  const openConfigModal = (p: EnrichedProject) => {
    const repo = repositories.find((r) => r.projectId === p.id)
    setEditingProject(p)
    setRepoUrl(repo?.url || p.repositoryUrl || '')
    setDefaultBranch(repo?.defaultBranch || 'main')
    setSrsUrl(p.srs?.documentUrl || '')
    setTagsInput(p.tags?.join(', ') || '')
  }

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject) return

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    updateRepoConfig(editingProject.id, {
      repositoryUrl: repoUrl.trim(),
      defaultBranch: defaultBranch.trim(),
      srsUrl: srsUrl.trim(),
      tags,
    })

    showToast('Repository and architecture configuration saved.', 'success')
    setEditingProject(null)
  }

  const totalOpenPRs = repositories.reduce((acc, r) => acc + (r.openPRsCount || 0), 0)
  const totalStars = repositories.reduce((acc, r) => acc + (r.stars || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Projects & Code Repositories
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Architecture overview, GitHub repositories, default branches, and SRS documentation across all 12 projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple" size="sm">
            <GitPullRequest className="w-3.5 h-3.5 mr-1" />
            {totalOpenPRs} Open PRs
          </Badge>
          <Badge variant="amber" size="sm">
            <Star className="w-3.5 h-3.5 mr-1" />
            {totalStars} GitHub Stars
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by name, code, description, or stack tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-lime-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'all'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({projects.length})
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'active'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Active Sprints
          </button>
          <button
            onClick={() => setStatusFilter('planning')}
            className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              statusFilter === 'planning'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Planning
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredProjects.map((project) => {
          const repo = repositories.find((r) => r.projectId === project.id)

          return (
            <div
              key={project.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 flex flex-col justify-between shadow-2xs group space-y-3"
            >
              <div>
                {/* Top Row: Code Badge & Status Pill */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="indigo" size="xs">
                    {project.code}
                  </Badge>
                  <StatusPill status={project.status} size="sm" />
                </div>

                {/* Title */}
                <h4
                  onClick={() => setSelectedProjectModal(project)}
                  className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors cursor-pointer truncate mb-1"
                >
                  {project.name}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {project.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Sprint Progress</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-sky-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                {/* Repository Details Box */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-600 dark:text-slate-300 truncate max-w-[160px]">
                      {repo?.name || `${project.code.toLowerCase()}-core`}
                    </span>
                    <span className="font-mono text-[10px] bg-slate-200/80 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                      {repo?.defaultBranch || 'main'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500" />
                      {repo?.stars || 128}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3 text-slate-400" />
                      {repo?.forks || 24}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitPullRequest className="w-3 h-3 text-purple-500" />
                      {repo?.openPRsCount || 1} PRs
                    </span>
                  </div>

                  {/* Tech Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                {project.srs ? (
                  <a
                    href={project.srs.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    <FileText className="w-3 h-3" />
                    SRS Docs
                  </a>
                ) : (
                  <span className="text-[11px] text-slate-400">No SRS linked</span>
                )}

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Settings2}
                    onClick={() => openConfigModal(project)}
                  >
                    Configure
                  </Button>
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => setSelectedProjectModal(project)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Configure Repository Modal */}
      <Modal
        isOpen={!!editingProject}
        onClose={() => setEditingProject(null)}
        title={editingProject ? `Configure Repository: ${editingProject.name}` : 'Configure'}
      >
        <form onSubmit={handleSaveConfig} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Repository URL
            </label>
            <input
              type="url"
              required
              placeholder="https://github.com/pointfex/repo"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Default Production Branch
              </label>
              <input
                type="text"
                required
                placeholder="main"
                value={defaultBranch}
                onChange={(e) => setDefaultBranch(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                SRS Document URL
              </label>
              <input
                type="url"
                placeholder="https://docs.pointfex.com/srs"
                value={srsUrl}
                onChange={(e) => setSrsUrl(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tech Stack Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="React, TypeScript, Go, Redis, Docker"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setEditingProject(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={Save}>
              Save Configuration
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
