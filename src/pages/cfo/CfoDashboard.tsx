import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'
import { useExecutiveData } from '../../hooks/useExecutiveData'
import { useApp } from '../../context/AppContext'
import { formatCurrency } from '../../utils/formatters'
import { Button } from '../../components/common/Button'

interface StatCardItem {
  id: string
  label: string
  value: string | number
  trend: string
  trendSub?: string
  icon: LucideIcon
  cardBg: string
  iconBg: string
  onClick: () => void
}

export function CfoDashboard() {
  const {
    treasury,
    projectBudgets,
    pendingBudgetRequests,
    executiveTasks,
  } = useExecutiveData()

  const { setRoute } = useApp()

  const statCards: StatCardItem[] = [
    {
      id: 'reserves',
      label: 'Treasury Reserves',
      value: formatCurrency(treasury?.unallocatedReserves || 120000),
      trend: `${formatCurrency(treasury?.initialCapital || 500000)} Initial Capital`,
      trendSub: 'Unallocated Buffer',
      icon: CreditCard,
      cardBg: 'bg-[#fff4ea] dark:bg-[#201815] border-[#fee3cc] dark:border-amber-900/40',
      iconBg: 'bg-[#fee1c7] dark:bg-amber-900/60 text-amber-600 dark:text-amber-300',
      onClick: () => setRoute('budget'),
    },
    {
      id: 'approved',
      label: 'Approved Squad Budgets',
      value: formatCurrency(treasury?.totalApprovedBudgets || 380000),
      trend: `${projectBudgets.length} Projects Funded`,
      trendSub: 'Active Commitments',
      icon: Briefcase,
      cardBg: 'bg-[#eff6ff] dark:bg-[#101b2d] border-[#dbeafe] dark:border-sky-900/40',
      iconBg: 'bg-[#dbeafe] dark:bg-sky-900/60 text-sky-600 dark:text-sky-300',
      onClick: () => setRoute('budget'),
    },
    {
      id: 'disbursed',
      label: 'Disbursed to Staff',
      value: formatCurrency(treasury?.totalDistributedToDevs || 245600),
      trend: `${Math.round(((treasury?.totalDistributedToDevs || 245600) / (treasury?.totalApprovedBudgets || 380000)) * 100)}% Utilization`,
      trendSub: 'Credited to Wallets',
      icon: DollarSign,
      cardBg: 'bg-[#eafaf7] dark:bg-[#0e211f] border-[#cbf3eb] dark:border-emerald-900/40',
      iconBg: 'bg-[#c8f5ed] dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300',
      onClick: () => setRoute('budget'),
    },
    {
      id: 'revenue',
      label: 'Client Revenue Invoiced',
      value: formatCurrency(treasury?.totalClientRevenue || 740000),
      trend: '70% Company / 20% Squad',
      trendSub: '10% Capital Reserve',
      icon: TrendingUp,
      cardBg: 'bg-[#f5f3ff] dark:bg-[#1c1830] border-[#ede9fe] dark:border-purple-900/40',
      iconBg: 'bg-[#ede9fe] dark:bg-purple-900/60 text-purple-600 dark:text-purple-300',
      onClick: () => setRoute('budget'),
    },
  ]

  return (
    <div className="space-y-6">
      {/* 4 Soft Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.id}
              onClick={card.onClick}
              className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${card.cardBg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {card.label}
                </span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {card.value}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>{card.trend}</span>
                {card.trendSub && <span className="opacity-75">{card.trendSub}</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Grid: Left 2 cols, Right 1 col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Project Budget Allocations & Pending Requests */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Budget Allocations Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Active Squad Budget Allocations
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time budget utilization across engineering squads
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRoute('budget')}
                className="text-sky-600 dark:text-sky-400 flex items-center gap-1"
              >
                Manage All <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="space-y-4">
              {projectBudgets.slice(0, 4).map((pb) => (
                <div
                  key={pb.project.id}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">
                        {pb.project.name}
                      </span>
                      <span className="text-xs text-slate-400 ml-2 font-mono">({pb.project.code})</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {formatCurrency(pb.distributedToDevs)} / {formatCurrency(pb.approvedBudget)}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-2">
                    <div
                      className={`h-full rounded-full ${
                        pb.utilizationRate > 85
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, pb.utilizationRate)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>PM: {pb.project.pm?.name}</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(pb.remainingBudget)} remaining pool
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending PM Budget Requests Queue */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pending PM Budget Requests
                </h3>
                {pendingBudgetRequests.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    {pendingBudgetRequests.length} Pending
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRoute('budget')}
                className="text-sky-600 dark:text-sky-400 flex items-center gap-1"
              >
                Review Desk <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            {pendingBudgetRequests.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-80" />
                No pending budget requests from PMs.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingBudgetRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {req.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {req.description}
                      </div>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setRoute('budget')}
                    >
                      Adjudicate
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 span): Treasury Reserves Health & Executive Tasks */}
        <div className="space-y-6">
          {/* Treasury Reserve Breakdown Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Capital Reserves Composition
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              C-Suite Virtual Treasury Health
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Total Seed Capital</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(treasury?.initialCapital || 500000)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Allocated to Squads</span>
                <span className="font-bold text-sky-600 dark:text-sky-400">-{formatCurrency(treasury?.totalApprovedBudgets || 380000)}</span>
              </div>
              <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">Unallocated Buffer</span>
                <span className="font-bold text-amber-600 dark:text-amber-400">{formatCurrency(treasury?.unallocatedReserves || 120000)}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center"
                onClick={() => setRoute('budget')}
              >
                Open Financial Desk
              </Button>
            </div>
          </div>

          {/* Executive Personal Tasks */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                My Financial Tasks
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRoute('tasks')}
                className="text-sky-600 dark:text-sky-400"
              >
                All Tasks
              </Button>
            </div>

            <div className="space-y-2.5">
              {executiveTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  onClick={() => setRoute('tasks')}
                  className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer transition-all"
                >
                  <div className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {task.title}
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                    <span className="capitalize">{task.status.replace('_', ' ')}</span>
                    <span className="font-mono">{task.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
