import React, { useState } from 'react'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { useCtoData } from '../../hooks/useCtoData'
import { useApp } from '../../context/AppContext'
import {
  User,
  RotateCcw,
  Mail,
  Globe,
  Tag,
  X,
  Plus,
  ShieldCheck,
  Crown,
} from 'lucide-react'

export function CtoSettingsPage() {
  const { cto } = useCtoData()
  const { resetDemoData, updateCtoProfile, showToast } = useApp()

  const [newSkillInput, setNewSkillInput] = useState('')

  const currentSkills = cto?.skills || [
    'System Architecture',
    'Distributed Systems',
    'Microservices',
    'Kubernetes',
    'Rust',
    'TypeScript',
    'Zero-Trust Security',
    'SOC2 Compliance',
    'LLM Ops',
  ]

  const handleAddSkill = (e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = newSkillInput.trim()
    if (!trimmed) return
    if (currentSkills.includes(trimmed)) {
      setNewSkillInput('')
      return
    }
    const updated = [...currentSkills, trimmed]
    updateCtoProfile({ skills: updated })
    setNewSkillInput('')
    showToast(`Added competency: "${trimmed}"`, 'success')
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = currentSkills.filter((s) => s !== skillToRemove)
    updateCtoProfile({ skills: updated })
    showToast(`Removed competency: "${skillToRemove}"`, 'info')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Profile & System Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Executive CTO credentials, technical competency tags, and workspace preferences
        </p>
      </div>

      {/* Identity Card (Read-only, matching Dev & PM) */}
      <Card title="Chief Technology Officer Identity" icon={User}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="relative">
            <img
              src={cto?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={cto?.name || 'Dr. Arthur Sterling'}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
            />
            <span
              className="w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 absolute -bottom-0.5 -right-0.5"
              title="Online"
            />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {cto?.name || 'Dr. Arthur Sterling'}
              </h3>
              <Badge variant="lime" size="xs">
                {cto?.role?.toUpperCase() || 'CTO'}
              </Badge>
              <Badge variant="indigo" size="xs">
                ID: {cto?.id || 'user_cto_01'}
              </Badge>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {cto?.title || 'Chief Technology Officer & Head of Engineering'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {cto?.email || 'arthur.sterling@pointfex.com'}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                {cto?.timezone || 'America/New_York (UTC-5)'}
              </span>
              <span className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-purple-500" />
                Engineering Executive Committee
              </span>
            </div>
          </div>
        </div>

        {cto?.bio && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-850 p-3 rounded-2xl">
            {cto.bio}
          </div>
        )}
      </Card>

      {/* Skills & Competencies (Editable - Add / Remove tags only, matching Dev & PM) */}
      <Card
        title="Technical Competencies & Domains"
        subtitle="Manage the engineering domains and architecture specialties associated with your executive profile"
        icon={Tag}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {currentSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium border border-slate-200/80 dark:border-slate-700/80 group"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                  title={`Remove ${skill}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSkill} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Add domain competency (e.g. eBPF, WebAssembly, Kafka, LLM Guardrails)..."
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              className="flex-1 text-xs px-3.5 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-lime-500"
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              icon={Plus}
              disabled={!newSkillInput.trim()}
            >
              Add Domain
            </Button>
          </form>
        </div>
      </Card>

      {/* System & Workspace Preferences */}
      <Card
        title="Engineering Workspace Preferences"
        subtitle="Configure default branch conventions and environment defaults"
        icon={ShieldCheck}
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                Default Production Branch Policy
              </div>
              <div className="text-[11px] text-slate-400">
                Enforces strict branch protection and PR reviews on <code className="font-mono text-lime-600 dark:text-lime-400">main</code>
              </div>
            </div>
            <Badge variant="emerald" size="xs">
              Enforced
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                Automated Quality Gate Blocking
              </div>
              <div className="text-[11px] text-slate-400">
                Block PR merging if test coverage is under 85% or security hotspots are unresolved
              </div>
            </div>
            <Badge variant="emerald" size="xs">
              Active
            </Badge>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                Reset Demo Data
              </div>
              <div className="text-[11px] text-slate-400">
                Restore all projects, tasks, pull requests, and security alerts to initial state
              </div>
            </div>
            <Button
              variant="danger"
              size="xs"
              icon={RotateCcw}
              onClick={() => {
                if (window.confirm('Reset all demo data across Developer, PM, and CTO workspaces?')) {
                  resetDemoData()
                  showToast('Demo data reset to initial seed values.', 'info')
                }
              }}
            >
              Reset Data
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
