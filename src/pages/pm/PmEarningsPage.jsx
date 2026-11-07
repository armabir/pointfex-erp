import React, { useState, useMemo } from 'react'
import { Card } from '../../components/common/Card.jsx'
import { Badge } from '../../components/common/Badge.jsx'
import { usePmData } from '../../hooks/usePmData.js'
import { formatCurrency, formatDate } from '../../utils/formatters.js'
import {
  Wallet,
  ShieldCheck,
  AlertTriangle,
  Award,
  ArrowUpRight,
  Zap,
} from 'lucide-react'

export function PmEarningsPage() {
  const { pmWallet, pmTransactions, teamPerformance, developerWorkloads, team } = usePmData()
  const [filterType, setFilterType] = useState('all')

  const filteredTransactions = useMemo(() => {
    return pmTransactions.filter((tx) => {
      if (filterType === 'payout' && tx.type === 'penalty') return false
      if (filterType === 'penalty' && tx.type !== 'penalty') return false
      return true
    })
  }, [pmTransactions, filterType])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Earnings & Team Performance
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          PM management compensation balance, payout history, and delivery metrics for <span className="font-semibold text-slate-700 dark:text-slate-300">{team?.name}</span>
        </p>
      </div>

      {/* Top 4 Metric Cards (Matching Developer Workspace pattern strictly) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Balance */}
        <div className="bg-[#fff8f2] dark:bg-amber-950/20 border border-amber-100/80 dark:border-amber-900/40 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Available Balance</span>
            <div className="p-2 rounded-xl bg-amber-100/80 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            {formatCurrency(pmWallet.balance)}
          </div>
          <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            +${formatCurrency(pmWallet.pendingEscrow)} in escrow
          </div>
        </div>

        {/* 2. Total Earned */}
        <div className="bg-[#f0fdf9] dark:bg-emerald-950/20 border border-emerald-100/80 dark:border-emerald-900/40 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Total Earned</span>
            <div className="p-2 rounded-xl bg-emerald-100/80 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            {formatCurrency(pmWallet.totalEarnedToDate)}
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            Cumulative PM compensation
          </div>
        </div>

        {/* 3. Penalty */}
        <div className="bg-[#fff1f2] dark:bg-rose-950/20 border border-rose-100/80 dark:border-rose-900/40 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Penalty</span>
            <div className="p-2 rounded-xl bg-rose-100/80 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            {formatCurrency(pmWallet.totalPenalties || 0)}
          </div>
          <div className="mt-2 text-[11px] text-rose-700 dark:text-rose-400 font-medium">
            0 management SLA penalties
          </div>
        </div>

        {/* 4. Spendings */}
        <div className="bg-[#faf6ff] dark:bg-purple-950/20 border border-purple-100/80 dark:border-purple-900/40 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
            <span>Spendings</span>
            <div className="p-2 rounded-xl bg-purple-100/80 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-slate-900 dark:text-white">
            {formatCurrency(pmWallet.totalSpendings || 250)}
          </div>
          <div className="mt-2 text-[11px] text-purple-700 dark:text-purple-400 font-medium">
            Project tooling & team gear
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <Card title="PM Compensation & Disbursement Ledger" icon={Wallet}>
        <div className="space-y-4 text-xs">
          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
            {[
              { id: 'all', label: 'All Transactions' },
              { id: 'payout', label: 'Disbursements & Bonuses' },
              { id: 'penalty', label: 'Penalties' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-slate-900 text-white dark:bg-lime-400 dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table */}
          {filteredTransactions.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              No transactions match this filter.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {tx.description}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{formatDate(tx.date, 'short')}</span>
                      <span>•</span>
                      <span className="capitalize">{tx.type.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span
                      className={`font-bold font-display text-sm ${
                        tx.amount >= 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {formatCurrency(tx.amount)}
                    </span>
                    <Badge variant={tx.status === 'completed' ? 'emerald' : 'amber'} size="xs">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Team Delivery & Performance Scorecard */}
      <Card title="Team Performance & Delivery Grading" icon={Award}>
        <div className="space-y-4 text-xs">
          {/* Top Score Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block">Overall Score</span>
              <span className="text-xl font-bold font-display text-slate-900 dark:text-white mt-0.5 block">
                {teamPerformance.overallScore}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">On-Time Rate</span>
              <span className="text-xl font-bold font-display text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                {teamPerformance.onTimeDeliveryRate}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Completion Pacing</span>
              <span className="text-xl font-bold font-display text-sky-600 dark:text-sky-400 mt-0.5 block">
                {teamPerformance.completionRate}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Sprint Velocity</span>
              <span className="text-xl font-bold font-display text-purple-600 dark:text-purple-400 mt-0.5 block">
                {teamPerformance.teamVelocity} pts
              </span>
            </div>
          </div>

          {/* Individual Developer Standings */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Individual Engineer Scores
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {developerWorkloads.map((dev) => (
                <div
                  key={dev.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-900 dark:text-white truncate block">
                      {dev.name}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate block">
                      {dev.title} · {dev.completedTasks} completed
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-sm font-display text-emerald-600 dark:text-emerald-400">
                      {dev.performance?.overallScore || 92}%
                    </span>
                    <Badge variant="emerald" size="xs">
                      Qualified
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default PmEarningsPage
