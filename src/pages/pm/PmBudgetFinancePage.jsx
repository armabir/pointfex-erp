import React, { useState } from 'react'
import { Card } from '../../components/common/Card.jsx'
import { Badge } from '../../components/common/Badge.jsx'
import { Button } from '../../components/common/Button.jsx'
import { Modal } from '../../components/common/Modal.jsx'
import { usePmData } from '../../hooks/usePmData.js'
import { useApp } from '../../context/AppContext.jsx'
import { formatCurrency, formatDate } from '../../utils/formatters.js'
import {
  Wallet,
  Coins,
  ShieldCheck,
  Plus,
  Send,
  ArrowUpRight,
  FolderGit2,
} from 'lucide-react'

export function PmBudgetFinancePage() {
  const { financials, teamProjects, teamMembers, team } = usePmData()
  const { allocateBudget, requestBudgetIncrease } = useApp()

  // Modals state
  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)

  // Allocation Form State
  const [allocDevId, setAllocDevId] = useState(teamMembers[0]?.id || '')
  const [allocProjectId, setAllocProjectId] = useState(teamProjects[0]?.id || '')
  const [allocAmount, setAllocAmount] = useState('1200')
  const [allocWeek, setAllocWeek] = useState('3')
  const [allocDesc, setAllocDesc] = useState('')

  // Budget Request Form State
  const [reqProjectId, setReqProjectId] = useState(teamProjects[0]?.id || '')
  const [reqAmount, setReqAmount] = useState('5000')
  const [reqReason, setReqReason] = useState('')

  const handleAllocateSubmit = (e) => {
    e.preventDefault()
    if (!allocDevId || !allocProjectId || !allocAmount) return

    allocateBudget({
      developerId: allocDevId,
      projectId: allocProjectId,
      amount: allocAmount,
      week: allocWeek,
      description: allocDesc || `Sprint Week ${allocWeek} developer allocation`,
    })

    setIsAllocateModalOpen(false)
    setAllocDesc('')
  }

  const handleRequestSubmit = (e) => {
    e.preventDefault()
    if (!reqProjectId || !reqAmount || !reqReason.trim()) return

    requestBudgetIncrease({
      projectId: reqProjectId,
      amount: reqAmount,
      reason: reqReason.trim(),
    })

    setIsRequestModalOpen(false)
    setReqReason('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Project Budgets & Resource Allocations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            CFO-authorized budgets, developer weekly fund allocations, and escrow releases for <span className="font-semibold text-slate-700 dark:text-slate-300">{team?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            icon={Send}
            onClick={() => setIsRequestModalOpen(true)}
          >
            Request CFO Increase
          </Button>
          <Button
            variant="lime"
            size="sm"
            icon={Plus}
            onClick={() => setIsAllocateModalOpen(true)}
          >
            Allocate to Developer
          </Button>
        </div>
      </div>

      {/* 4 Top Metric Cards (Starline style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. CFO Authorized Budget */}
        <div className="bg-[#fff8f2] dark:bg-amber-950/20 border border-amber-100/80 dark:border-amber-900/40 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Authorized Budget</span>
            <div className="p-2 rounded-xl bg-amber-100/80 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            {formatCurrency(financials.totalApprovedBudget)}
          </div>
          <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
            Authorized by CFO for 2 Projects
          </div>
        </div>

        {/* 2. Allocated to Developers */}
        <div className="bg-[#faf6ff] dark:bg-purple-950/20 border border-purple-100/80 dark:border-purple-900/40 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Allocated to Devs</span>
            <div className="p-2 rounded-xl bg-purple-100/80 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            {formatCurrency(financials.totalAllocated)}
          </div>
          <div className="mt-2 text-[11px] text-purple-700 dark:text-purple-400 font-medium">
            Reserved across 4 squad engineers
          </div>
        </div>

        {/* 3. Released to Wallets */}
        <div className="bg-[#f0fdf9] dark:bg-emerald-950/20 border border-emerald-100/80 dark:border-emerald-900/40 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Released / Paid</span>
            <div className="p-2 rounded-xl bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            {formatCurrency(financials.totalReleased)}
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            Disbursed upon verified milestones
          </div>
        </div>

        {/* 4. Unallocated Reserve */}
        <div className="bg-[#eff6ff] dark:bg-sky-950/20 border border-sky-100/80 dark:border-sky-900/40 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Remaining Reserve</span>
            <div className="p-2 rounded-xl bg-sky-100/80 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            {formatCurrency(financials.remainingBudget)}
          </div>
          <div className="mt-2 text-[11px] text-sky-700 dark:text-sky-400 font-medium">
            Available for Sprints 4 & 5
          </div>
        </div>
      </div>

      {/* Project-by-Project Budget Table */}
      <Card title="Project Budget Breakdown" icon={FolderGit2}>
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teamProjects.map((p) => {
              const allocated = Math.round(Number(p.budget) * 0.68)
              const remaining = Number(p.budget) - allocated
              return (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {p.name} ({p.code})
                    </span>
                    <Badge variant="indigo" size="xs">
                      {p.status}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>Authorized Budget:</span>
                      <strong className="text-slate-900 dark:text-white font-display">
                        {formatCurrency(p.budget)}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>Allocated to Devs:</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        {formatCurrency(allocated)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>Remaining Balance:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(remaining)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-lime-500 h-2 rounded-full"
                      style={{ width: '68%' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Team Allocation & Payment Transaction Log */}
      <Card title="Team Financial & Allocation Log" icon={Wallet}>
        <div className="space-y-3 text-xs">
          {financials.teamTransactions.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              No transactions recorded for this team yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {financials.teamTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">
                      {tx.description}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>Date: {formatDate(tx.date, 'short')}</span>
                      <span>•</span>
                      <span className="capitalize">{tx.type.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <span
                      className={`font-bold font-display text-sm ${
                        tx.amount >= 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {formatCurrency(tx.amount)}
                    </span>
                    <Badge
                      variant={tx.status === 'completed' ? 'emerald' : 'amber'}
                      size="xs"
                    >
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Allocate to Developer Modal */}
      <Modal
        isOpen={isAllocateModalOpen}
        onClose={() => setIsAllocateModalOpen(false)}
        title="Allocate Sprint Budget to Developer"
        subtitle="Distribute project funds to an engineer's sprint escrow"
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsAllocateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="lime" size="sm" onClick={handleAllocateSubmit}>
              Confirm Allocation
            </Button>
          </div>
        }
      >
        <form onSubmit={handleAllocateSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Select Developer <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={allocDevId}
              onChange={(e) => setAllocDevId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.title})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Charge to Project <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={allocProjectId}
              onChange={(e) => setAllocProjectId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              {teamProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Allocation Amount ($) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="100"
                step="50"
                required
                value={allocAmount}
                onChange={(e) => setAllocAmount(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Sprint Week
              </label>
              <select
                value={allocWeek}
                onChange={(e) => setAllocWeek(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
              >
                <option value="3">Week 3 (Current)</option>
                <option value="4">Week 4</option>
                <option value="5">Week 5</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Allocation Purpose / Milestone Note
            </label>
            <input
              type="text"
              value={allocDesc}
              onChange={(e) => setAllocDesc(e.target.value)}
              placeholder="e.g. Phase 3 WebGL telemetry widget release milestone"
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>
        </form>
      </Modal>

      {/* Request Budget Increase Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Submit Budget Increase Request to CFO"
        subtitle="Request contingency pool allocation from Vincent Gallagher (CFO)"
        maxWidth="max-w-md"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setIsRequestModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="lime" size="sm" onClick={handleRequestSubmit}>
              Submit Request
            </Button>
          </div>
        }
      >
        <form onSubmit={handleRequestSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Project <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={reqProjectId}
              onChange={(e) => setReqProjectId(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            >
              {teamProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Requested Amount ($) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="500"
              step="500"
              required
              value={reqAmount}
              onChange={(e) => setReqAmount(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Justification & Business Case <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows="4"
              required
              value={reqReason}
              onChange={(e) => setReqReason(e.target.value)}
              placeholder="Outline the scope expansion, infrastructure requirements, or third-party license costs justifying this budget request..."
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none resize-none"
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default PmBudgetFinancePage
