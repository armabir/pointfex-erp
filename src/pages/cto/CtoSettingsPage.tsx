import React, { useState } from 'react'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { AvatarPickerModal } from '../../components/common/AvatarPickerModal'
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
  Camera,
} from 'lucide-react'

export function CtoSettingsPage() {
  const { cto } = useCtoData()
  const { currentRole, currentUser, resetDemoData, updateCtoProfile, updateExecutiveProfile, showToast } = useApp()

  const [newSkillInput, setNewSkillInput] = useState('')
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  const activeUser = currentUser || cto

  const handleUpdateProfile = (fields: any) => {
    if (currentRole === 'cto') {
      updateCtoProfile(fields)
    } else {
      updateExecutiveProfile(currentRole, fields)
    }
  }

  const currentSkills = activeUser?.skills || [
    'Executive Leadership',
    'Strategic Planning',
    'Cross-Functional Governance',
    'Financial Modeling',
    'Enterprise Architecture',
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
    handleUpdateProfile({ skills: updated })
    setNewSkillInput('')
    showToast(`Added competency: "${trimmed}"`, 'success')
  }

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = currentSkills.filter((s) => s !== skillToRemove)
    handleUpdateProfile({ skills: updated })
    showToast(`Removed competency: "${skillToRemove}"`, 'info')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Profile & System Settings
        </h2>
      </div>

      {/* Identity Card (Read-only, matching Dev & PM) */}
      <Card
        title={`${activeUser?.title || 'Executive'} Identity`}
        icon={User}
        action={
          <Button
            variant="secondary"
            size="xs"
            icon={Camera}
            onClick={() => setIsAvatarModalOpen(true)}
          >
            Change Picture
          </Button>
        }
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div
            className="relative group cursor-pointer shrink-0"
            onClick={() => setIsAvatarModalOpen(true)}
            title="Click to change profile picture"
          >
            <img
              src={activeUser?.avatarUrl || activeUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={activeUser?.name || 'Executive'}
              className="w-20 h-20 rounded-3xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span
              className="w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 absolute -bottom-0.5 -right-0.5"
              title="Online"
            />
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeUser?.name || 'Executive'}
              </h3>
              <Badge variant="lime" size="xs">
                {activeUser?.role?.toUpperCase() || 'EXECUTIVE'}
              </Badge>
              <Badge variant="indigo" size="xs">
                ID: {activeUser?.id || 'user_exec'}
              </Badge>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {activeUser?.title || 'Executive Leadership'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {activeUser?.email || 'executive@pointfex.internal'}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                {activeUser?.timezone || 'America/New_York (UTC-5)'}
              </span>
              <span className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-purple-500" />
                Pointfex Executive Committee
              </span>
            </div>
          </div>
        </div>

        {activeUser?.bio && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-slate-850 p-3 rounded-2xl">
            {activeUser.bio}
          </div>
        )}
      </Card>

      {/* Skills & Competencies (Editable - Add / Remove tags only, matching Dev & PM) */}
      <Card
        title="Technical Competencies & Domains"
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

      <AvatarPickerModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={activeUser?.avatarUrl || activeUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
        onSave={(avatar) => handleUpdateProfile({ avatar, avatarUrl: avatar })}
        userName={activeUser?.name || 'Executive'}
      />
    </div>
  )
}
