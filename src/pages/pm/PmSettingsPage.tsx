import React, { useState } from 'react'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Avatar } from '../../components/common/Avatar'
import { AvatarPickerModal } from '../../components/common/AvatarPickerModal'
import { AdditionalGrantedAccessCard } from '../../components/common/AdditionalGrantedAccessCard'
import { usePmData } from '../../hooks/usePmData'
import { useApp } from '../../context/AppContext'
import { User, Mail, Globe, Tag, X, Plus, Users, Camera } from 'lucide-react'

export function PmSettingsPage() {
  const { pm, team } = usePmData()
  const { updatePmProfile, showToast } = useApp()

  const [newSkillInput, setNewSkillInput] = useState('')
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  const currentSkills = pm?.skills || [
    'Agile Delivery',
    'Kanban & Sprint Pacing',
    'Budget & Resource Forecasting',
    'Scrum Master',
    'Cross-Functional Leadership',
    'Risk Mitigation',
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
    updatePmProfile({ skills: updated })
    setNewSkillInput('')
    showToast(`Added competency: "${trimmed}"`, 'success')
  }

  const handleRemoveSkill = (skillToRemove: string) => {
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
      <Card
        title="Management Identity"
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
          <div
            className="relative group cursor-pointer shrink-0"
            onClick={() => setIsAvatarModalOpen(true)}
            title="Click to change profile picture"
          >
            <Avatar
              src={pm?.avatarUrl || pm?.avatar}
              name={pm?.name || 'Project Manager'}
              initials={pm?.initials}
              size="xl"
              className="border-2 border-slate-200 dark:border-slate-700 shadow-sm group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span
              className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 absolute -bottom-0.5 -right-0.5"
              title="Online"
            />
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 dark:text-white">{pm?.name}</span>
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

      <AvatarPickerModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={pm?.avatarUrl || pm?.avatar || ''}
        onSave={(avatar) => updatePmProfile({ avatar, avatarUrl: avatar })}
        userName={pm?.name || 'Project Manager'}
      />

      {/* Skills & Expertise - Skills can be added or removed */}
      <Card title="Management Skills & Competencies" icon={Tag}>
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
            <Button type="submit" variant="secondary" size="xs" icon={Plus}>
              Add Skill
            </Button>
          </form>
        </div>
      </Card>

      <AdditionalGrantedAccessCard />
    </div>
  )
}

export default PmSettingsPage
