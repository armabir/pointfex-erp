import React from 'react'
import {
  Wallet,
  CheckSquare,
  CheckCircle2,
  FolderGit2,
  ArrowUpRight,
} from 'lucide-react'
import { formatCurrency } from '../../utils/formatters.js'
import { useApp } from '../../context/AppContext.jsx'

export function StatsSection({ stats }) {
  const { setRoute } = useApp()

  const cards = [
    {
      id: 'wallet',
      label: 'Wallet Balance',
      value: formatCurrency(stats.walletBalance),
      trend: `+${formatCurrency(stats.pendingEscrow)}`,
      trendSub: 'in escrow',
      icon: Wallet,
      cardBg: 'bg-[#fff4ea] dark:bg-[#201815] border-[#fee3cc] dark:border-amber-900/40',
      iconBg: 'bg-[#fee1c7] dark:bg-amber-900/60 text-amber-600 dark:text-amber-300',
      onClick: () => setRoute('earnings'),
    },
    {
      id: 'active_tasks',
      label: 'Active Tasks',
      value: stats.inProgressTasks + stats.pendingTasks,
      trend: `${stats.inProgressTasks} in progress`,
      trendSub: 'of 12 assigned',
      icon: CheckSquare,
      cardBg: 'bg-[#f4f0fe] dark:bg-[#1a1427] border-[#e7dcfb] dark:border-purple-900/40',
      iconBg: 'bg-[#e8dafc] dark:bg-purple-900/60 text-purple-600 dark:text-purple-300',
      onClick: () => setRoute('tasks'),
    },
    {
      id: 'completion',
      label: 'Sprint Completion',
      value: `${Math.round((stats.completedTasks / (stats.totalTasks || 1)) * 100)}%`,
      trend: `${stats.completedTasks} completed`,
      trendSub: 'on schedule',
      icon: CheckCircle2,
      cardBg: 'bg-[#eafaf7] dark:bg-[#0e211f] border-[#cbf3eb] dark:border-emerald-900/40',
      iconBg: 'bg-[#c8f5ed] dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300',
      onClick: () => setRoute('tasks'),
    },
    {
      id: 'projects',
      label: 'Active Projects',
      value: stats.assignedProjectsCount,
      trend: 'Team 1 (Quantum)',
      trendSub: '2 sprints',
      icon: FolderGit2,
      cardBg: 'bg-[#eff6ff] dark:bg-[#101b2d] border-[#dbeafe] dark:border-sky-900/40',
      iconBg: 'bg-[#dbeafe] dark:bg-sky-900/60 text-sky-600 dark:text-sky-300',
      onClick: () => setRoute('projects'),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.id}
            onClick={card.onClick}
            className={`border rounded-3xl p-5 transition-all duration-200 cursor-pointer shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 group ${card.cardBg}`}
          >
            {/* Top row: Circular pastel badge on left, bold number & label on right */}
            <div className="flex items-center gap-3.5 mb-3.5">
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${card.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display tracking-tight leading-none">
                  {card.value}
                </div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 truncate">
                  {card.label}
                </div>
              </div>
            </div>

            {/* Bottom row: Soft green trend pill indicator */}
            <div className="flex items-center gap-1.5 text-xs pt-2.5 border-t border-black/[0.04] dark:border-white/[0.05]">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {card.trend}
              </span>
              {card.trendSub && (
                <span className="text-slate-400 dark:text-slate-500 text-[11px] truncate">
                  {card.trendSub}
                </span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
