import { Card } from '../common/Card'
import { Badge } from '../common/Badge'
import { Award, ShieldCheck, GitPullRequest } from 'lucide-react'
import type { PerformanceRecord } from '../../types'

export interface PerformanceSummaryProps {
  performance: PerformanceRecord
}

export function PerformanceSummary({ performance }: PerformanceSummaryProps) {
  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      case 'ShieldCheck':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      case 'GitPullRequest':
        return <GitPullRequest className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
      default:
        return <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
    }
  }

  // Starline-style Donut Ring calculations (viewBox 0 0 110 110, r = 42)
  const radius = 42
  const circumference = 2 * Math.PI * radius // ~263.89
  const completedPct = 0.72
  const inProgressPct = 0.18
  const reviewPct = 0.10

  const dashCompleted = completedPct * circumference
  const dashInProgress = inProgressPct * circumference
  const dashReview = reviewPct * circumference

  const offsetCompleted = 0
  const offsetInProgress = -dashCompleted
  const offsetReview = -(dashCompleted + dashInProgress)

  return (
    <Card
      title="Performance Analytics"
      icon={Award}
    >
      <div className="space-y-4">
        {/* Top: Donut Ring & Metrics (Starline Analytics style) */}
        <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Donut Chart */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg
              className="w-full h-full -rotate-90 transform"
              viewBox="0 0 110 110"
            >
              {/* Background Track */}
              <circle
                cx="55"
                cy="55"
                r={radius}
                className="stroke-slate-200/70 dark:stroke-slate-700/60"
                strokeWidth="9"
                fill="transparent"
              />
              {/* Completed Segment (Teal/Emerald) */}
              <circle
                cx="55"
                cy="55"
                r={radius}
                stroke="#10b981"
                strokeWidth="9"
                strokeDasharray={`${dashCompleted} ${circumference}`}
                strokeDashoffset={offsetCompleted}
                strokeLinecap="round"
                fill="transparent"
              />
              {/* In Progress Segment (Cyan) */}
              <circle
                cx="55"
                cy="55"
                r={radius}
                stroke="#06b6d4"
                strokeWidth="9"
                strokeDasharray={`${dashInProgress} ${circumference}`}
                strokeDashoffset={offsetInProgress}
                strokeLinecap="round"
                fill="transparent"
              />
              {/* Review Segment (Amber/Orange) */}
              <circle
                cx="55"
                cy="55"
                r={radius}
                stroke="#f59e0b"
                strokeWidth="9"
                strokeDasharray={`${dashReview} ${circumference}`}
                strokeDashoffset={offsetReview}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold font-display text-slate-900 dark:text-white leading-none">
                {performance.overallScore || 94}%
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                Score
              </span>
            </div>
          </div>

          {/* Legend and Metrics Breakdown */}
          <div className="flex-1 w-full grid grid-cols-2 gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                Completed
              </div>
              <div className="text-base font-bold font-display text-slate-900 dark:text-white mt-1">
                {performance.completionRate}%
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                On-Time
              </div>
              <div className="text-base font-bold font-display text-slate-900 dark:text-white mt-1">
                {performance.onTimeDeliveryRate}%
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                Velocity
              </div>
              <div className="text-base font-bold font-display text-slate-900 dark:text-white mt-1">
                42 pts
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                PR Rating
              </div>
              <div className="text-base font-bold font-display text-slate-900 dark:text-white mt-1">
                4.9 / 5.0
              </div>
            </div>
          </div>
        </div>

        {/* Accolades */}
        <div className="space-y-2">
          {performance.recentRewards?.slice(0, 2).map((reward) => (
            <div
              key={reward.id}
              className="p-3 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100/60 dark:border-amber-900/30 flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-xl bg-amber-100/80 dark:bg-amber-900/60 shrink-0">
                  {getRewardIcon(reward.icon)}
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 truncate block">
                    {reward.title}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate block">
                    {reward.description}
                  </span>
                </div>
              </div>

              <Badge variant="amber" size="xs">
                +{reward.points || reward.bonusValue}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

