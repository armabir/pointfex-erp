import {
  Users,
  Award,
  Heart,
  ShieldAlert,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { useExecutiveData } from '../../hooks/useExecutiveData'
import { useApp } from '../../context/AppContext'
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

export function ChroDashboard() {
  const {
    hrStats,
    teams,
    confidentialComplaints,
    executiveTasks,
  } = useExecutiveData()

  const { setRoute } = useApp()

  const statCards: StatCardItem[] = [
    {
      id: 'headcount',
      label: 'Staff Headcount',
      value: 30,
      trend: '24 Developers • 6 PMs',
      trendSub: '6 Agile Squads',
      icon: Users,
      cardBg: 'bg-[#eafaf7] dark:bg-[#0e211f] border-[#cbf3eb] dark:border-emerald-900/40',
      iconBg: 'bg-[#c8f5ed] dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300',
      onClick: () => setRoute('people'),
    },
    {
      id: 'performance',
      label: 'Company Avg Performance',
      value: `${hrStats.avgPerformanceScore}%`,
      trend: `${hrStats.topPerformersCount} Top Performers`,
      trendSub: 'Evaluations Current',
      icon: Award,
      cardBg: 'bg-[#eff6ff] dark:bg-[#101b2d] border-[#dbeafe] dark:border-sky-900/40',
      iconBg: 'bg-[#dbeafe] dark:bg-sky-900/60 text-sky-600 dark:text-sky-300',
      onClick: () => setRoute('performance'),
    },
    {
      id: 'morale',
      label: 'Squad Morale Index',
      value: `${hrStats.avgSatisfactionIndex} / 5.0`,
      trend: `${hrStats.avgAttendanceRate}% Attendance Rate`,
      trendSub: 'High Engagement',
      icon: Heart,
      cardBg: 'bg-[#fff1f2] dark:bg-rose-950/20 border-rose-100/80 dark:border-rose-900/40',
      iconBg: 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300',
      onClick: () => setRoute('performance'),
    },
    {
      id: 'grievances',
      label: 'Confidential Desk',
      value: confidentialComplaints.length,
      trend: 'Privileged Repository',
      trendSub: 'CHRO & CEO Only',
      icon: ShieldAlert,
      cardBg: 'bg-[#f5f3ff] dark:bg-[#1c1830] border-[#ede9fe] dark:border-purple-900/40',
      iconBg: 'bg-[#ede9fe] dark:bg-purple-900/60 text-purple-600 dark:text-purple-300',
      onClick: () => setRoute('performance'),
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
        {/* Left Column (2 spans): Squad Morale Health & Performance Tiers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Squad Morale Matrix */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Squad Culture & Morale Matrix
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pulse surveys, collaboration indices, and attendance metrics
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRoute('performance')}
                className="text-sky-600 dark:text-sky-400 flex items-center gap-1"
              >
                Full Roster <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teams.slice(0, 4).map((team) => (
                <div
                  key={team.id}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">
                      {team.name}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Morale: 4.8 / 5
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    PM: {team.pm?.name} • 4 Devs
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Attendance:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">96.5%</span>
                    <span className="text-slate-400 ml-2">Delivery:</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">92%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Distribution */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Performance Tier Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Active engineering staff evaluation classifications
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 text-center">
                <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase">
                  Top Performers
                </div>
                <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mt-1">
                  {hrStats.topPerformersCount}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">&gt;90% Score Benchmark</p>
              </div>

              <div className="p-4 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-900/40 text-center">
                <div className="text-xs font-semibold text-sky-700 dark:text-sky-400 uppercase">
                  Strong Contributors
                </div>
                <div className="text-2xl font-bold text-sky-800 dark:text-sky-300 mt-1">
                  10
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">80% - 89% Cadence</p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-center">
                <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase">
                  Needs Support
                </div>
                <div className="text-2xl font-bold text-amber-800 dark:text-amber-300 mt-1">
                  {hrStats.needsSupportCount}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Under Active Coaching</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Confidential Grievance Desk & Personal Tasks */}
        <div className="space-y-6">
          {/* Confidential Grievances Widget */}
          <div className="bg-white dark:bg-slate-900 border border-purple-200/80 dark:border-purple-900/40 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Confidential Desk
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRoute('performance')}
                className="text-purple-600 dark:text-purple-400"
              >
                View Desk
              </Button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Privileged issues visible solely to CHRO & CEO.
            </p>

            <div className="space-y-3">
              {confidentialComplaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setRoute('performance')}
                  className="p-3.5 rounded-xl border border-purple-100 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/20 hover:border-purple-300 dark:hover:border-purple-700 cursor-pointer transition-all"
                >
                  <div className="text-xs font-bold text-purple-700 dark:text-purple-300 line-clamp-1">
                    {c.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Status: <span className="font-semibold uppercase">{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Tasks */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                HR Directives & Tasks
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
