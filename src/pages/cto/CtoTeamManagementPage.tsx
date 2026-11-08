import { useState, useMemo } from 'react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { useCtoData, type TeamWithDetails } from '../../hooks/useCtoData'
import {
  Users,
  Search,
  Zap,
  FolderGit2,
  ArrowRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'

export function CtoTeamManagementPage() {
  const { teams, developers, projectManagers } = useCtoData()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSquad, setSelectedSquad] = useState<TeamWithDetails | null>(null)

  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        t.name.toLowerCase().includes(q) ||
        (t.focus || '').toLowerCase().includes(q) ||
        t.pm?.name.toLowerCase().includes(q) ||
        t.leadDev?.name.toLowerCase().includes(q)
      )
    })
  }, [teams, searchQuery])

  const totalVelocity = teams.reduce((acc, t) => acc + (t.weeklyVelocity || 40), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Engineering Squads & Teams
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Company-wide engineering division: 6 autonomous squads, 24 developers, and 6 PMs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="sm" dot>
            {totalVelocity} pts Total Velocity
          </Badge>
          <Badge variant="indigo" size="sm">
            {developers.length} Engineers • {projectManagers.length} PMs
          </Badge>
        </div>
      </div>

      {/* Top 4 Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              {teams.length} Squads
            </div>
            <div className="text-[11px] text-slate-400">Autonomous Units</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              {developers.length}
            </div>
            <div className="text-[11px] text-slate-400">Active Engineers</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-lime-50 dark:bg-lime-950/40 text-lime-600 dark:text-lime-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              {Math.round(totalVelocity / (teams.length || 1))} pts
            </div>
            <div className="text-[11px] text-slate-400">Avg Weekly Velocity</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              98.2%
            </div>
            <div className="text-[11px] text-slate-400">Squad Health Index</div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search squads by name, technical focus, PM, or lead engineer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-lime-500"
          />
        </div>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
          >
            Clear
          </button>
        )}
      </div>

      {/* 6 Squad Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTeams.map((squad) => {
          const completionRate =
            squad.tasksCount > 0
              ? Math.round((squad.completedTasksCount / squad.tasksCount) * 100)
              : 0

          return (
            <div
              key={squad.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 flex flex-col justify-between shadow-2xs space-y-4"
            >
              <div>
                {/* Header: Squad Name + Velocity Pill */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {squad.name}
                    </span>
                    <Badge variant="indigo" size="xs">
                      {squad.code}
                    </Badge>
                  </div>
                  <Badge variant="emerald" size="xs" dot>
                    {squad.weeklyVelocity || 40} pts/wk
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-3">
                  {squad.focus}
                </p>

                {/* PM & Lead Dev Row */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 mb-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Project Manager
                    </span>
                    {squad.pm ? (
                      <div className="flex items-center gap-1.5">
                        <img
                          src={squad.pm.avatar}
                          alt={squad.pm.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {squad.pm.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400">Unassigned</span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Tech Lead
                    </span>
                    {squad.leadDev ? (
                      <div className="flex items-center gap-1.5">
                        <img
                          src={squad.leadDev.avatar}
                          alt={squad.leadDev.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {squad.leadDev.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400">Rotating Lead</span>
                    )}
                  </div>
                </div>

                {/* Assigned Projects */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Active Projects ({squad.projects.length})</span>
                    <span>Sprint Delivery</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {squad.projects.map((proj) => (
                      <span
                        key={proj.id}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/40 flex items-center gap-1"
                      >
                        <FolderGit2 className="w-3 h-3" />
                        {proj.code} ({proj.progress}%)
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sprint Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Task Completion</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {squad.completedTasksCount} / {squad.tasksCount} ({completionRate}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-lime-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer: Member avatars + Inspect Button */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center -space-x-1.5 overflow-hidden">
                  {squad.members.map((member) => (
                    <img
                      key={member.id}
                      src={member.avatar}
                      alt={member.name}
                      title={`${member.name} (${member.title})`}
                      className="inline-block w-6 h-6 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
                    />
                  ))}
                  <span className="pl-2 text-[11px] text-slate-400">
                    {squad.members.length} Devs
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="xs"
                  rightIcon={ArrowRight}
                  onClick={() => setSelectedSquad(squad)}
                >
                  Inspect Squad
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Squad Inspection Modal */}
      <Modal
        isOpen={!!selectedSquad}
        onClose={() => setSelectedSquad(null)}
        title={selectedSquad ? `${selectedSquad.name} (${selectedSquad.code}) — Squad Overview` : 'Squad'}
      >
        {selectedSquad && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Mission:</span>{' '}
              <span className="text-slate-600 dark:text-slate-400">{selectedSquad.focus}</span>
            </div>

            {/* Members List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Dedicated Engineers ({selectedSquad.members.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedSquad.members.map((member) => (
                  <div
                    key={member.id}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <h5 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                          {member.name}
                        </h5>
                        <span className="text-[10px] text-slate-400 block">{member.title}</span>
                      </div>
                    </div>
                    {member.id === selectedSquad.leadDev?.id && (
                      <Badge variant="indigo" size="xs">
                        Lead
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Active Projects */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Managed Projects ({selectedSquad.projects.length})
              </h4>
              <div className="space-y-2">
                {selectedSquad.projects.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {p.code} — {p.name}
                      </span>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{p.description}</p>
                    </div>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{p.progress}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setSelectedSquad(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
