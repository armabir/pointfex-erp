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
      trend: `+${formatCurrency(stats.pendingEscrow)} escrow`,
      icon: Wallet,
      cardBg: 'bg-[#fff8f2] border-amber-100/80',
      iconBg: 'bg-amber-100/90 text-amber-700',
      trendBg: 'text-amber-700 font-medium',
      onClick: () => setRoute('earnings'),
    },
    {
      id: 'active_tasks',
      label: 'Active Tasks',
      value: stats.inProgressTasks + stats.pendingTasks,
      trend: `${stats.inProgressTasks} in progress`,
      icon: CheckSquare,
      cardBg: 'bg-[#faf6ff] border-purple-100/80',
      iconBg: 'bg-purple-100/90 text-purple-700',
      trendBg: 'text-purple-700 font-medium',
      onClick: () => setRoute('tasks'),
    },
    {
      id: 'completion',
      label: 'Task Completion',
      value: `${Math.round((stats.completedTasks / (stats.totalTasks || 1)) * 100)}%`,
      trend: `${stats.completedTasks} completed`,
      icon: CheckCircle2,
      cardBg: 'bg-[#f0fdf9] border-emerald-100/80',
      iconBg: 'bg-emerald-100/90 text-emerald-700',
      trendBg: 'text-emerald-700 font-medium',
      onClick: () => setRoute('tasks'),
    },
    {
      id: 'projects',
      label: 'Active Projects',
      value: stats.assignedProjectsCount,
      trend: 'Team 1 (Quantum)',
      icon: FolderGit2,
      cardBg: 'bg-[#f2f7ff] border-sky-100/80',
      iconBg: 'bg-sky-100/90 text-sky-700',
      trendBg: 'text-sky-700 font-medium',
      onClick: () => setRoute('projects'),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.id}
            onClick={card.onClick}
            className={`border rounded-3xl p-5 transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs group ${card.cardBg}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${card.iconBg}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700">
                {card.label}
              </span>
            </div>

            <div className="text-3xl font-bold text-slate-900 font-display tracking-tight mb-2">
              {card.value}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
              <span className={card.trendBg}>{card.trend}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
