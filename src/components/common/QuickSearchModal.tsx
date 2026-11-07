import { useState, useMemo, useEffect, useRef } from 'react'
import { Search, X, CheckSquare, FolderGit2, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export interface QuickSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickSearchModal({ isOpen, onClose }: QuickSearchModalProps) {
  const { data, setSelectedTaskModal, setSelectedProjectModal, setRoute } = useApp()
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'tasks' | 'projects' | 'members'>('all')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    setQuery('')
    onClose()
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return {
        tasks: data.tasks.slice(0, 3),
        projects: data.projects.slice(0, 2),
        members: data.users.filter((u) => u.teamId === 'team_01').slice(0, 3),
      }
    }

    const tasks = data.tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags?.some((tag) => tag.toLowerCase().includes(q))
    )

    const projects = data.projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q)
    )

    const members = data.users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.title.toLowerCase().includes(q)
    )

    return { tasks, projects, members }
  }, [query, data])

  const totalResults =
    searchResults.tasks.length + searchResults.projects.length + searchResults.members.length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-20">
      <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/75 backdrop-blur-xs" onClick={handleClose} />

      <div className="relative w-full max-w-xl bg-white dark:bg-[#0f1422] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl z-10 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-slate-100 dark:border-slate-800 gap-3 bg-white dark:bg-[#0f1422]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#131a2b] text-xs">
          {[
            { id: 'all' as const, label: 'All' },
            { id: 'tasks' as const, label: 'Tasks' },
            { id: 'projects' as const, label: 'Projects' },
            { id: 'members' as const, label: 'Team' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-xl transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white dark:bg-lime-400 dark:text-slate-950 font-medium shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-2">
          {totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
              No results found.
            </div>
          ) : (
            <>
              {(activeTab === 'all' || activeTab === 'tasks') &&
                searchResults.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      setSelectedTaskModal(task)
                      handleClose()
                    }}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#131a2b] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-lime-400">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-900 dark:text-white truncate">
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-2">
                          <span>{task.priority}</span>
                          <span>•</span>
                          <span>{task.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                  </div>
                ))}

              {(activeTab === 'all' || activeTab === 'projects') &&
                searchResults.projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => {
                      setSelectedProjectModal(project)
                      handleClose()
                    }}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#131a2b] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-lime-400">
                        <FolderGit2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-900 dark:text-white truncate">
                          {project.name}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">
                          {project.code} • {project.progress}% completed
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                  </div>
                ))}

              {(activeTab === 'all' || activeTab === 'members') &&
                searchResults.members.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => {
                      setRoute('team')
                      handleClose()
                    }}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-[#131a2b] cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-white dark:bg-lime-400 dark:text-slate-950 flex items-center justify-center font-bold text-xs">
                        {member.initials}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-slate-900 dark:text-white truncate">
                          {member.name}
                        </div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">{member.title}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

