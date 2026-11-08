import React, { useState, useMemo } from 'react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { useCtoData, type TeamWithDetails } from '../../hooks/useCtoData'
import { useApp } from '../../context/AppContext'
import {
  Users,
  Search,
  Zap,
  FolderGit2,
  ShieldCheck,
  UserCheck,
  Plus,
  Edit2,
  CheckCircle2,
} from 'lucide-react'

export function CtoTeamManagementPage() {
  const { teams, developers, projectManagers, projects } = useCtoData()
  const { createTeam, updateTeam, showToast } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSquad, setSelectedSquad] = useState<TeamWithDetails | null>(null)

  // Create Squad Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newSquadName, setNewSquadName] = useState('')
  const [newSquadCode, setNewSquadCode] = useState('')
  const [newSquadFocus, setNewSquadFocus] = useState('')
  const [newPmId, setNewPmId] = useState('')
  const [newLeadDevId, setNewLeadDevId] = useState('')
  const [newMemberIds, setNewMemberIds] = useState<string[]>([])
  const [newProjectIds, setNewProjectIds] = useState<string[]>([])
  const [newVelocity, setNewVelocity] = useState(45)

  // Edit Squad Modal State
  const [editingSquad, setEditingSquad] = useState<TeamWithDetails | null>(null)
  const [editSquadName, setEditSquadName] = useState('')
  const [editSquadCode, setEditSquadCode] = useState('')
  const [editSquadFocus, setEditSquadFocus] = useState('')
  const [editPmId, setEditPmId] = useState('')
  const [editLeadDevId, setEditLeadDevId] = useState('')
  const [editMemberIds, setEditMemberIds] = useState<string[]>([])
  const [editProjectIds, setEditProjectIds] = useState<string[]>([])
  const [editVelocity, setEditVelocity] = useState(45)

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

  const handleOpenEdit = (squad: TeamWithDetails) => {
    setEditingSquad(squad)
    setEditSquadName(squad.name)
    setEditSquadCode(squad.code)
    setEditSquadFocus(squad.focus || '')
    setEditPmId(squad.pmId || '')
    setEditLeadDevId(squad.leadDevId || '')
    setEditMemberIds(squad.memberIds || [])
    setEditProjectIds(squad.projectIds || [])
    setEditVelocity(squad.weeklyVelocity || 45)
  }

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSquadName.trim() || !newSquadCode.trim()) {
      showToast('Squad name and code are required.', 'error')
      return
    }

    createTeam({
      name: newSquadName.trim(),
      code: newSquadCode.trim().toUpperCase(),
      focus: newSquadFocus.trim() || 'General software engineering and delivery',
      pmId: newPmId || undefined,
      leadDevId: newLeadDevId || undefined,
      memberIds: newMemberIds,
      projectIds: newProjectIds,
      weeklyVelocity: Number(newVelocity),
    })

    setIsCreateModalOpen(false)
    setNewSquadName('')
    setNewSquadCode('')
    setNewSquadFocus('')
    setNewMemberIds([])
    setNewProjectIds([])
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSquad) return

    updateTeam(editingSquad.id, {
      name: editSquadName.trim(),
      code: editSquadCode.trim().toUpperCase(),
      focus: editSquadFocus.trim(),
      pmId: editPmId || undefined,
      leadDevId: editLeadDevId || undefined,
      memberIds: editMemberIds,
      projectIds: editProjectIds,
      weeklyVelocity: Number(editVelocity),
    })

    setEditingSquad(null)
  }

  const toggleCreateMember = (devId: string) => {
    setNewMemberIds((prev) =>
      prev.includes(devId) ? prev.filter((id) => id !== devId) : [...prev, devId]
    )
  }

  const toggleCreateProject = (projId: string) => {
    setNewProjectIds((prev) =>
      prev.includes(projId) ? prev.filter((id) => id !== projId) : [...prev, projId]
    )
  }

  const toggleEditMember = (devId: string) => {
    setEditMemberIds((prev) =>
      prev.includes(devId) ? prev.filter((id) => id !== devId) : [...prev, devId]
    )
  }

  const toggleEditProject = (projId: string) => {
    setEditProjectIds((prev) =>
      prev.includes(projId) ? prev.filter((id) => id !== projId) : [...prev, projId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Engineering Squads & Teams
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Company-wide engineering division: {teams.length} autonomous squads, {developers.length} developers, and {projectManagers.length} PMs
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="lime"
            size="sm"
            icon={Plus}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create New Squad
          </Button>
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
            <div className="text-[11px] text-slate-400">Avg Velocity</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              {totalVelocity} pts
            </div>
            <div className="text-[11px] text-slate-400">Total Engineering Capacity</div>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search squads by name, technical focus, PM, or tech lead..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-lime-500"
          />
        </div>
      </div>

      {/* Squad Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeams.map((squad) => {
          const completionRate =
            squad.tasksCount > 0
              ? Math.round((squad.completedTasksCount / squad.tasksCount) * 100)
              : 0

          return (
            <div
              key={squad.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between shadow-2xs group space-y-4"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="indigo" size="xs">
                      {squad.code}
                    </Badge>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {squad.name.split('—')[0]}
                    </span>
                  </div>
                  <Badge variant="emerald" size="xs">
                    {squad.weeklyVelocity || 45} pts/wk
                  </Badge>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {squad.focus}
                </p>

                {/* Leadership Box */}
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                      Project Manager
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      {squad.pm?.avatar ? (
                        <img
                          src={squad.pm.avatar}
                          alt={squad.pm.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] flex items-center justify-center font-bold">
                          {squad.pm?.name?.charAt(0) || 'P'}
                        </div>
                      )}
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">
                        {squad.pm?.name || 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                      Lead Engineer
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      {squad.leadDev?.avatar ? (
                        <img
                          src={squad.leadDev.avatar}
                          alt={squad.leadDev.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-[10px] flex items-center justify-center font-bold">
                          {squad.leadDev?.name?.charAt(0) || 'L'}
                        </div>
                      )}
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] truncate">
                        {squad.leadDev?.name || 'Unassigned'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assigned Projects */}
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Assigned Projects ({squad.projects.length})
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {squad.projects.map((proj) => (
                      <span
                        key={proj.id}
                        className="text-[10px] px-2 py-0.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-mono flex items-center gap-1 border border-indigo-100 dark:border-indigo-800/40"
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

              {/* Footer: Member avatars + Actions */}
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

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Edit2}
                    onClick={() => handleOpenEdit(squad)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="secondary"
                    size="xs"
                    onClick={() => setSelectedSquad(squad)}
                  >
                    Inspect
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Create Squad Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Engineering Squad"
        >
          <form onSubmit={handleSaveCreate} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Squad Name *
                </label>
                <input
                  type="text"
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  placeholder="e.g. Squad Theta — Quantum Services"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Squad Code *
                </label>
                <input
                  type="text"
                  value={newSquadCode}
                  onChange={(e) => setNewSquadCode(e.target.value)}
                  placeholder="e.g. SQ-07"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 uppercase"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Technical Focus & Architecture Responsibility
              </label>
              <textarea
                rows={2}
                value={newSquadFocus}
                onChange={(e) => setNewSquadFocus(e.target.value)}
                placeholder="Core mission and technology focus..."
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Assigned PM
                </label>
                <select
                  value={newPmId}
                  onChange={(e) => setNewPmId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400"
                >
                  <option value="">Unassigned</option>
                  {projectManagers.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Lead Engineer
                </label>
                <select
                  value={newLeadDevId}
                  onChange={(e) => setNewLeadDevId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400"
                >
                  <option value="">Unassigned</option>
                  {developers.map((dev) => (
                    <option key={dev.id} value={dev.id}>
                      {dev.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Weekly Velocity
                </label>
                <input
                  type="number"
                  value={newVelocity}
                  onChange={(e) => setNewVelocity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Assign Projects
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                {projects.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 text-[11px] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={newProjectIds.includes(p.id)}
                      onChange={() => toggleCreateProject(p.id)}
                      className="rounded accent-lime-500"
                    />
                    <span className="truncate">{p.code} — {p.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Assign Dedicated Developers
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                {developers.map((dev) => (
                  <label
                    key={dev.id}
                    className="flex items-center gap-2 text-[11px] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={newMemberIds.includes(dev.id)}
                      onChange={() => toggleCreateMember(dev.id)}
                      className="rounded accent-lime-500"
                    />
                    <span className="truncate">{dev.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="lime"
                size="sm"
                icon={Plus}
              >
                Create Squad
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Squad Modal */}
      {editingSquad && (
        <Modal
          isOpen={!!editingSquad}
          onClose={() => setEditingSquad(null)}
          title={`Edit Squad — ${editingSquad.name}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Squad Name
                </label>
                <input
                  type="text"
                  value={editSquadName}
                  onChange={(e) => setEditSquadName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Squad Code
                </label>
                <input
                  type="text"
                  value={editSquadCode}
                  onChange={(e) => setEditSquadCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 uppercase"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Technical Focus & Scope
              </label>
              <textarea
                rows={2}
                value={editSquadFocus}
                onChange={(e) => setEditSquadFocus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Assigned PM
                </label>
                <select
                  value={editPmId}
                  onChange={(e) => setEditPmId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400"
                >
                  <option value="">Unassigned</option>
                  {projectManagers.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Lead Engineer
                </label>
                <select
                  value={editLeadDevId}
                  onChange={(e) => setEditLeadDevId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400"
                >
                  <option value="">Unassigned</option>
                  {developers.map((dev) => (
                    <option key={dev.id} value={dev.id}>
                      {dev.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Velocity (pts/wk)
                </label>
                <input
                  type="number"
                  value={editVelocity}
                  onChange={(e) => setEditVelocity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Assigned Projects
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                {projects.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 text-[11px] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={editProjectIds.includes(p.id)}
                      onChange={() => toggleEditProject(p.id)}
                      className="rounded accent-lime-500"
                    />
                    <span className="truncate">{p.code} — {p.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Squad Members
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                {developers.map((dev) => (
                  <label
                    key={dev.id}
                    className="flex items-center gap-2 text-[11px] cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={editMemberIds.includes(dev.id)}
                      onChange={() => toggleEditMember(dev.id)}
                      className="rounded accent-lime-500"
                    />
                    <span className="truncate">{dev.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setEditingSquad(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="lime"
                size="sm"
                icon={CheckCircle2}
              >
                Save Squad Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Squad Inspection Modal */}
      {selectedSquad && (
        <Modal
          isOpen={!!selectedSquad}
          onClose={() => setSelectedSquad(null)}
          title={selectedSquad ? `${selectedSquad.name} (${selectedSquad.code}) — Squad Overview` : 'Squad'}
        >
          <div className="space-y-4 text-xs">
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
        </Modal>
      )}
    </div>
  )
}
