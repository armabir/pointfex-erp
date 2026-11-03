import React from 'react'
import { Card } from '../common/Card.jsx'
import { Badge } from '../common/Badge.jsx'
import { Award, ShieldCheck, GitPullRequest } from 'lucide-react'

export function PerformanceSummary({ performance }) {
  const getRewardIcon = (iconName) => {
    switch (iconName) {
      case 'Award':
        return <Award className="w-3.5 h-3.5 text-amber-600" />
      case 'ShieldCheck':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
      case 'GitPullRequest':
        return <GitPullRequest className="w-3.5 h-3.5 text-sky-600" />
      default:
        return <Award className="w-3.5 h-3.5 text-amber-600" />
    }
  }

  return (
    <Card
      title="Performance"
      icon={Award}
    >
      <div className="space-y-4">
        {/* Soft 3-column metric cards */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-50/70 border border-slate-100 text-center">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Quality</div>
            <div className="text-xl font-bold font-display text-slate-900 mt-0.5">
              {performance.overallScore}
            </div>
          </div>

          <div className="border-x border-slate-200/60">
            <div className="text-[10px] text-slate-400 font-medium">On-Time</div>
            <div className="text-xl font-bold font-display text-slate-900 mt-0.5">
              {performance.onTimeDeliveryRate}%
            </div>
          </div>

          <div>
            <div className="text-[10px] text-slate-400 font-medium">Completed</div>
            <div className="text-xl font-bold font-display text-slate-900 mt-0.5">
              {performance.completionRate}%
            </div>
          </div>
        </div>

        {/* Accolades */}
        <div className="space-y-2">
          {performance.recentRewards?.slice(0, 2).map((reward) => (
            <div
              key={reward.id}
              className="p-3 rounded-2xl bg-amber-50/40 border border-amber-100/60 flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-xl bg-amber-100/80 shrink-0">
                  {getRewardIcon(reward.icon)}
                </div>
                <span className="font-medium text-slate-800 truncate">
                  {reward.title}
                </span>
              </div>
              <Badge variant="amber" size="xs">
                {reward.bonusValue}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
