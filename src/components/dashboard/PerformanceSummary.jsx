import React from 'react'
import { Card } from '../common/Card.jsx'
import { Badge } from '../common/Badge.jsx'
import { Award, ShieldCheck, GitPullRequest } from 'lucide-react'

export function PerformanceSummary({ performance }) {
  const getRewardIcon = (iconName) => {
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

  return (
    <Card
      title="Performance"
      icon={Award}
    >
      <div className="space-y-4">
        {/* Soft 3-column metric cards */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Quality</div>
            <div className="text-xl font-bold font-display text-slate-900 dark:text-white mt-0.5">
              {performance.overallScore}
            </div>
          </div>

          <div className="border-x border-slate-200/60 dark:border-slate-700/60">
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">On-Time</div>
            <div className="text-xl font-bold font-display text-slate-900 dark:text-white mt-0.5">
              {performance.onTimeDeliveryRate}%
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Completed</div>
            <div className="text-xl font-bold font-display text-slate-900 dark:text-white mt-0.5">
              {performance.completionRate}%
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
                +{reward.points}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
