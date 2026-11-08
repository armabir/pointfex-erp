import { useState } from 'react'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'
import { useCtoData } from '../../hooks/useCtoData'
import { useApp } from '../../context/AppContext'
import { formatDate, formatCurrency } from '../../utils/formatters'
import type { SecurityAlert } from '../../types'
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Play,
  Bug,
  Award,
  Terminal,
} from 'lucide-react'

export function CtoSecurityTestingPage() {
  const { securityAlerts, testingSuites, bugBounties, projects, projectManagers } = useCtoData()
  const { createSecurityIssue, updateSecurityIssueStatus, showToast } = useApp()

  const [activeTab, setActiveTab] = useState<'vulnerabilities' | 'test_suites' | 'bug_bounty'>('vulnerabilities')

  // Log Security Advisory Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [projectId, setProjectId] = useState(projects[0]?.id || '')
  const [severity, setSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('high')
  const [category, setCategory] = useState<'dependency' | 'auth' | 'injection' | 'encryption' | 'infrastructure'>('dependency')
  const [assignedPmId] = useState(projectManagers[0]?.id || '')
  const [cveOrPackage, setCveOrPackage] = useState('')
  const [description, setDescription] = useState('')
  const [recommendation, setRecommendation] = useState('')

  // Selected Alert for Details
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null)

  const criticalCount = securityAlerts.filter((s) => s.severity === 'critical' && s.status !== 'resolved').length
  const openCount = securityAlerts.filter((s) => s.status !== 'resolved').length

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !projectId) {
      showToast('Please fill in required fields.', 'error')
      return
    }

    createSecurityIssue({
      title: title.trim(),
      projectId,
      severity,
      category,
      assignedPmId,
      cveOrPackage: cveOrPackage.trim() || 'Internal Security Audit',
      description: description.trim(),
      recommendation: recommendation.trim(),
    })

    setIsLogModalOpen(false)
    setTitle('')
    setDescription('')
    setRecommendation('')
  }

  const handleStatusChange = (alertId: string, newStatus: 'open' | 'investigating' | 'patch_in_progress' | 'resolved') => {
    updateSecurityIssueStatus(alertId, newStatus)
    showToast(`Security issue status set to ${newStatus.replace('_', ' ')}`, 'success')
  }

  const handleRunSuite = (suiteName: string) => {
    showToast(`Executing automated test suite: ${suiteName}... All checks passed!`, 'success')
  }

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
        return <Badge variant="rose" size="xs">CRITICAL</Badge>
      case 'high':
        return <Badge variant="amber" size="xs">HIGH</Badge>
      case 'medium':
        return <Badge variant="sky" size="xs">MEDIUM</Badge>
      default:
        return <Badge variant="slate" size="xs">LOW</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Security Posture & Automated Testing
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enterprise vulnerability management, automated regression suites, and bug bounty disclosures
          </p>
        </div>
        <div className="flex items-center gap-2">
          {criticalCount > 0 ? (
            <Badge variant="rose" size="sm" dot>
              {criticalCount} Critical CVE Alert
            </Badge>
          ) : (
            <Badge variant="emerald" size="sm" dot>
              Zero Critical CVEs
            </Badge>
          )}
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setIsLogModalOpen(true)}
          >
            Log Security Advisory
          </Button>
        </div>
      </div>

      {/* Top 4 Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              {openCount}
            </div>
            <div className="text-[11px] text-slate-400">Open Security Alerts</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              {testingSuites.length} Suites
            </div>
            <div className="text-[11px] text-slate-400">CI/CD Automated Tests</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              99.2%
            </div>
            <div className="text-[11px] text-slate-400">Regression Pass Rate</div>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Bug className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100">
              {bugBounties.length} Reports
            </div>
            <div className="text-[11px] text-slate-400">Bug Bounty Triaged</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('vulnerabilities')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'vulnerabilities'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          Vulnerabilities & CVEs ({securityAlerts.length})
        </button>
        <button
          onClick={() => setActiveTab('test_suites')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'test_suites'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          Automated Test Suites ({testingSuites.length})
        </button>
        <button
          onClick={() => setActiveTab('bug_bounty')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'bug_bounty'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Bug className="w-3.5 h-3.5" />
          Bug Bounty Log ({bugBounties.length})
        </button>
      </div>

      {/* Tab 1: Vulnerabilities */}
      {activeTab === 'vulnerabilities' && (
        <div className="space-y-3">
          {securityAlerts.map((alert) => {
            const project = projects.find((p) => p.id === alert.projectId)

            return (
              <div
                key={alert.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(alert.severity)}
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                      {alert.title}
                    </span>
                    <Badge variant="indigo" size="xs">
                      {project?.code || 'SEC'}
                    </Badge>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                    {alert.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                      {alert.cveOrPackage || 'Security Advisory'}
                    </span>
                    <span>Category: <strong className="text-slate-600 dark:text-slate-300 capitalize">{alert.category}</strong></span>
                    <span>Detected {formatDate(alert.detectedAt, 'short')}</span>
                  </div>
                </div>

                {/* Status Dropdown & Action */}
                <div className="flex items-center gap-2">
                  <select
                    value={alert.status}
                    onChange={(e) => handleStatusChange(alert.id, e.target.value as any)}
                    className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-lime-500"
                  >
                    <option value="open">Open</option>
                    <option value="investigating">Investigating</option>
                    <option value="patch_in_progress">Patch in Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>

                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setSelectedAlert(alert)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tab 2: Test Suites */}
      {activeTab === 'test_suites' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {testingSuites.map((suite) => (
            <div
              key={suite.id}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xs space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                    {suite.name}
                  </h4>
                  <Badge variant="emerald" size="xs">
                    {Math.round((suite.passed / suite.totalTests) * 100)}% Pass
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Total Tests</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {suite.totalTests.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Execution Time</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {suite.duration}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Last automated run: {suite.lastRun}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button
                  variant="secondary"
                  size="xs"
                  icon={Play}
                  onClick={() => handleRunSuite(suite.name)}
                >
                  Run Suite
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Bug Bounty Log */}
      {activeTab === 'bug_bounty' && (
        <Card title="HackerOne & Internal Bug Bounty Hall of Fame" icon={Award}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold text-[11px]">
                  <th className="py-2.5 px-3">Researcher</th>
                  <th className="py-2.5 px-3">Vulnerability Finding</th>
                  <th className="py-2.5 px-3">Target Project</th>
                  <th className="py-2.5 px-3">Bounty Reward</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Disclosed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {bugBounties.map((bb) => {
                  const project = projects.find((p) => p.id === bb.projectId)

                  return (
                    <tr
                      key={bb.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100 font-mono">
                        {bb.reporterName}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                        {bb.title}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="indigo" size="xs">
                          {project?.code || 'PF'}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                        {formatCurrency(bb.bountyAmount)}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="emerald" size="xs">
                          {bb.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {formatDate(bb.submittedAt, 'short')}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal: Log Security Advisory */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Log Company Security Advisory"
      >
        <form onSubmit={handleCreateAlert} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Advisory Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Critical Remote Code Execution via Malformed Tar Header"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Affected Project *
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Severity Level *
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
              >
                <option value="critical">Critical (Immediate patch required)</option>
                <option value="high">High (Sprint blocker)</option>
                <option value="medium">Medium (Standard remediation)</option>
                <option value="low">Low (Hardening advisory)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
              >
                <option value="dependency">Dependency / Package CVE</option>
                <option value="auth">Authentication & JWT</option>
                <option value="injection">SQL / Command Injection</option>
                <option value="encryption">Encryption & Secret Exposure</option>
                <option value="infrastructure">Cloud Infrastructure & CORS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                CVE / Package Identifier
              </label>
              <input
                type="text"
                placeholder="CVE-2026-4481 or jsonwebtoken@8.5.1"
                value={cveOrPackage}
                onChange={(e) => setCveOrPackage(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Vulnerability Description
            </label>
            <textarea
              rows={3}
              placeholder="Technical summary of vulnerability, exploit vector, and blast radius..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Remediation Recommendation
            </label>
            <input
              type="text"
              placeholder="e.g. Upgrade dependency to v4.2.1 and enforce nonce validation"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-lime-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <Button variant="ghost" size="sm" onClick={() => setIsLogModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" type="submit">
              Log Advisory & Escalate
            </Button>
          </div>
        </form>
      </Modal>

      {/* Alert Details Modal */}
      <Modal
        isOpen={!!selectedAlert}
        onClose={() => setSelectedAlert(null)}
        title={selectedAlert ? `Security Finding: ${selectedAlert.title}` : 'Alert'}
      >
        {selectedAlert && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-mono text-slate-400">{selectedAlert.cveOrPackage}</span>
              {getSeverityBadge(selectedAlert.severity)}
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block mb-0.5">Description:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  {selectedAlert.description}
                </p>
              </div>

              {selectedAlert.recommendation && (
                <div>
                  <span className="text-slate-400 font-semibold block mb-0.5">Remediation:</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-emerald-50 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-800/40">
                    {selectedAlert.recommendation}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="ghost" size="sm" onClick={() => setSelectedAlert(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
