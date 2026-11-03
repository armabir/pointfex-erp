import React, { useState } from 'react'
import { Card } from '../../components/common/Card.jsx'
import { Badge } from '../../components/common/Badge.jsx'
import { Button } from '../../components/common/Button.jsx'
import { useDeveloperData } from '../../hooks/useDeveloperData.js'
import { useApp } from '../../context/AppContext.jsx'
import { formatDate } from '../../utils/formatters.js'
import {
  Send,
  AlertOctagon,
  FileCheck2,
  GitBranch,
  ShieldAlert,
} from 'lucide-react'

export function DeveloperReportPage() {
  const { data, addSubmission, addComplaint } = useApp()
  const { devProjects, pm } = useDeveloperData()

  const [activeTab, setActiveTab] = useState('submission') // 'submission' | 'complaint'

  // Form State: Deliverable Submission
  const [submissionProject, setSubmissionProject] = useState(devProjects[0]?.id || 'proj_01')
  const [milestoneTitle, setMilestoneTitle] = useState('')
  const [prLink, setPrLink] = useState('')
  const [submissionNotes, setSubmissionNotes] = useState('')

  // Form State: Complaint
  const [complaintCategory, setComplaintCategory] = useState('pm_communication')
  const [complaintSeverity, setComplaintSeverity] = useState('medium')
  const [complaintDetails, setComplaintDetails] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  // Current user reports
  const userReports = data.reports.filter((r) => r.userId === 'user_dev_01')
  const submissions = userReports.filter((r) => r.type === 'project_submission')
  const complaints = userReports.filter((r) => r.type === 'complaint')

  // Handle Deliverable Submit
  const handleSubmissionSubmit = (e) => {
    e.preventDefault()
    if (!milestoneTitle.trim() || !prLink.trim()) return

    const selectedProj = devProjects.find((p) => p.id === submissionProject)

    addSubmission({
      id: `rep_sub_${Date.now()}`,
      userId: 'user_dev_01',
      teamId: 'team_01',
      pmId: selectedProj?.pmId || 'user_pm_01',
      type: 'project_submission',
      projectId: submissionProject,
      projectName: selectedProj?.name || 'Project',
      milestone: milestoneTitle.trim(),
      prUrl: prLink.trim(),
      summary: submissionNotes.trim() || 'Deliverable ready for QA and PM sign-off.',
      date: new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      reviewFeedback: 'Pending PM review.',
    })

    setMilestoneTitle('')
    setPrLink('')
    setSubmissionNotes('')
  }

  // Handle Complaint Submit
  const handleComplaintSubmit = (e) => {
    e.preventDefault()
    if (!complaintDetails.trim()) return

    addComplaint({
      id: `rep_comp_${Date.now()}`,
      userId: 'user_dev_01',
      teamId: 'team_01',
      type: 'complaint',
      category: complaintCategory,
      severity: complaintSeverity,
      isAnonymous,
      title: `${complaintCategory.replace('_', ' ').toUpperCase()} Escalation`,
      description: complaintDetails.trim(),
      date: new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString(),
      status: 'investigating',
      assignedTo: 'CPO / People Operations',
      resolutionNotes: 'Complaint logged. People Ops lead investigating with PM.',
    })

    setComplaintDetails('')
    setIsAnonymous(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Submissions & Complaints
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Submit project deliverables for PM review or escalate grievances to leadership
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('submission')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'submission'
              ? 'bg-slate-900 text-white dark:bg-lime-400 dark:text-slate-950 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Submit Project Deliverable</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 dark:bg-black/10">
            {submissions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('complaint')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'complaint'
              ? 'bg-rose-600 text-white dark:bg-rose-500 shadow-2xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>File a Complaint / Escalation</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 dark:bg-black/10">
            {complaints.length}
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {activeTab === 'submission' ? (
            /* Deliverable Submission Form */
            <Card
              title="New Milestone Deliverable"
              subtitle={`Reviewer: ${pm?.name || 'Sarah Jenkins'} (PM)`}
              icon={FileCheck2}
            >
              <form onSubmit={handleSubmissionSubmit} className="space-y-4 text-xs">
                {/* Project Selection */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                    Target Project
                  </label>
                  <select
                    value={submissionProject}
                    onChange={(e) => setSubmissionProject(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:border-slate-400 cursor-pointer font-medium"
                  >
                    {devProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Milestone Title */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                    Milestone / Feature Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Milestone 3: Query Engine Optimization"
                    value={milestoneTitle}
                    onChange={(e) => setMilestoneTitle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:border-slate-400"
                  />
                </div>

                {/* PR or Branch Link */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                    Pull Request Link or Branch Name
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                      <GitBranch className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="https://github.com/pointfex/... or branch name"
                      value={prLink}
                      onChange={(e) => setPrLink(e.target.value)}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:border-slate-400 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* Notes / Verification */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                    Deliverable Summary & Test Evidence
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Outline what was completed, benchmarks passed, and testing procedures..."
                    value={submissionNotes}
                    onChange={(e) => setSubmissionNotes(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:border-slate-400 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="lime" size="sm" icon={Send}>
                    Submit Deliverable to PM
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            /* File Complaint Form */
            <Card
              title="File Grievance / Complaint"
              subtitle="Escalated directly to CPO and Executive Management"
              icon={ShieldAlert}
            >
              <form onSubmit={handleComplaintSubmit} className="space-y-4 text-xs">
                {/* Category & Severity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                      Grievance Category
                    </label>
                    <select
                      value={complaintCategory}
                      onChange={(e) => setComplaintCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 cursor-pointer font-medium"
                    >
                      <option value="pm_communication">PM Communication & Unrealistic Deadlines</option>
                      <option value="workload_sla">Excessive Sprint Workload / SLA Dispute</option>
                      <option value="penalty_dispute">Penalty / Deduction Contest</option>
                      <option value="spec_ambiguity">Requirement & Spec Discrepancy</option>
                      <option value="dev_environment">Dev Tools & Infrastructure Blockers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                      Severity Level
                    </label>
                    <select
                      value={complaintSeverity}
                      onChange={(e) => setComplaintSeverity(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-slate-400 cursor-pointer font-medium"
                    >
                      <option value="low">Low — Constructive Feedback</option>
                      <option value="medium">Medium — Impacting Delivery Pace</option>
                      <option value="high">High — Blocking Progress / Unfair Penalty</option>
                      <option value="critical">Critical — Immediate Management Action</option>
                    </select>
                  </div>
                </div>

                {/* Complaint Details */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">
                    Detailed Explanation
                  </label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Describe the incident, specific dates, PM actions, or blockers clearly..."
                    value={complaintDetails}
                    onChange={(e) => setComplaintDetails(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:border-slate-400 resize-none"
                  />
                </div>

                {/* Anonymous Checkbox */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                  <label htmlFor="anonymous" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    Submit Anonymously (Identity concealed from team PM)
                  </label>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" variant="danger" size="sm" icon={ShieldAlert}>
                    Submit Complaint to People Ops
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        {/* Right Column: History & Trackers (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card
            title={activeTab === 'submission' ? 'Submission History' : 'Filed Complaints'}
            icon={activeTab === 'submission' ? FileCheck2 : AlertOctagon}
          >
            {activeTab === 'submission' ? (
              <div className="space-y-3">
                {submissions.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No deliverables submitted yet.
                  </p>
                ) : (
                  submissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {sub.milestone}
                        </span>
                        <Badge
                          variant={sub.status === 'approved' ? 'emerald' : 'amber'}
                          size="xs"
                        >
                          {sub.status === 'approved' ? 'Approved' : 'Pending Review'}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{sub.projectName}</span>
                        <span>{formatDate(sub.date, 'short')}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-sky-600 dark:text-sky-400 font-mono truncate">
                        <GitBranch className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{sub.prUrl}</span>
                      </div>

                      {sub.reviewFeedback && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300">
                          <span className="font-medium text-slate-800 dark:text-slate-200">PM Note:</span>{' '}
                          {sub.reviewFeedback}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {complaints.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No complaints filed.
                  </p>
                ) : (
                  complaints.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {comp.title}
                        </span>
                        <Badge
                          variant={
                            comp.status === 'resolved'
                              ? 'emerald'
                              : comp.severity === 'high'
                              ? 'rose'
                              : 'amber'
                          }
                          size="xs"
                        >
                          {comp.status === 'resolved' ? 'Resolved' : 'Investigating'}
                        </Badge>
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                        {comp.description}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700">
                        <span>Assigned: {comp.assignedTo || 'People Ops'}</span>
                        <span>{formatDate(comp.date, 'short')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
