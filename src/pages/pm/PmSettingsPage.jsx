import React, { useState } from 'react'
import { Card } from '../../components/common/Card.jsx'
import { Badge } from '../../components/common/Badge.jsx'
import { Button } from '../../components/common/Button.jsx'
import { usePmData } from '../../hooks/usePmData.js'
import { useApp } from '../../context/AppContext.jsx'
import {
  User,
  RotateCcw,
  Mail,
  Globe,
  Tag,
  X,
  Plus,
  Users,
} from 'lucide-react'

export function PmSettingsPage() {
  const { pm, team } = usePmData()
  const { resetDemoData, updatePmProfile, showToast } = useApp()

  const [newSkillInput, setNewSkillInput] = useState('')

  const currentSkills = pm?.skills || [
    'Agile Delivery',
    'Kanban & Sprint Pacing',
    'Budget & Resource Forecasting',
    'Scrum Master',
    'Cross-Functional Leadership',
    'Risk Mitigation',
  ]

  const handleAddSkill = (e) => {
    e?.preventDefault()
    const trimmed = newSkillInput.trim()
    if (!trimmed) return
    if (currentSkills.includes(trimmed)) {
      setNewSkillInput('')
      return
    }
    const updated = [...currentSkills, trimmed]
    updatePmProfile({ skills: updated })
    setNewSkillInput('')
    showToast(`Added competency: "${trimmed}"`, 'success')
  }

  const handleRemoveSkill = (skillToRemove) => {
    const updated = currentSkills.filter((s) => s !== skillToRemove)
    updatePmProfile({ skills: updated })
    showToast(`Removed competency: "${skillToRemove}"`, 'info')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Profile & Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Project Manager identity and management skills
        </p>
      </div>

      {/* Profile Information Card - View-only */}
      <Card title="Management Identity" icon={User}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white dark:bg-lime-400 dark:text-slate-950 flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
            {pm?.initials || 'SJ'}
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 dark:text-white">
                {pm?.name}
              </span>
              <Badge variant="lime" size="xs">
                {pm?.title || 'Senior Project Manager'}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-slate-500 dark:text-slate-400 pt-1 text-xs">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {pm?.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" /> {pm?.timezone || 'UTC-5 (EST)'}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" /> {team?.name || 'Squad'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Skills & Expertise - Skills can be added or removed */}
      <Card
        title="Management Skills & Competencies"
        subtitle="Add or remove competencies in your management skillset"
        icon={Tag}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-xs">
            {currentSkills.map((skill) => (
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
              placeholder="Add skill (e.g., OKRs, Risk Matrix, Six Sigma)..."
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
            size="xs"
            icon={RotateCcw}
            onClick={resetDemoData}
          >
            Reset Demo Data
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default PmSettingsPage
