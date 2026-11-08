import { useState, useMemo } from 'react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { useCtoData } from '../../hooks/useCtoData'
import { USERS } from '../../data/users'
import type { User } from '../../types'
import {
  Search,
  Clock,
  ChevronRight,
} from 'lucide-react'

export function CtoPeoplePage() {
  const { tasks, teams } = useCtoData()

  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'developer' | 'pm' | 'executive'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Map users with their teams and active tasks count
  const allUsers = useMemo(() => {
    return Object.values(USERS)
  }, [])

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

  // Get active tasks for a user
  const getUserTasks = (userId: string) => {
    return tasks.filter((t) => t.assigneeId === userId)
  }

  // Get team for a user
  const getUserTeam = (teamId?: string) => {
    if (!teamId) return null
    return teams.find((t) => t.id === teamId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Engineering & Personnel Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full directory of 24 software engineers, 6 project managers, and executive leadership
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="sm">
            {allUsers.length} Team Members
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
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              roleFilter === 'all'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({allUsers.length})
          </button>
          <button
            onClick={() => setRoleFilter('developer')}
            className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              roleFilter === 'developer'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Engineers (24)
          </button>
          <button
            onClick={() => setRoleFilter('pm')}
            className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              roleFilter === 'pm'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            PMs (6)
          </button>
          <button
            onClick={() => setRoleFilter('executive')}
            className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              roleFilter === 'executive'
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Leadership (4)
          </button>
        </div>
      </div>

      {/* Grid of Users */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredUsers.map((user) => {
          const userTasks = getUserTasks(user.id)
          const activeTasks = userTasks.filter((t) => t.status !== 'completed')
          const userTeam = getUserTeam(user.teamId)

          return (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 cursor-pointer flex flex-col justify-between shadow-2xs group space-y-3"
            >
              <div>
                {/* Avatar and Role */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 absolute -bottom-0.5 -right-0.5" />
                  </div>
                  <Badge
                    variant={
                      user.role === 'developer'
                        ? 'indigo'
                        : user.role === 'pm'
                        ? 'purple'
                        : 'lime'
                    }
                    size="xs"
                  >
                    {user.role.toUpperCase()}
                  </Badge>
                </div>

                {/* Name & Title */}
                <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                  {user.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-2">
                  {user.title}
                </p>

                {/* Squad Pill */}
                {userTeam && (
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-2">
                    Squad: <span className="font-semibold text-slate-700 dark:text-slate-300">{userTeam.name}</span>
                  </div>
                )}

                {/* Skills tags */}
                {user.skills && user.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {user.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        {skill}
                      </span>
                    ))}
                    {user.skills.length > 3 && (
                      <span className="text-[10px] text-slate-400">+{user.skills.length - 3}</span>
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
                <span className="text-lime-600 dark:text-lime-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                  View <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* User Detail Modal */}
      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title={selectedUser ? `${selectedUser.name} — Profile & Workload` : 'Profile'}
      >
        {selectedUser && (
          <div className="space-y-4">
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
        )}
      </Modal>
    </div>
  )
}
