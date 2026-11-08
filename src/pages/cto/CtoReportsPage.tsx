import { useState } from 'react'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { StatusPill } from '../../components/common/StatusPill'
import { useCtoData } from '../../hooks/useCtoData'
import { useApp } from '../../context/AppContext'
import { formatDate } from '../../utils/formatters'
import type { Report } from '../../types'
import {
  Send,
  FileText,
  ExternalLink,
  Share2,
  Inbox,
} from 'lucide-react'

export function CtoReportsPage() {
  const { incomingReports, ctoReports, projects } = useCtoData()
  const { submitCtoReport, updateIncomingReportStatus, showToast } = useApp()

  const [activeTab, setActiveTab] = useState<'incoming' | 'create' | 'history'>('incoming')

  // Create Report Form State
  const [recipient, setRecipient] = useState('CEO — Victoria Sterling-Fox')
  const [category, setCategory] = useState('Architecture & Infrastructure Proposal')
  const [reportTitle, setReportTitle] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '')
  const [docsUrl, setDocsUrl] = useState('')
  const [reportDesc, setReportDesc] = useState('')

  // Forward Modal State
  const [forwardingReport, setForwardingReport] = useState<Report | null>(null)
  const [forwardTo, setForwardTo] = useState('CEO — Victoria Sterling-Fox')
  const [forwardNotes, setForwardNotes] = useState('')

  // Review Incoming Modal State
  const [reviewingReport, setReviewingReport] = useState<Report | null>(null)
  const [newStatus, setNewStatus] = useState<string>('under_investigation')
  const [feedback, setFeedback] = useState('')

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportTitle.trim() || !reportDesc.trim()) {
      showToast('Please provide a title and executive summary.', 'error')
      return
    }

    submitCtoReport({
      recipient,
      category,
      title: reportTitle.trim(),
      description: reportDesc.trim(),
      projectId: selectedProjectId || undefined,
      docsUrl: docsUrl.trim() || undefined,
    })

    setReportTitle('')
    setReportDesc('')
    setDocsUrl('')
    setActiveTab('history')
  }

  const handleForwardSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!forwardingReport) return

    updateIncomingReportStatus(
      forwardingReport.id,
      'under_investigation',
      forwardNotes.trim() || 'Forwarded with CTO executive recommendation',
      forwardTo
    )

    showToast(`Escalation forwarded to ${forwardTo}`, 'success')
    setForwardingReport(null)
    setForwardNotes('')
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewingReport) return

    updateIncomingReportStatus(
      reviewingReport.id,
      newStatus,
      feedback.trim() || undefined
    )

    showToast(`Report status updated to ${newStatus.replace('_', ' ')}`, 'success')
    setReviewingReport(null)
    setFeedback('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Executive Reports & Escalation Center
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review incoming technical blockers from PMs, forward to C-Level, and submit strategic engineering briefs
          </p>
        </div>
        <div className="flex items-center gap-2">
          {incomingReports.length > 0 && (
            <Badge variant="purple" size="sm">
              <Inbox className="w-3.5 h-3.5 mr-1" />
              {incomingReports.length} Incoming PM Escalation{incomingReports.length > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'incoming'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          Incoming PM Escalations ({incomingReports.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'create'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          New Strategic Report
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'history'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          CTO Outgoing Briefs ({ctoReports.length})
        </button>
      </div>

      {/* Tab 1: Incoming PM Escalations */}
      {activeTab === 'incoming' && (
        <div className="space-y-4">
          {incomingReports.length === 0 ? (
            <Card title="Incoming Reports" icon={Inbox}>
              <div className="py-10 text-center text-xs text-slate-400">
                No active incoming escalations from Project Managers.
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {incomingReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 flex flex-col justify-between shadow-2xs space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="indigo" size="xs">
                          {report.category || 'TECHNICAL'}
                        </Badge>
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                          {report.title}
                        </span>
                      </div>
                      <StatusPill status={report.status} size="sm" />
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 mb-2">
                      {report.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                      <span>Submitted by: <strong className="text-slate-700 dark:text-slate-300">{report.userId}</strong></span>
                      <span>Target: {report.recipient}</span>
                      <span>Date: {formatDate(report.date || report.submittedAt, 'short')}</span>
                      {report.forwardedTo && (
                        <span className="text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                          <Share2 className="w-3 h-3" />
                          Forwarded to {report.forwardedTo}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions: Review / Update Status + Forward to C-Level */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2 text-xs">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => {
                        setReviewingReport(report)
                        setNewStatus(report.status)
                      }}
                    >
                      Update Status
                    </Button>
                    <Button
                      variant="secondary"
                      size="xs"
                      icon={Share2}
                      onClick={() => setForwardingReport(report)}
                    >
                      Forward to C-Level
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Create Strategic CTO Report */}
      {activeTab === 'create' && (
        <Card
          title="Author Executive Engineering Brief"
          subtitle="Submit formal technical proposals, infrastructure CapEx requests, or security briefings to the Executive Committee"
          icon={Send}
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient *
                </label>
                <select
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
                >
                  <option value="CEO — Victoria Sterling-Fox">CEO — Victoria Sterling-Fox</option>
                  <option value="Board of Directors">Board of Directors</option>
                  <option value="CFO — Vincent Gallagher">CFO — Vincent Gallagher (CapEx / Budget)</option>
                  <option value="CPO — Amara Okafor">CPO — Amara Okafor (Headcount / Talent)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Report Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
                >
                  <option value="Architecture & Infrastructure Proposal">Architecture & Infrastructure Proposal</option>
                  <option value="Quarterly Engineering Health Brief">Quarterly Engineering Health Brief</option>
                  <option value="Cloud Infrastructure CapEx Request">Cloud Infrastructure CapEx Request</option>
                  <option value="Security Posture & Compliance Report">Security Posture & Compliance Report</option>
                  <option value="Sprint Velocity Post-Mortem">Sprint Velocity Post-Mortem</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Report Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Q4 Migration to Multi-Region PostgreSQL & Redis Cache Clustering"
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Project (Optional)
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
                >
                  <option value="">Company-Wide / Core Platform</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} — {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Architecture Documentation / Spec URL
                </label>
                <input
                  type="url"
                  placeholder="https://docs.pointfex.com/architecture/rfc-042"
                  value={docsUrl}
                  onChange={(e) => setDocsUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Executive Summary & Technical Recommendations *
              </label>
              <textarea
                rows={5}
                required
                placeholder="Detail the technical rationale, projected return on investment, engineering resource allocation, and key milestones..."
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500 resize-none"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="primary" size="sm" type="submit" icon={Send}>
                Submit to Executive Committee
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tab 3: CTO Outgoing Reports Log */}
      {activeTab === 'history' && (
        <Card title={`CTO Outgoing Briefs (${ctoReports.length})`} icon={FileText}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold text-[11px]">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Recipient</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Spec Docs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {ctoReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No outgoing briefs submitted yet.
                    </td>
                  </tr>
                ) : (
                  ctoReports.map((rep) => (
                    <tr
                      key={rep.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {formatDate(rep.date || rep.submittedAt, 'short')}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                        {rep.title}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="indigo" size="xs">
                          {rep.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {rep.recipient}
                      </td>
                      <td className="py-3 px-3">
                        <StatusPill status={rep.status} size="sm" />
                      </td>
                      <td className="py-3 px-3">
                        {rep.docsUrl ? (
                          <a
                            href={rep.docsUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Link
                          </a>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal: Forward to C-Level */}
      <Modal
        isOpen={!!forwardingReport}
        onClose={() => setForwardingReport(null)}
        title="Forward Escalation to Executive Committee"
      >
        <form onSubmit={handleForwardSubmit} className="space-y-4">
          <p className="text-xs text-slate-500">
            Forwarding <strong className="text-slate-800 dark:text-slate-200">{forwardingReport?.title}</strong> to C-Suite leadership with CTO executive backing.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Executive Recipient *
            </label>
            <select
              value={forwardTo}
              onChange={(e) => setForwardTo(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
            >
              <option value="CEO — Victoria Sterling-Fox">CEO — Victoria Sterling-Fox</option>
              <option value="CFO — Vincent Gallagher">CFO — Vincent Gallagher (Financial / Budget)</option>
              <option value="CPO — Amara Okafor">CPO — Amara Okafor (People & Squad Health)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              CTO Endorsement & Executive Recommendation Notes
            </label>
            <textarea
              rows={3}
              placeholder="Outline why this technical request requires executive intervention or budget clearance..."
              value={forwardNotes}
              onChange={(e) => setForwardNotes(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setForwardingReport(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={Share2}>
              Forward Report
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Review / Update Status */}
      <Modal
        isOpen={!!reviewingReport}
        onClose={() => setReviewingReport(null)}
        title="Update Escalation Status"
      >
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status *
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
            >
              <option value="pending">Pending</option>
              <option value="under_investigation">Under Investigation / Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected / Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              CTO Feedback / Resolution Notes
            </label>
            <textarea
              rows={3}
              placeholder="Add guidance or state how the blocker was resolved..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setReviewingReport(null)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Status
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
