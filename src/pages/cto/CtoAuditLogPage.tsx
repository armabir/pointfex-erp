import { useState, useMemo, useCallback } from 'react'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { useCtoData } from '../../hooks/useCtoData'
import { useApp } from '../../context/AppContext'
import type { ActivityLog } from '../../types'
import {
  ScrollText,
  Search,
  Download,
  ShieldCheck,
  GitBranch,
  CheckSquare,
  Coins,
  Layers,
  ArrowUpDown,
  User,
} from 'lucide-react'

export function CtoAuditLogPage() {
  const { auditLogs } = useCtoData()
  const { data } = useApp()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'actor' | 'category'>('newest')

  const categories = [
    { id: 'all', label: 'All Activities' },
    { id: 'project', label: 'Projects & Repos', icon: GitBranch },
    { id: 'task', label: 'Tasks & Directives', icon: CheckSquare },
    { id: 'financial', label: 'Finance & Budget', icon: Coins },
    { id: 'user', label: 'Personnel & Teams', icon: User },
    { id: 'security', label: 'Security & Auth', icon: ShieldCheck },
    { id: 'milestone', label: 'Milestones', icon: Layers },
  ]

  // Map user ID to user name & role
  const getUserInfo = useCallback((userId?: string) => {
    if (!userId) return { name: 'System Event', role: 'System' }
    const found = data.users.find((u) => u.id === userId)
    if (found) return { name: found.name, role: found.role.toUpperCase(), avatar: found.avatar }
    if (userId.includes('cto')) return { name: 'Dr. Arthur Sterling', role: 'CTO' }
    if (userId.includes('ceo')) return { name: 'Victoria Sterling-Fox', role: 'CEO' }
    if (userId.includes('cfo')) return { name: 'Vincent Gallagher', role: 'CFO' }
    if (userId.includes('cpo')) return { name: 'Amara Okafor', role: 'CPO' }
    return { name: userId, role: 'Personnel' }
  }, [data.users])

  const processedLogs = useMemo(() => {
    let result = auditLogs.filter((log) => {
      if (selectedCategory !== 'all' && log.category !== selectedCategory) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = log.entityTitle?.toLowerCase().includes(q)
        const matchDesc = log.description?.toLowerCase().includes(q)
        const matchAction = log.action?.toLowerCase().includes(q)
        const matchUser = log.userId?.toLowerCase().includes(q)
        if (!matchTitle && !matchDesc && !matchAction && !matchUser) return false
      }
      return true
    })

    return result.sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.id || '').localeCompare(a.id || '')
      }
      if (sortBy === 'oldest') {
        return (a.id || '').localeCompare(b.id || '')
      }
      if (sortBy === 'actor') {
        const nameA = getUserInfo(a.userId).name
        const nameB = getUserInfo(b.userId).name
        return nameA.localeCompare(nameB)
      }
      if (sortBy === 'category') {
        return (a.category || '').localeCompare(b.category || '')
      }
      return 0
    })
  }, [auditLogs, selectedCategory, searchQuery, sortBy, getUserInfo])

  // Export audit log as JSON file
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(processedLogs, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `pointfex_audit_log_${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'project':
      case 'git':
        return <Badge variant="purple" size="xs">PROJECT / GIT</Badge>
      case 'task':
        return <Badge variant="sky" size="xs">TASK</Badge>
      case 'financial':
        return <Badge variant="emerald" size="xs">FINANCE</Badge>
      case 'user':
        return <Badge variant="lime" size="xs">PERSONNEL</Badge>
      case 'security':
        return <Badge variant="rose" size="xs">SECURITY</Badge>
      case 'milestone':
        return <Badge variant="amber" size="xs">MILESTONE</Badge>
      default:
        return <Badge variant="slate" size="xs">{cat?.toUpperCase() || 'GENERAL'}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Company-Wide Audit Log
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Immutable system audit trail tracking all actions taken across Pointfex ERP by all personnel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExportJson}
          >
            Export Audit (JSON)
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit trail by action, description, entity, or actor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-lime-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-xl font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 text-xs">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
          <ArrowUpDown className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
          <span>Sort Audit Log:</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setSortBy('newest')}
            className={`px-3 py-1 rounded-xl font-medium transition-colors cursor-pointer ${
              sortBy === 'newest'
                ? 'bg-lime-500 text-slate-950 font-bold shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Newest First
          </button>
          <button
            type="button"
            onClick={() => setSortBy('oldest')}
            className={`px-3 py-1 rounded-xl font-medium transition-colors cursor-pointer ${
              sortBy === 'oldest'
                ? 'bg-lime-500 text-slate-950 font-bold shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Oldest First
          </button>
          <button
            type="button"
            onClick={() => setSortBy('actor')}
            className={`px-3 py-1 rounded-xl font-medium transition-colors cursor-pointer ${
              sortBy === 'actor'
                ? 'bg-lime-500 text-slate-950 font-bold shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sort by Actor
          </button>
          <button
            type="button"
            onClick={() => setSortBy('category')}
            className={`px-3 py-1 rounded-xl font-medium transition-colors cursor-pointer ${
              sortBy === 'category'
                ? 'bg-lime-500 text-slate-950 font-bold shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Sort by Category
          </button>
        </div>
      </div>

      {/* Audit Log Table / Cards */}
      <Card
        title={`Audit Trail Records (${processedLogs.length})`}
        icon={ScrollText}
      >
        {processedLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No audit records found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold text-[11px]">
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Action By</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Entity Target</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {processedLogs.map((log) => {
                  const actor = getUserInfo(log.userId)

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {log.timestamp || 'Just now'}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {actor.avatar && (
                            <img
                              src={actor.avatar}
                              alt={actor.name}
                              className="w-5 h-5 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                          )}
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
                              {actor.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {actor.role}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {getCategoryBadge(log.category)}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                        <span className="truncate max-w-[160px] block" title={log.entityTitle}>
                          {log.entityTitle || log.entityId}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        <span className="line-clamp-1 max-w-[260px]" title={log.description}>
                          {log.description}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => setSelectedLog(log)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Log Detail Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`Audit Record — ${selectedLog.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[11px]">{selectedLog.id}</span>
                {getCategoryBadge(selectedLog.category)}
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {selectedLog.action}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedLog.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                  Action Taken By
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block mt-1">
                  {getUserInfo(selectedLog.userId).name}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {getUserInfo(selectedLog.userId).role} ({selectedLog.userId})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                  Timestamp
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block mt-1">
                  {selectedLog.timestamp || 'Just now'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                  Target Entity Type
                </span>
                <span className="font-mono text-slate-700 dark:text-slate-300 block mt-1 uppercase">
                  {selectedLog.entityType || 'SYSTEM'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">
                  Target Entity Title
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 block mt-1 truncate">
                  {selectedLog.entityTitle || selectedLog.entityId || 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
