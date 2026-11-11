import React, { useState } from 'react'
import { Card } from '../../components/common/Card'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { Avatar } from '../../components/common/Avatar'
import { AvatarPickerModal } from '../../components/common/AvatarPickerModal'
import { AdditionalGrantedAccessCard } from '../../components/common/AdditionalGrantedAccessCard'
import { useDeveloperData } from '../../hooks/useDeveloperData'
import { useApp } from '../../context/AppContext'
import { User, GitBranch, Mail, Globe, Tag, X, Plus, Camera } from 'lucide-react'

export function DeveloperSettingsPage() {
  const { dev } = useDeveloperData()
  const { updateUserProfile, showToast } = useApp()

  const [newSkillInput, setNewSkillInput] = useState('')
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  const handleAddSkill = (e?: React.FormEvent) => {
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

  const handleRemoveSkill = (skillToRemove: string) => {
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
      <Card
        title="Developer Identity"
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
              src={dev?.avatarUrl || dev?.avatar}
              name={dev?.name || 'Developer'}
              initials={dev?.initials}
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

      <AvatarPickerModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={dev?.avatarUrl || dev?.avatar || ''}
        onSave={(avatar) => updateUserProfile({ avatar, avatarUrl: avatar })}
        userName={dev?.name || 'Developer'}
      />

      {/* Technical Skills & Expertise - Skills can be added or removed */}
      <Card title="Technical Skills" icon={Tag}>
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
