import React, { useState } from 'react'
import { Card } from '../../components/common/Card.jsx'
import { Badge } from '../../components/common/Badge.jsx'
import { Button } from '../../components/common/Button.jsx'
import { useDeveloperData } from '../../hooks/useDeveloperData.js'
import { useApp } from '../../context/AppContext.jsx'
import { formatDate } from '../../utils/formatters.js'
import { Send, MessageSquare } from 'lucide-react'

export function DeveloperReportPage() {
  const { data, showToast } = useApp()
  const { pm } = useDeveloperData()
  const reports = data.reports.filter((r) => r.userId === 'user_dev_01')

  const [yesterday, setYesterday] = useState('')
  const [today, setToday] = useState('')
  const [blockers, setBlockers] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!yesterday.trim() || !today.trim()) return

    const newReport = {
      id: `rep_${Date.now()}`,
      userId: 'user_dev_01',
      teamId: 'team_01',
      pmId: 'user_pm_01',
      type: 'daily_standup',
      date: new Date().toISOString().split('T')[0],
      yesterdayWork: yesterday.trim(),
      todayPlan: today.trim(),
      blockers: blockers.trim() || 'None',
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      pmFeedback: 'Awaiting PM review.',
    }

    data.reports.unshift(newReport)
    showToast('Daily Standup submitted to PM', 'success')
    setYesterday('')
    setToday('')
    setBlockers('')
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 font-display">
          Report to PM
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Send your daily updates to {pm?.name || 'Sarah Jenkins'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form */}
        <div className="lg:col-span-7">
          <Card title="Daily Standup" icon={Send}>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1.5">
                  What did you complete yesterday?
                </label>
                <textarea
                  required
                  rows="3"
                  value={yesterday}
                  onChange={(e) => setYesterday(e.target.value)}
                  placeholder="Summarize completed items..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5">
                  What are you working on today?
                </label>
                <textarea
                  required
                  rows="3"
                  value={today}
                  onChange={(e) => setToday(e.target.value)}
                  placeholder="Planned tasks for today..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1.5">
                  Any blockers?
                </label>
                <textarea
                  rows="2"
                  value={blockers}
                  onChange={(e) => setBlockers(e.target.value)}
                  placeholder="Optional dependencies or questions..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" variant="lime" size="md" icon={Send}>
                  Submit Report
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Previous Reports */}
        <div className="lg:col-span-5">
          <Card title="Recent Standups" icon={MessageSquare}>
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900">
                      {formatDate(report.date, 'short')}
                    </span>
                    <Badge variant={report.status === 'approved' ? 'emerald' : 'sky'} size="xs">
                      {report.status}
                    </Badge>
                  </div>

                  <p className="text-slate-600 line-clamp-2">
                    {report.todayPlan}
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
