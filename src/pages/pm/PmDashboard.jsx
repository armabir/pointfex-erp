import React from 'react'
import { Card } from '../../components/common/Card.jsx'
import { Badge } from '../../components/common/Badge.jsx'
import { Button } from '../../components/common/Button.jsx'
import { StatusPill } from '../../components/common/StatusPill.jsx'
import { usePmData } from '../../hooks/usePmData.js'
import { useApp } from '../../context/AppContext.jsx'
import { formatCurrency, formatDate } from '../../utils/formatters.js'
import {
  Wallet,
  CheckSquare,
  Users,
  FolderGit2,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowRight,
  Layers,
  Award,
  Megaphone,
} from 'lucide-react'

export function PmDashboard() {
  const {
    pm,
    team,
    teamProjects,
    pendingReviewTasks,
    financials,
    stats,
    teamPerformance,
    announcements,
  } = usePmData()

  const { setRoute, approveTask, setSelectedTaskModal, setSelectedProjectModal } = useApp()

  // 4 Pastel Stat Cards (Starline UI style)
  const statCards = [
    {
      id: 'budget',
      label: 'Approved Budget',
      value: formatCurrency(financials.totalApprovedBudget),
      trend: `${formatCurrency(financials.remainingBudget)}`,
      trendSub: 'remaining',
      icon: Wallet,
      cardBg: 'bg-[#fff4ea] dark:bg-[#201815] border-[#fee3cc] dark:border-amber-900/40',
      iconBg: 'bg-[#fee1c7] dark:bg-amber-900/60 text-amber-600 dark:text-amber-300',
      onClick: () => setRoute('budget-finance'),
    },
    {
      id: 'active_tasks',
      label: 'Team Tasks',
      value: stats.totalTasks,
      trend: `${stats.inProgressTasks} in progress`,
      trendSub: `• ${stats.todoTasks} backlog`,
      icon: Layers,
      cardBg: 'bg-[#f4f0fe] dark:bg-[#1a1427] border-[#e7dcfb] dark:border-purple-900/40',
      iconBg: 'bg-[#e8dafc] dark:bg-purple-900/60 text-purple-600 dark:text-purple-300',
      onClick: () => setRoute('task-management'),
    },
    {
      id: 'review_queue',
      label: 'Awaiting PM Approval',
      value: pendingReviewTasks.length,
      trend: pendingReviewTasks.length > 0 ? 'Requires sign-off' : 'Queue cleared',
      trendSub: pendingReviewTasks.length > 0 ? 'Action needed' : 'All approved',
      icon: CheckSquare,
      cardBg: 'bg-[#fff1f2] dark:bg-rose-950/20 border-rose-100/80 dark:border-rose-900/40',
      iconBg: 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300',
      onClick: () => setRoute('task-management'),
    },
    {
      id: 'squad',
      label: 'Managed Squad',
      value: `${stats.memberCount} Devs`,
      trend: `${stats.projectCount} Sprint Projects`,
      trendSub: team?.name?.split('—')[0] || 'Team 1',
      icon: Users,
      cardBg: 'bg-[#eafaf7] dark:bg-[#0e211f] border-[#cbf3eb] dark:border-emerald-900/40',
      iconBg: 'bg-[#c8f5ed] dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300',
      onClick: () => setRoute('team-management'),
    },
  ]

  // Starline Donut calculation
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const completedRate = Math.min(1, Math.max(0, stats.completedTasks / (stats.totalTasks || 1)))
  const inReviewRate = Math.min(1, Math.max(0, pendingReviewTasks.length / (stats.totalTasks || 1)))
  const inProgressRate = Math.min(1, Math.max(0, stats.inProgressTasks / (stats.totalTasks || 1)))

  const dashCompleted = completedRate * circumference
  const dashInReview = inReviewRate * circumference
  const dashInProgress = inProgressRate * circumference

  return (
    <div className="space-y-6">
      {/* 1. Welcome Section */}
      <div className="py-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display tracking-tight flex items-center gap-2">
            Welcome, {pm?.name?.split(' ')[0] || 'Sarah'} <span className="inline-block animate-wiggle">👋</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Managing <span className="font-semibold text-slate-700 dark:text-slate-300">{team?.name || 'Team 1'}</span> · Sprint Week {team?.currentSprintWeek || 3} of {team?.totalSprintWeeks || 5}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge variant="lime" size="sm">
            {team?.code || 'QC'} Sprint Cockpit
          </Badge>
          <Badge variant="emerald" size="sm" dot>
            Sprint On Track
          </Badge>
        </div>
      </div>

      {/* 2. Key Statistics (Pastel Cards) */}
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
                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-2xs ${card.iconBg}`}>
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
                    {card.trendSub}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 3. Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Pending Approvals -> Projects -> Team Performance */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Pending Approvals Card (Critical PM responsibility) */}
          <Card
            title="Pending Verification & Approvals"
            subtitle={`${pendingReviewTasks.length} developer deliverables waiting for PM sign-off`}
            icon={ShieldAlert}
            action={
              <Button
                variant="ghost"
                size="xs"
                rightIcon={ArrowRight}
                onClick={() => setRoute('task-management')}
              >
                Task Board
              </Button>
            }
          >
            {pendingReviewTasks.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">
                  All developer deliverables verified
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                  No tasks currently in review. When engineers complete code, items will appear here for PM sign-off.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingReviewTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="purple" size="xs">
                          In Review
                        </Badge>
                        <span className="font-semibold text-slate-900 dark:text-white truncate">
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Assignee: <strong className="text-slate-700 dark:text-slate-200">{task.assignee?.name || 'Engineer'}</strong></span>
                        <span>•</span>
                        <span>Project: {task.project?.code}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Due {formatDate(task.dueDate, 'short')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="secondary"
                        size="xs"
                        onClick={() => setSelectedTaskModal(task)}
                      >
                        Inspect
                      </Button>
                      <Button
                        variant="lime"
                        size="xs"
                        icon={CheckCircle2}
                        onClick={() => approveTask(task.id, 'Verified deliverable and approved by PM')}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Team Projects Overview */}
          <Card
            title="Assigned Projects"
            subtitle="Sprint progress & delivery deadlines"
            icon={FolderGit2}
            action={
              <Button
                variant="ghost"
                size="xs"
                rightIcon={ArrowRight}
                onClick={() => setRoute('projects')}
              >
                All Projects
              </Button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => setSelectedProjectModal(project)}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-all duration-150 group shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge variant="indigo" size="xs">
                        {project.code}
                      </Badge>
                      <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors truncate">
                        {project.name}
                      </h4>
                    </div>
                    <StatusPill status={project.status} size="sm" />
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mb-3">
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
                    <span>Budget: {formatCurrency(project.budget)}</span>
                    <span>Due {formatDate(project.deadline, 'short')}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Team Performance Analytics with Donut Ring */}
          <Card
            title="Team Performance Analytics"
            subtitle="Sprint velocity, quality grading, and completion pacing"
            icon={Award}
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
                  {/* Completed (Emerald) */}
                  <circle
                    cx="55"
                    cy="55"
                    r={radius}
                    stroke="#10b981"
                    strokeWidth="9"
                    strokeDasharray={`${dashCompleted} ${circumference}`}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                  {/* In Progress (Sky) */}
                  <circle
                    cx="55"
                    cy="55"
                    r={radius}
                    stroke="#06b6d4"
                    strokeWidth="9"
                    strokeDasharray={`${dashInProgress} ${circumference}`}
                    strokeDashoffset={-dashCompleted}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                  {/* In Review (Amber) */}
                  <circle
                    cx="55"
                    cy="55"
                    r={radius}
                    stroke="#f59e0b"
                    strokeWidth="9"
                    strokeDasharray={`${dashInReview} ${circumference}`}
                    strokeDashoffset={-(dashCompleted + dashInProgress)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-bold font-display text-slate-900 dark:text-white leading-none">
                    {teamPerformance.overallScore}%
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                    Team Score
                  </span>
                </div>
              </div>

              {/* 4 Metric Tiles */}
              <div className="flex-1 w-full grid grid-cols-2 gap-3 min-w-0">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Completion
                  </div>
                  <div className="text-base font-bold font-display text-slate-900 dark:text-white mt-1">
                    {teamPerformance.completionRate}%
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    Velocity
                  </div>
                  <div className="text-base font-bold font-display text-slate-900 dark:text-white mt-1">
                    {teamPerformance.teamVelocity} pts
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    On-Time Delivery
                  </div>
                  <div className="text-base font-bold font-display text-slate-900 dark:text-white mt-1">
                    {teamPerformance.onTimeDeliveryRate}%
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    Code Quality
                  </div>
                  <div className="text-base font-bold font-display text-slate-900 dark:text-white mt-1">
                    {teamPerformance.qualityScore} / 100
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column (4 cols): Task Status Breakdown -> Budget Summary -> Announcements */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Task Status Overview */}
          <Card title="Task Distribution" icon={Layers}>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  To Do (Backlog)
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{stats.todoTasks}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40">
                <span className="flex items-center gap-2 text-sky-800 dark:text-sky-300">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  In Progress
                </span>
                <span className="font-bold text-sky-900 dark:text-sky-100">{stats.inProgressTasks}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                <span className="flex items-center gap-2 text-purple-800 dark:text-purple-300">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  In Review (Pending PM)
                </span>
                <span className="font-bold text-purple-900 dark:text-purple-100">{pendingReviewTasks.length}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                <span className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Completed
                </span>
                <span className="font-bold text-emerald-900 dark:text-emerald-100">{stats.completedTasks}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                <span className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Blocked
                </span>
                <span className="font-bold text-rose-900 dark:text-rose-100">{stats.blockedTasks}</span>
              </div>

              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  rightIcon={ArrowRight}
                  onClick={() => setRoute('task-management')}
                >
                  Open Task Management
                </Button>
              </div>
            </div>
          </Card>

          {/* Project Budget Summary */}
          <Card
            title="Budget Utilization"
            icon={Wallet}
            action={
              <Button
                variant="ghost"
                size="xs"
                rightIcon={ArrowRight}
                onClick={() => setRoute('budget-finance')}
              >
                Ledger
              </Button>
            }
          >
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Authorized Budget</span>
                  <span className="font-bold text-slate-900 dark:text-white font-display">
                    {formatCurrency(financials.totalApprovedBudget)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Allocated to Devs</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(financials.totalAllocated)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Released / Paid</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(financials.totalReleased)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">Unallocated Reserve</span>
                  <span className="text-lime-600 dark:text-lime-400">
                    {formatCurrency(financials.remainingBudget)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Announcements */}
          <Card title="Company Bulletins" icon={Megaphone}>
            <div className="space-y-2.5 text-xs">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between gap-1 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{ann.authorName}</span>
                    <span>{formatDate(ann.date, 'short')}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-xs truncate">
                    {ann.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {ann.content}
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

export default PmDashboard
