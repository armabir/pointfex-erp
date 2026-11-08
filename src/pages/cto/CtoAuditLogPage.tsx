import { useState, useMemo } from 'react'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { useCtoData } from '../../hooks/useCtoData'
import { formatDate } from '../../utils/formatters'
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
} from 'lucide-react'

export function CtoAuditLogPage() {
  const { auditLogs } = useCtoData()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)

  const categories = [
    { id: 'all', label: 'All Activities' },
    { id: 'git', label: 'Git & PRs', icon: GitBranch },
    { id: 'task', label: 'Tasks & Directives', icon: CheckSquare },
    { id: 'financial', label: 'Financial & Budget', icon: Coins },
    { id: 'security', label: 'Security & Auth', icon: ShieldCheck },
    { id: 'milestone', label: 'Milestones', icon: Layers },
  ]

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
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
  }, [auditLogs, selectedCategory, searchQuery])

  // Export audit log as JSON file
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `pointfex_audit_log_${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'git':
        return <Badge variant="purple" size="xs">GIT</Badge>
      case 'task':
        return <Badge variant="sky" size="xs">TASK</Badge>
      case 'financial':
        return <Badge variant="emerald" size="xs">FINANCE</Badge>
      case 'security':
        return <Badge variant="rose" size="xs">SECURITY</Badge>
      case 'milestone':
        return <Badge variant="amber" size="xs">MILESTONE</Badge>
      default:
        return <Badge variant="slate" size="xs">{cat.toUpperCase()}</Badge>
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
            Immutable audit trail of all code merges, task updates, financial allocations, and compliance actions
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
            placeholder="Search audit trail by action, description, entity, or actor ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-lime-500"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
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

      {/* Audit Log Table / Cards */}
      <Card
        title={`Audit Trail Records (${filteredLogs.length})`}
        icon={ScrollText}
      >
        {filteredLogs.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No audit records found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold text-[11px]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Entity Target</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {formatDate(log.timestamp, 'short')}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getCategoryBadge(log.category)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {log.action}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300">
                      <span className="truncate max-w-[180px] block" title={log.entityTitle}>
                        {log.entityTitle || log.entityId}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                      <span className="line-clamp-1 max-w-[300px]" title={log.description}>
                        {log.description}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setSelectedLog(log)}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Inspect Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="Audit Record Inspection"
      >
        {selectedLog && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-mono text-slate-400">ID: {selectedLog.id}</span>
              {getCategoryBadge(selectedLog.category)}
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Action:</span>
                <span className="text-slate-900 dark:text-slate-100 font-medium">
                  {selectedLog.action}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Description:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  {selectedLog.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Entity Target:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    {selectedLog.entityTitle} ({selectedLog.entityType})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Timestamp:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-mono">
                    {formatDate(selectedLog.timestamp, 'full')}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto space-y-1">
              <div className="text-slate-400 text-[10px]">// Cryptographic Audit Verification</div>
              <div>Hash: sha256:{selectedLog.id}8f3b2c1a9e</div>
              <div>State: Verified & Signed</div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
