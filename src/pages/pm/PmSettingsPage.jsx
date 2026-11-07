import React, { useState } from 'react'
import { Card } from '../../components/common/Card.jsx'
import { Badge } from '../../components/common/Badge.jsx'
import { Button } from '../../components/common/Button.jsx'
import { usePmData } from '../../hooks/usePmData.js'
import { useApp } from '../../context/AppContext.jsx'
import {
  User,
  Mail,
  Globe,
  Tag,
  Plus,
  X,
  RotateCcw,
  Briefcase,
  Users,
} from 'lucide-react'

export function PmSettingsPage() {
  const { pm, team, teamProjects, teamMembers } = usePmData()
  const { resetDemoData, showToast } = useApp()

  const [skills, setSkills] = useState([
    'Agile Delivery',
    'Kanban & Sprint Pacing',
    'Budget & Resource Forecasting',
    'Scrum Master',
    'Cross-Functional Leadership',
    'Risk Mitigation',
  ])
  const [newSkill, setNewSkill] = useState('')

  const handleAddSkill = (e) => {
    e.preventDefault()
    const trimmed = newSkill.trim()
    if (!trimmed || skills.includes(trimmed)) return

    setSkills([...skills, trimmed])
    setNewSkill('')
    showToast(`Added competency: "${trimmed}"`, 'success')
  }

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove))
    showToast(`Removed competency: "${skillToRemove}"`, 'info')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Profile & Workspace Preferences
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Project Manager corporate identity, squad credentials, and workspace configuration
        </p>
      </div>

      {/* Identity Card (View Only) */}
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
                <Globe className="w-3.5 h-3.5 text-slate-400" /> UTC-5 (EST)
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" /> {team?.name}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Squad Oversight Summary */}
      <Card title="Assigned Squad Oversight" icon={Briefcase}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Managed Squad</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm block">
              {team?.name}
            </span>
            <span className="text-[11px] text-slate-500">{team?.focus}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Dedicated Engineers</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm block">
              {teamMembers.length} Developers
            </span>
            <span className="text-[11px] text-slate-500">
              {teamMembers.map((m) => m.name.split(' ')[0]).join(', ')}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[11px]">Sprint Deliverables</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm block">
              {teamProjects.length} Projects
            </span>
            <span className="text-[11px] text-slate-500">
              {teamProjects.map((p) => p.code).join(' & ')}
            </span>
          </div>
        </div>
      </Card>

      {/* Management Competencies */}
      <Card title="Management Competencies & Methodologies" icon={Tag}>
        <div className="space-y-4 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  title="Remove competency"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <form onSubmit={handleAddSkill} className="flex items-center gap-2 pt-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add management competency (e.g. OKR Alignment, Six Sigma)..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              icon={Plus}
              disabled={!newSkill.trim()}
            >
              Add
            </Button>
          </form>
        </div>
      </Card>

      {/* Danger Zone: Reset Demo Data */}
      <Card title="Workspace State & Demo Reset" icon={RotateCcw}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">
              Restore Demo State to Defaults
            </div>
            <p className="text-slate-500 dark:text-slate-400 mt-0.5">
              Resets all in-memory task status changes, created tasks, and submitted reports back to seed defaults.
            </p>
          </div>

          <Button
            variant="danger"
            size="sm"
            icon={RotateCcw}
            onClick={resetDemoData}
          >
            Reset All Demo Data
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default PmSettingsPage
