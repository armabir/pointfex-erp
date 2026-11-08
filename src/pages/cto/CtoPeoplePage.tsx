import React, { useState, useMemo } from 'react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { useCtoData } from '../../hooks/useCtoData'
import { useApp } from '../../context/AppContext'
import type { User, UserRole } from '../../types'
import {
  Search,
  Clock,
  Edit2,
  Users,
  CheckCircle2,
} from 'lucide-react'

export function CtoPeoplePage() {
  const { tasks, teams } = useCtoData()
  const { data, updateUser, showToast } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'developer' | 'pm' | 'executive'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Edit Member Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editRole, setEditRole] = useState<UserRole>('developer')
  const [editTeamId, setEditTeamId] = useState('')
  const [editTitle, setEditTitle] = useState('')
  const [editSkills, setEditSkills] = useState('')

  const allUsers = data.users

  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      if (roleFilter === 'developer' && u.role !== 'developer') return false
      if (roleFilter === 'pm' && u.role !== 'pm') return false
      if (roleFilter === 'executive' && ['developer', 'pm'].includes(u.role)) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const nameMatch = u.name.toLowerCase().includes(q)
        const titleMatch = u.title.toLowerCase().includes(q)
        const emailMatch = u.email.toLowerCase().includes(q)
        const skillMatch = u.skills?.some((s) => s.toLowerCase().includes(q))
        if (!nameMatch && !titleMatch && !emailMatch && !skillMatch) return false
      }
      return true
    })
  }, [allUsers, roleFilter, searchQuery])

  const getUserTasks = (userId: string) => {
    return tasks.filter((t) => t.assigneeId === userId)
  }

  const getUserTeam = (teamId?: string) => {
    if (!teamId) return null
    return teams.find((t) => t.id === teamId)
  }

  const handleOpenEdit = (user: User) => {
    setEditingUser(user)
    setEditRole(user.role)
    setEditTeamId(user.teamId || '')
    setEditTitle(user.title)
    setEditSkills(user.skills?.join(', ') || '')
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    const skillsArray = editSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    updateUser(editingUser.id, {
      role: editRole,
      teamId: editTeamId || undefined,
      title: editTitle.trim() || editingUser.title,
      skills: skillsArray,
    })

    showToast(`Updated personnel record for ${editingUser.name}`, 'success')
    setEditingUser(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Engineering & Personnel Directory
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="sm">
            {allUsers.length} Total Personnel
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, title, skill tag (e.g. Rust, React, AWS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-lime-500"
          />
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
              roleFilter === 'all'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({allUsers.length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('developer')}
            className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
              roleFilter === 'developer'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Developers ({allUsers.filter((u) => u.role === 'developer').length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('pm')}
            className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
              roleFilter === 'pm'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Project Managers ({allUsers.filter((u) => u.role === 'pm').length})
          </button>
          <button
            type="button"
            onClick={() => setRoleFilter('executive')}
            className={`px-3 py-1 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
              roleFilter === 'executive'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            C-Suite ({allUsers.filter((u) => !['developer', 'pm'].includes(u.role)).length})
          </button>
        </div>
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const team = getUserTeam(user.teamId)
          const activeTasks = getUserTasks(user.id)

          return (
            <div
              key={user.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 flex flex-col justify-between shadow-2xs group space-y-3"
            >
              <div>
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <span
                      className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 absolute -bottom-0.5 -right-0.5"
                      title="Active in organization"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4
                        onClick={() => setSelectedUser(user)}
                        className="font-bold text-xs text-slate-900 dark:text-slate-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors cursor-pointer truncate"
                      >
                        {user.name}
                      </h4>
                      <Badge
                        variant={
                          user.role === 'pm'
                            ? 'purple'
                            : user.role === 'developer'
                            ? 'sky'
                            : 'lime'
                        }
                        size="xs"
                      >
                        {user.role.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-1">
                      {user.title}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      <Users className="w-3 h-3" />
                      <span className="truncate">{team?.name?.split('—')[0]?.trim() || 'No Squad Assigned'}</span>
                    </div>
                  </div>
                </div>

                {/* Skills tags */}
                {user.skills && user.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-3">
                    {user.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700/60"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.skills.length > 4 && (
                      <span className="text-[10px] text-slate-400 self-center">
                        +{user.skills.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {activeTasks.length} Active Tasks
                </span>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Edit2}
                    onClick={() => handleOpenEdit(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => setSelectedUser(user)}
                  >
                    Inspect
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Edit Member Modal */}
      {editingUser && (
        <Modal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          title={`Edit Personnel — ${editingUser.name}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <img
                src={editingUser.avatar}
                alt={editingUser.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{editingUser.name}</div>
                <div className="text-[11px] text-slate-400 font-mono">{editingUser.email}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Role Assignment
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400"
                >
                  <option value="developer">Developer</option>
                  <option value="pm">Project Manager (PM)</option>
                  <option value="cto">CTO</option>
                  <option value="ceo">CEO</option>
                  <option value="cfo">CFO</option>
                  <option value="cpo">CPO</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Assigned Squad
                </label>
                <select
                  value={editTeamId}
                  onChange={(e) => setEditTeamId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400"
                >
                  <option value="">No Squad (Floating)</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Job Title
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="e.g. Senior Full-Stack Engineer"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Skills / Competencies (comma separated)
              </label>
              <input
                type="text"
                value={editSkills}
                onChange={(e) => setEditSkills(e.target.value)}
                placeholder="e.g. React, TypeScript, Rust, Docker"
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="lime"
                size="sm"
                icon={CheckCircle2}
              >
                Save Member Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* User Inspect Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={selectedUser ? `${selectedUser.name} — Profile & Workload` : 'Profile'}
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {selectedUser.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedUser.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="indigo" size="xs">
                    {selectedUser.role.toUpperCase()}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-mono">{selectedUser.email}</span>
                </div>
              </div>
            </div>

            {selectedUser.bio && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                {selectedUser.bio}
              </p>
            )}

            {/* Skills */}
            {selectedUser.skills && selectedUser.skills.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Core Competencies & Stack
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUser.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Assigned Tasks */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Current Assigned Deliverables ({getUserTasks(selectedUser.id).length})
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {getUserTasks(selectedUser.id).length === 0 ? (
                  <span className="text-xs text-slate-400">No active tasks assigned.</span>
                ) : (
                  getUserTasks(selectedUser.id).map((task) => (
                    <div
                      key={task.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[280px]">
                        {task.title}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase">
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
