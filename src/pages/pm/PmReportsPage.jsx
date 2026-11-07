import React, { useState } from 'react'
import { Card } from '../../components/common/Card.jsx'
import { Badge } from '../../components/common/Badge.jsx'
import { Button } from '../../components/common/Button.jsx'
import { usePmData } from '../../hooks/usePmData.js'
import { useApp } from '../../context/AppContext.jsx'
import { formatDate } from '../../utils/formatters.js'
import {
  Send,
  FileText,
  ExternalLink,
  Filter,
} from 'lucide-react'

export function PmReportsPage() {
  const { pmReports, teamProjects, pm } = usePmData()
  const { submitPmReport } = useApp()

  // Form State
  const [reportCategory, setReportCategory] = useState('Weekly/Sprint Progress Report')
  const [recipient, setRecipient] = useState('Chief Technology Officer (CTO)')
  const [reportTitle, setReportTitle] = useState('')
  const [reportDesc, setReportDesc] = useState('')
  const [reportProject, setReportProject] = useState(teamProjects[0]?.id || '')
  const [docsUrl, setDocsUrl] = useState('')

  // Filter State
  const [filterCategory, setFilterCategory] = useState('all')

  const recipientOptions = [
    { label: 'Chief Technology Officer (CTO) — Dr. Arthur Sterling', val: 'Chief Technology Officer (CTO)' },
    { label: 'Chief Financial Officer (CFO) — Vincent Gallagher', val: 'Chief Financial Officer (CFO)' },
    { label: 'Chief People Officer (CPO) — Amara Okafor', val: 'Chief People Officer (CPO)' },
    { label: 'Chief Executive Officer (CEO) — Victoria Sterling-Fox', val: 'Chief Executive Officer (CEO)' },
  ]

  const categoryOptions = [
    'Weekly/Sprint Progress Report',
    'Project Status Report',
    'Technical Issue / Blocker',
    'Budget Request',
    'Resource Request',
    'Team/HR Issue',
    'General Report',
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reportTitle.trim() || !reportDesc.trim() || !recipient) return

    submitPmReport({
      category: reportCategory,
      recipient,
      title: reportTitle.trim(),
      description: reportDesc.trim(),
      projectId: reportProject,
      docsUrl: docsUrl.trim(),
    })

    setReportTitle('')
    setReportDesc('')
    setDocsUrl('')
  }

  const filteredReports = pmReports.filter((r) => {
    if (filterCategory !== 'all' && r.category !== filterCategory) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Report to C-Suite Executives
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Submit sprint progress briefs, budget requests, and escalations to CTO, CFO, CPO, and CEO
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="sm">
            Executive Channel
          </Badge>
          <Badge variant="emerald" size="sm" dot>
            4 Management Desks Connected
          </Badge>
        </div>
      </div>

      {/* Grid: Form on Left, Previous Submissions on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (5 cols): New Report Submission Form */}
        <div className="lg:col-span-5">
          <Card title="Submit New Executive Report" icon={Send}>
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Report Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Recipient Desk <span className="text-rose-500">*</span>
                </label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  {recipientOptions.map((opt) => (
                    <option key={opt.val} value={opt.val}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Related Team Project
                </label>
                <select
                  value={reportProject}
                  onChange={(e) => setReportProject(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="">-- General / Squad Wide --</option>
                  {teamProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Report Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  placeholder="e.g. Sprint 3 Mid-Sprint Velocity & Blocker Radar"
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Executive Summary <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="4"
                  required
                  value={reportDesc}
                  onChange={(e) => setReportDesc(e.target.value)}
                  placeholder="Provide high-level context, metrics, blockers, or proposed remediation steps..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Documentation URL / Specification Link
                </label>
                <input
                  type="url"
                  value={docsUrl}
                  onChange={(e) => setDocsUrl(e.target.value)}
                  placeholder="https://docs.pointfex.internal/reports/..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="lime"
                  size="sm"
                  className="w-full"
                  icon={Send}
                >
                  Submit Report to Executive Desk
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right (7 cols): Submitted Executive Reports & Status */}
        <div className="lg:col-span-7 space-y-4">
          <Card
            title="Submitted Executive Reports"
            subtitle={`${pmReports.length} reports filed to C-Suite`}
            icon={FileText}
          >
            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                  filterCategory === 'all'
                    ? 'bg-slate-900 text-white dark:bg-lime-400 dark:text-slate-950'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                All ({pmReports.length})
              </button>
              {categoryOptions.slice(0, 3).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    filterCategory === cat
                      ? 'bg-slate-900 text-white dark:bg-lime-400 dark:text-slate-950'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Reports List */}
            <div className="space-y-3 pt-3">
              {filteredReports.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No reports found under this category.
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="indigo" size="xs">
                          {report.category}
                        </Badge>
                        <span className="text-[11px] text-slate-400">
                          To: <strong className="text-slate-700 dark:text-slate-300">{report.recipient?.split('(')[0]?.trim()}</strong>
                        </span>
                      </div>
                      <Badge
                        variant={
                          report.status === 'resolved'
                            ? 'emerald'
                            : report.status === 'under_review'
                            ? 'purple'
                            : 'amber'
                        }
                        size="xs"
                      >
                        {report.status.replace('_', ' ')}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {report.title}
                    </h4>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {report.description}
                    </p>

                    {report.docsUrl && (
                      <div className="pt-1">
                        <a
                          href={report.docsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-lime-700 dark:text-lime-400 hover:underline font-medium text-[11px]"
                        >
                          <ExternalLink className="w-3 h-3" /> View Attached Specification Doc
                        </a>
                      </div>
                    )}

                    {report.feedback && (
                      <div className="mt-2 p-2.5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                        <span className="font-semibold text-slate-900 dark:text-white block">
                          Executive Feedback:
                        </span>
                        <p>{report.feedback}</p>
                      </div>
                    )}

                    <div className="pt-1 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Submitted: {formatDate(report.date, 'short')}</span>
                      <span>Reporter: {pm?.name}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PmReportsPage
