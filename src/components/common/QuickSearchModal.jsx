import React, { useState, useMemo, useEffect, useRef } from 'react'
import { Search, X, CheckSquare, FolderGit2, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

export function QuickSearchModal({ isOpen, onClose }) {
  const { data, setSelectedTaskModal, setSelectedProjectModal, setRoute } = useApp()
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const inputRef = useRef(null)

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
      <div className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs" onClick={handleClose} />

      <div className="relative w-full max-w-xl bg-white border border-slate-100 rounded-3xl shadow-2xl z-10 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 py-4 border-b border-slate-100 gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 p-1">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-slate-50/50 text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'tasks', label: 'Tasks' },
            { id: 'projects', label: 'Projects' },
            { id: 'members', label: 'Team' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-xl transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white font-medium shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-3 space-y-2">
          {totalResults === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
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
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CheckSquare className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
                      <span className="text-xs text-slate-800 font-medium truncate">
                        {task.title}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600" />
                  </div>
                ))}

              {(activeTab === 'all' || activeTab === 'projects') &&
                searchResults.projects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectModal(proj)
                      handleClose()
                    }}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FolderGit2 className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs text-slate-800 font-medium truncate">
                        {proj.name}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600" />
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
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                        {member.initials}
                      </div>
                      <span className="text-xs text-slate-800 font-medium truncate">
                        {member.name}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600" />
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
