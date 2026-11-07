import React, { useState } from 'react'
import { Card } from '../../components/common/Card.jsx'
import { Badge } from '../../components/common/Badge.jsx'
import { Button } from '../../components/common/Button.jsx'
import { useDeveloperData } from '../../hooks/useDeveloperData.js'
import { useApp } from '../../context/AppContext.jsx'
import {
  User,
  RotateCcw,
  GitBranch,
  Mail,
  Globe,
  Tag,
  X,
  Plus,
} from 'lucide-react'

export function DeveloperSettingsPage() {
  const { dev } = useDeveloperData()
  const { resetDemoData, updateUserProfile, showToast } = useApp()

  const [newSkillInput, setNewSkillInput] = useState('')

  const handleAddSkill = (e) => {
    e?.preventDefault()
    const trimmed = newSkillInput.trim()
    if (!trimmed) return
    const currentSkills = dev?.skills || []
    if (currentSkills.includes(trimmed)) {
      setNewSkillInput('')
      return
    }
    const updated = [...currentSkills, trimmed]
    updateUserProfile({ skills: updated })
    setNewSkillInput('')
    showToast(`Added skill: "${trimmed}"`, 'success')
  }

  const handleRemoveSkill = (skillToRemove) => {
    const currentSkills = dev?.skills || []
    const updated = currentSkills.filter((s) => s !== skillToRemove)
    updateUserProfile({ skills: updated })
    showToast(`Removed skill: "${skillToRemove}"`, 'info')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Profile & Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Developer identity and technical skills management
        </p>
      </div>

      {/* Developer Profile Information Card - View-only */}
      <Card title="Developer Identity" icon={User}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white dark:bg-lime-400 dark:text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
            {dev?.initials || 'AR'}
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {dev?.name}
              </span>
              <Badge variant="lime" size="xs">
                {dev?.title}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-slate-500 dark:text-slate-400 pt-1 text-xs">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {dev?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> {dev?.timezone}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px]">
                <GitBranch className="w-3.5 h-3.5 text-slate-400" /> {dev?.github}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Technical Skills & Expertise - Skills can be added or removed */}
      <Card
        title="Technical Skills"
        subtitle="Add or remove technologies in your skillset"
        icon={Tag}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs">
            {(dev?.skills || []).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium transition-all group border border-slate-200/50 dark:border-slate-700/60"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 ml-0.5 cursor-pointer transition-colors"
                  title={`Remove ${skill}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Add skill input */}
          <form onSubmit={handleAddSkill} className="pt-1 flex items-center gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add skill (e.g., GraphQL, Docker, Rust)..."
              value={newSkillInput}
              onChange={(e) => setNewSkillInput(e.target.value)}
              className="flex-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
            />
            <Button
              type="submit"
              variant="secondary"
              size="xs"
              icon={Plus}
            >
              Add Skill
            </Button>
          </form>
        </div>
      </Card>

      {/* Demo Controls */}
      <Card title="Prototype Controls" icon={RotateCcw}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200 block">
              Reset Simulated Data
            </span>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">
              Restore mock database, projects, tasks, earnings, and user preferences back to initial state.
            </p>
          </div>

          <Button
            variant="danger"
            size="sm"
            icon={RotateCcw}
            onClick={resetDemoData}
          >
            Reset All Data
          </Button>
        </div>
      </Card>
    </div>
  )
}
