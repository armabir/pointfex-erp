import { useState } from 'react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { useCtoData } from '../../hooks/useCtoData'
import { useApp } from '../../context/AppContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import type { ConsultancyRequest } from '../../types'
import {
  Briefcase,
  Clock,
  Coins,
  CheckCircle2,
} from 'lucide-react'

export function CtoConsultancyPage() {
  const { consultancyRequests, teams } = useCtoData()
  const { updateConsultancyStatus, showToast } = useApp()

  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedReq, setSelectedReq] = useState<ConsultancyRequest | null>(null)

  // Manage Modal Form State
  const [modalStatus, setModalStatus] = useState<any>('under_review')
  const [consultantName, setConsultantName] = useState('Dr. Arthur Sterling (CTO)')
  const [fee, setFee] = useState<number>(1800)
  const [notes, setNotes] = useState('')

  const filteredRequests = consultancyRequests.filter((req) => {
    if (statusFilter !== 'all' && req.status !== statusFilter) return false
    return true
  })

  const openManageModal = (req: ConsultancyRequest) => {
    setSelectedReq(req)
    setModalStatus(req.status)
    setConsultantName(req.assignedConsultantName || 'Dr. Arthur Sterling (CTO)')
    setFee(req.feeUSD || 1800)
    setNotes(req.ctoNotes || '')
  }

  const handleSaveConsultancy = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReq) return

    updateConsultancyStatus(selectedReq.id, {
      status: modalStatus,
      assignedConsultantName: consultantName,
      feeUSD: Number(fee),
      ctoNotes: notes.trim(),
    })

    showToast('Consultancy assignment and status updated.', 'success')
    setSelectedReq(null)
  }

  const totalFee = consultancyRequests.reduce((acc, c) => acc + (c.feeUSD || 0), 0)
  const totalHours = consultancyRequests.reduce((acc, c) => acc + (c.estimatedHours || 0), 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="emerald" size="xs">Completed</Badge>
      case 'in_progress':
        return <Badge variant="sky" size="xs">In Progress</Badge>
      case 'assigned':
        return <Badge variant="indigo" size="xs">Assigned</Badge>
      case 'under_review':
        return <Badge variant="purple" size="xs">Under Review</Badge>
      default:
        return <Badge variant="amber" size="xs">Submitted</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Internal Technical Advisory & Consultancy
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Architecture deep dives, distributed systems advisory, and specialized engineering consultations for squads
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="sm">
            <Coins className="w-3.5 h-3.5 mr-1" />
            {formatCurrency(totalFee)} Billed Allocation
          </Badge>
        </div>
      </div>

      {/* Top 4 Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              {consultancyRequests.length}
            </div>
            <div className="text-[11px] text-slate-400">Total Engagements</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              {totalHours} hrs
            </div>
            <div className="text-[11px] text-slate-400">Advisory Hours</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-lime-50 dark:bg-lime-950/40 text-lime-600 dark:text-lime-400 flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              {formatCurrency(totalFee)}
            </div>
            <div className="text-[11px] text-slate-400">Internal Billing Value</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              100%
            </div>
            <div className="text-[11px] text-slate-400">Squad Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['all', 'submitted', 'under_review', 'assigned', 'in_progress', 'completed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap capitalize transition-colors ${
              statusFilter === st
                ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRequests.map((req) => {
          const squad = teams.find((t) => t.id === req.teamId)

          return (
            <div
              key={req.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 flex flex-col justify-between shadow-2xs space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="indigo" size="xs">
                    {squad?.name || req.teamId}
                  </Badge>
                  {getStatusBadge(req.status)}
                </div>

                <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 mb-1">
                  {req.title}
                </h4>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                  {req.description}
                </p>

                {/* Details Box */}
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Lead Advisor</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {req.assignedConsultantName || 'Dr. Arthur Sterling'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Advisory Fee</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                      {formatCurrency(req.feeUSD || 1800)} ({req.estimatedHours || 8} hrs)
                    </span>
                  </div>
                </div>

                {req.ctoNotes && (
                  <p className="text-[11px] text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/30 p-2 rounded-lg border border-purple-200/50 dark:border-purple-900/40">
                    <strong>CTO Note:</strong> {req.ctoNotes}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  Target: {formatDate(req.targetDate, 'short')}
                </span>

                <Button
                  variant="primary"
                  size="xs"
                  onClick={() => openManageModal(req)}
                >
                  Manage Advisory
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Manage Advisory Modal */}
      <Modal
        isOpen={!!selectedReq}
        onClose={() => setSelectedReq(null)}
        title={selectedReq ? `Manage Advisory: ${selectedReq.title}` : 'Advisory'}
      >
        <form onSubmit={handleSaveConsultancy} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Advisory Status
              </label>
              <select
                value={modalStatus}
                onChange={(e) => setModalStatus(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
              >
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="rejected">Declined</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Internal Advisory Fee (USD)
              </label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Assigned Principal Architect / Advisor
            </label>
            <input
              type="text"
              value={consultantName}
              onChange={(e) => setConsultantName(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              CTO Architecture Guidance & Deliverable Notes
            </label>
            <textarea
              rows={3}
              placeholder="Recommended architecture strategy, benchmark requirements, deliverables..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setSelectedReq(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Update Engagement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
