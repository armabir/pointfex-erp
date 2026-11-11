import React, { useState } from 'react'
import {
  Compass,
  DollarSign,
  TrendingUp,
  FolderGit2,
  Users,
  ArrowRight,
  PlusCircle,
  Send,
  type LucideIcon,
} from 'lucide-react'
import { useExecutiveData } from '../../hooks/useExecutiveData'
import { useApp } from '../../context/AppContext'
import { formatCurrency } from '../../utils/formatters'
import { Button } from '../../components/common/Button'
import { Modal } from '../../components/common/Modal'

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

export function CeoDashboard() {
  const { treasury, projects, hrStats, confidentialComplaints, auditLogs } = useExecutiveData()

  const { setRoute, createExecutiveDirective, authorizeCeoAction } = useApp()

  // Modal: Create Executive Directive
  const [isDirectiveModalOpen, setIsDirectiveModalOpen] = useState(false)
  const [directiveTitle, setDirectiveTitle] = useState('')
  const [directiveDesc, setDirectiveDesc] = useState('')
  const [directiveAssigneeRole, setDirectiveAssigneeRole] = useState('cto')
  const [directivePriority, setDirectivePriority] = useState<any>('urgent')

  // Top 4 Stat Cards
  const statCards: StatCardItem[] = [
    {
      id: 'treasury',
      label: 'Treasury Capital',
      value: formatCurrency(treasury?.initialCapital || 500000),
      trend: `${formatCurrency(treasury?.unallocatedReserves || 120000)} Reserves`,
      trendSub: 'Financial Command',
      icon: DollarSign,
      cardBg: 'bg-[#fff4ea] dark:bg-[#201815] border-[#fee3cc] dark:border-amber-900/40',
      iconBg: 'bg-[#fee1c7] dark:bg-amber-900/60 text-amber-600 dark:text-amber-300',
      onClick: () => setRoute('budget'),
    },
    {
      id: 'projects',
      label: 'Active Squad Projects',
      value: projects.length,
      trend: '6 Core Squads In Delivery',
      trendSub: 'Engineering Radar',
      icon: FolderGit2,
      cardBg: 'bg-[#eff6ff] dark:bg-[#101b2d] border-[#dbeafe] dark:border-sky-900/40',
      iconBg: 'bg-[#dbeafe] dark:bg-sky-900/60 text-sky-600 dark:text-sky-300',
      onClick: () => setRoute('projects-repos'),
    },
    {
      id: 'headcount',
      label: 'Total Staff Headcount',
      value: 30,
      trend: `Morale: ${hrStats.avgSatisfactionIndex} / 5.0`,
      trendSub: 'People & Culture',
      icon: Users,
      cardBg: 'bg-[#eafaf7] dark:bg-[#0e211f] border-[#cbf3eb] dark:border-emerald-900/40',
      iconBg: 'bg-[#c8f5ed] dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300',
      onClick: () => setRoute('performance'),
    },
    {
      id: 'revenue',
      label: 'Client Revenue Invoiced',
      value: formatCurrency(treasury?.totalClientRevenue || 740000),
      trend: '100% Retainer Compliance',
      trendSub: 'Commercial Health',
      icon: TrendingUp,
      cardBg: 'bg-[#f5f3ff] dark:bg-[#1c1830] border-[#ede9fe] dark:border-purple-900/40',
      iconBg: 'bg-[#ede9fe] dark:bg-purple-900/60 text-purple-600 dark:text-purple-300',
      onClick: () => setRoute('budget'),
    },
  ]

  // Pending Decisions Queue
  const pendingDecisions = [
    {
      id: 'dec_01',
      title: 'Q4 Cloud Infrastructure Expansion ($15,000 Reserve Authorization)',
      domain: 'Financial / Infrastructure',
      submittedBy: 'Vincent Gallagher (CFO)',
      date: 'Today',
    },
    {
      id: 'dec_02',
      title: 'Senior Distributed Systems Architect Hiring Requisition',
      domain: 'People / Talent',
      submittedBy: 'Amara Okafor (CHRO)',
      date: 'Yesterday',
    },
    {
      id: 'dec_03',
      title: 'Promote Alex Rivera to Senior Lead Project Manager',
      domain: 'Governance / Leadership',
      submittedBy: 'Arthur Sterling (CTO)',
      date: 'Nov 06',
    },
  ]

  const handleDispatchDirective = (e: React.FormEvent) => {
    e.preventDefault()
    if (!directiveTitle) return
    createExecutiveDirective({
      title: directiveTitle,
      description: directiveDesc,
      assigneeRole: directiveAssigneeRole,
      priority: directivePriority,
    })
    setIsDirectiveModalOpen(false)
    setDirectiveTitle('')
    setDirectiveDesc('')
  }

  return (
    <div className="space-y-6">
      {/* 4 Soft Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.id}
              onClick={card.onClick}
              className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${card.cardBg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {card.label}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.iconBg}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {card.value}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>{card.trend}</span>
                {card.trendSub && <span className="opacity-75">{card.trendSub}</span>}
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Grid: Left 2 cols, Right 1 col */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Executive Radar Matrix & Authorizations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Radar 3 Pillars */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  Pointfex Executive Command Radar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Cross-functional telemetry across CFO, CTO, and CHRO domains
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={PlusCircle}
                onClick={() => setIsDirectiveModalOpen(true)}
              >
                Issue Directive
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Pillar 1: Financial */}
              <div
                onClick={() => setRoute('budget')}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-amber-300 dark:hover:border-amber-700 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    CFO Financial
                  </span>
                  <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {formatCurrency(treasury?.unallocatedReserves || 120000)}
                </div>
                <div className="text-xs text-slate-500 mt-1">Reserves Buffer Available</div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700 text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                  Budget Desk <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Pillar 2: Engineering */}
              <div
                onClick={() => setRoute('projects-repos')}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-sky-300 dark:hover:border-sky-700 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    CTO Engineering
                  </span>
                  <FolderGit2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  {projects.length} Squads On-Track
                </div>
                <div className="text-xs text-slate-500 mt-1">Quality Gate: 92.4% Avg</div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700 text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                  Projects & Repos <ArrowRight className="w-3 h-3" />
                </div>
              </div>

              {/* Pillar 3: People */}
              <div
                onClick={() => setRoute('performance')}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-emerald-300 dark:hover:border-emerald-700 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    CHRO People
                  </span>
                  <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="text-lg font-bold text-slate-900 dark:text-white">
                  30 Staff Monitored
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Morale 4.8 • {confidentialComplaints.length} Grievances
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700 text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
                  People & Culture <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Decisions Requiring CEO Authorization */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Decisions Requiring CEO Ratification
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Pending executive approvals awaiting CEO signature
            </p>

            <div className="space-y-3">
              {pendingDecisions.map((dec) => (
                <div
                  key={dec.id}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {dec.domain}
                      </span>
                      <span className="text-xs text-slate-400">{dec.date}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">
                      {dec.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Submitted by: {dec.submittedBy}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => authorizeCeoAction('executive_approval', dec.id, dec.title)}
                    >
                      Authorize
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Executive Audit Stream & C-Suite Shortcuts */}
        <div className="space-y-6">
          {/* Quick Subsystem Access */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              C-Suite Executive Desks
            </h3>

            <div className="space-y-2">
              <button
                onClick={() => setRoute('budget')}
                className="w-full p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <span>CFO Financial Command</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => setRoute('projects-repos')}
                className="w-full p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <span>CTO Engineering & Repos</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => setRoute('performance')}
                className="w-full p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <span>CHRO Performance & Culture</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => setRoute('audit-log')}
                className="w-full p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
              >
                <span>Corporate Audit Stream</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Recent High-Priority Audit Events */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Leadership Audit Stream
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRoute('audit-log')}
                className="text-sky-600 dark:text-sky-400"
              >
                Inspect
              </Button>
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 4).map((log) => (
                <div
                  key={log.id}
                  className="text-xs p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20"
                >
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {log.actorName || log.userId}
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="font-medium text-slate-900 dark:text-white">
                    {log.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Dispatch Executive Directive */}
      {isDirectiveModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsDirectiveModalOpen(false)}
          title="Dispatch Strategic Executive Directive"
        >
          <form onSubmit={handleDispatchDirective} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Recipient C-Suite Executive / Role
              </label>
              <select
                value={directiveAssigneeRole}
                onChange={(e) => setDirectiveAssigneeRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="cto">Chief Technology Officer (CTO) — Engineering</option>
                <option value="cfo">Chief Financial Officer (CFO) — Finance & Reserves</option>
                <option value="chro">Chief Human Resources Officer (CHRO) — Talent</option>
                <option value="pm">Project Managers (PMs) — Squad Execution</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Directive Title
              </label>
              <input
                type="text"
                placeholder="e.g., Accelerate Q4 Security Audit & ISO-27001 Readiness"
                value={directiveTitle}
                onChange={(e) => setDirectiveTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Directive Scope & Expected Deliverables
              </label>
              <textarea
                rows={3}
                placeholder="Specify execution parameters, milestone deadlines, and C-Suite sign-off criteria..."
                value={directiveDesc}
                onChange={(e) => setDirectiveDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Priority
              </label>
              <select
                value={directivePriority}
                onChange={(e) => setDirectivePriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
              >
                <option value="urgent">Urgent (Immediate Execution)</option>
                <option value="high">High Priority</option>
                <option value="medium">Standard Priority</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <Button variant="secondary" onClick={() => setIsDirectiveModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" icon={Send}>
                Dispatch Directive
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
