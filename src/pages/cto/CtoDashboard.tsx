import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { StatusPill } from '../../components/common/StatusPill'
import { useCtoData } from '../../hooks/useCtoData'
import { useApp } from '../../context/AppContext'
import { formatDate } from '../../utils/formatters'
import {
  Users,
  FolderGit2,
  ArrowUpRight,
  ArrowRight,
  Award,
  GitPullRequest,
  ShieldAlert,
  GitBranch,
  ShieldCheck,
  FileCode,
  type LucideIcon,
} from 'lucide-react'

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

export function CtoDashboard() {
  const { cto, projects, teams, pullRequests, securityAlerts, auditLogs, companyStats } =
    useCtoData()

  const { setRoute, setSelectedProjectModal } = useApp()

  // 4 Soft Pastel Stat Cards (Starline UI style)
  const statCards: StatCardItem[] = [
    {
      id: 'projects',
      label: 'Managed Projects',
      value: companyStats.totalProjects,
      trend: `${companyStats.totalTeams} Engineering Squads`,
      trendSub: '12 Repositories',
      icon: FolderGit2,
      cardBg: 'bg-[#eff6ff] dark:bg-[#101b2d] border-[#dbeafe] dark:border-sky-900/40',
      iconBg: 'bg-[#dbeafe] dark:bg-sky-900/60 text-sky-600 dark:text-sky-300',
      onClick: () => setRoute('projects-repos'),
    },
    {
      id: 'engineers',
      label: 'Engineering Headcount',
      value: companyStats.totalDevelopers + companyStats.totalPms,
      trend: `${companyStats.totalDevelopers} Devs • ${companyStats.totalPms} PMs`,
      trendSub: '6 Core Squads',
      icon: Users,
      cardBg: 'bg-[#eafaf7] dark:bg-[#0e211f] border-[#cbf3eb] dark:border-emerald-900/40',
      iconBg: 'bg-[#c8f5ed] dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300',
      onClick: () => setRoute('people'),
    },
    {
      id: 'quality',
      label: 'Code Quality Gate',
      value: `${companyStats.averageQualityScore}%`,
      trend: `${companyStats.averageTestCoverage}% Test Coverage`,
      trendSub: 'SonarQube Passed',
      icon: Award,
      cardBg: 'bg-[#fff4ea] dark:bg-[#201815] border-[#fee3cc] dark:border-amber-900/40',
      iconBg: 'bg-[#fee1c7] dark:bg-amber-900/60 text-amber-600 dark:text-amber-300',
      onClick: () => setRoute('code-quality'),
    },
    {
      id: 'security',
      label: 'Active Vulnerabilities',
      value: companyStats.securityAlertsCount,
      trend:
        companyStats.criticalSecurityAlertsCount > 0
          ? `${companyStats.criticalSecurityAlertsCount} Critical`
          : '0 Critical',
      trendSub: `${companyStats.openPullRequests} PRs in Review`,
      icon: ShieldAlert,
      cardBg: 'bg-[#fff1f2] dark:bg-rose-950/20 border-rose-100/80 dark:border-rose-900/40',
      iconBg: 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300',
      onClick: () => setRoute('security-testing'),
    },
  ]

  // Starline Donut calculations for Code Quality
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const passedRate = 0.85
  const warningRate = 0.15
  const dashPassed = passedRate * circumference
  const dashWarning = warningRate * circumference

  return (
    <div className="space-y-6">
      {/* 1. Executive Welcome Header */}
      <div className="py-1">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display tracking-tight flex items-center gap-2">
          Welcome, {cto?.name?.split(' ')[0] || 'Arthur'}{' '}
          <span className="inline-block animate-wiggle">👋</span>
        </h2>
      </div>

      {/* 2. Key Metrics & Statistics - Soft Pastel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.id}
              onClick={card.onClick}
              className={`border rounded-3xl p-5 transition-all duration-200 cursor-pointer shadow-[0_4px_20px_-2px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_-4px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 group ${card.cardBg}`}
            >
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

              <div className="flex items-center gap-1.5 text-xs pt-2.5 border-t border-black/[0.04] dark:border-white/[0.05]">
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {card.trend}
                </span>
                {card.trendSub && (
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] truncate">
                    • {card.trendSub}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 3. Main Dashboard Grid (12-col) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Projects -> Code Quality -> Security Overview */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Company-Wide Projects Grid (Robust 2-row layout) */}
          <Card
            title="Company-Wide Projects & Repositories"
            icon={FolderGit2}
            action={
              <Button
                variant="ghost"
                size="xs"
                rightIcon={ArrowRight}
                onClick={() => setRoute('projects-repos')}
              >
                All 12 Projects
              </Button>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {projects.slice(0, 6).map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProjectModal(project)}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-all duration-150 group shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Code Badge & Status Pill */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <Badge variant="indigo" size="xs">
                        {project.code}
                      </Badge>
                      <StatusPill status={project.status} size="sm" />
                    </div>

                    {/* Title: Full width, never squished */}
                    <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate mb-3">
                      {project.name}
                    </h4>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mb-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Sprint Progress</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {project.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-sky-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
                    <span className="font-mono flex items-center gap-1">
                      <GitBranch className="w-3 h-3" />
                      {project.repo?.activeBranch?.replace('feat/', '') || 'main'}
                    </span>
                    <span>Due {formatDate(project.deadline, 'short')}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Code Review & Architecture Quality Gate */}
          <Card
            title="Architecture & Code Quality Gates"
            icon={Award}
            action={
              <Button
                variant="ghost"
                size="xs"
                rightIcon={ArrowRight}
                onClick={() => setRoute('code-quality')}
              >
                Inspect Gates
              </Button>
            }
          >
            <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5">
              {/* Donut Chart */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 110 110">
                  <circle
                    cx="55"
                    cy="55"
                    r={radius}
                    className="stroke-slate-200/70 dark:stroke-slate-700/60"
                    strokeWidth="9"
                    fill="transparent"
                  />
                  <circle
                    cx="55"
                    cy="55"
                    r={radius}
                    stroke="#10b981"
                    strokeWidth="9"
                    strokeDasharray={`${dashPassed} ${circumference}`}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                  <circle
                    cx="55"
                    cy="55"
                    r={radius}
                    stroke="#f59e0b"
                    strokeWidth="9"
                    strokeDasharray={`${dashWarning} ${circumference}`}
                    strokeDashoffset={-dashPassed}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-bold font-display text-slate-900 dark:text-white leading-none">
                    {companyStats.averageQualityScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                    Compliance
                  </span>
                </div>
              </div>

              {/* 4 Metric Tiles */}
              <div className="flex-1 w-full grid grid-cols-2 gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    Passed Gates
                  </div>
                  <div className="text-base font-bold font-display text-slate-900 dark:text-white mt-1">
                    10 / 12 Repos
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                    Test Coverage
                  </div>
                  <div className="text-base font-bold font-display text-slate-900 dark:text-white mt-1">
                    {companyStats.averageTestCoverage}%
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    Tech Debt Hours
                  </div>
                  <div className="text-base font-bold font-display text-slate-900 dark:text-white mt-1">
                    138 hrs total
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                    Active Squads
                  </div>
                  <div className="text-base font-bold font-display text-slate-900 dark:text-white mt-1">
                    {teams.length} Squads
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Active Pull Requests Requiring Attention */}
          <Card
            title="Active Pull Requests Requiring Architecture Review"
            icon={GitPullRequest}
            action={
              <Button
                variant="ghost"
                size="xs"
                rightIcon={ArrowRight}
                onClick={() => setRoute('code-quality')}
              >
                Review All
              </Button>
            }
          >
            <div className="space-y-3">
              {pullRequests.slice(0, 3).map((pr) => (
                <div
                  key={pr.id}
                  className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          pr.status === 'approved'
                            ? 'emerald'
                            : pr.status === 'in_review'
                              ? 'purple'
                              : 'sky'
                        }
                        size="xs"
                      >
                        {pr.status.replace('_', ' ')}
                      </Badge>
                      <span className="font-semibold text-slate-900 dark:text-white truncate">
                        {pr.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="font-mono">{pr.branch}</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                        +{pr.additions}
                      </span>
                      <span className="text-rose-600 dark:text-rose-400 font-mono">
                        -{pr.deletions}
                      </span>
                      <span>•</span>
                      <span>{pr.reviewCommentsCount} comments</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="secondary" size="xs" onClick={() => setRoute('code-quality')}>
                      Inspect Code
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (4 cols): Security Posture -> Squad Velocity -> Engineering Audit Stream */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Security & Vulnerability Alerts */}
          <Card
            title="Security Posture"
            icon={ShieldCheck}
            action={
              <Button
                variant="ghost"
                size="xs"
                rightIcon={ArrowRight}
                onClick={() => setRoute('security-testing')}
              >
                Audit Center
              </Button>
            }
          >
            <div className="space-y-3 text-xs">
              {securityAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-2xl border space-y-1.5 transition-all ${
                    alert.severity === 'critical'
                      ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                      : alert.severity === 'high'
                        ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        alert.severity === 'critical'
                          ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                          : alert.severity === 'high'
                            ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                            : 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {alert.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                    {alert.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                    {alert.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Engineering Squads Overview */}
          <Card
            title="Engineering Squads"
            icon={Users}
            action={
              <Button
                variant="ghost"
                size="xs"
                rightIcon={ArrowRight}
                onClick={() => setRoute('team-management')}
              >
                All {teams.length} Squads
              </Button>
            }
          >
            <div className="space-y-2 text-xs">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                      {team.name}
                    </span>
                    <span className="text-[10px] text-slate-400 truncate block">
                      PM: {team.pm?.name || 'Unassigned'} • {team.members.length} Engineers
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block">
                      {team.projectIds?.length || 0} Projects
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Engineering Audit Trail */}
          <Card
            title="Recent Engineering Activity"
            icon={FileCode}
            action={
              <Button
                variant="ghost"
                size="xs"
                rightIcon={ArrowRight}
                onClick={() => setRoute('audit-log')}
              >
                Audit Log
              </Button>
            }
          >
            <div className="space-y-2.5 text-xs">
              {auditLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400">
                    <Badge variant={log.badgeColor || 'slate'} size="xs">
                      {log.category.toUpperCase()}
                    </Badge>
                    <span>{log.timestamp}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate">
                    {log.entityTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {log.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CtoDashboard
