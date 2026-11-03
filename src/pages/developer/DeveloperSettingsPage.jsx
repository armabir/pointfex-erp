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
  Edit3,
  Check,
  X,
  Plus,
} from 'lucide-react'

export function DeveloperSettingsPage() {
  const { dev } = useDeveloperData()
  const { resetDemoData, updateUserProfile } = useApp()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    timezone: '',
    github: '',
    skills: [],
  })

  const [newSkillInput, setNewSkillInput] = useState('')

  const handleStartEdit = () => {
    setFormData({
      name: dev?.name || '',
      title: dev?.title || '',
      email: dev?.email || '',
      timezone: dev?.timezone || '',
      github: dev?.github || '',
      skills: dev?.skills ? [...dev.skills] : [],
    })
    setIsEditing(true)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddSkill = (e) => {
    e?.preventDefault()
    const trimmed = newSkillInput.trim()
    if (!trimmed) return
    if (formData.skills.includes(trimmed)) {
      setNewSkillInput('')
      return
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }))
    setNewSkillInput('')
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }))
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    updateUserProfile(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const currentSkills = isEditing ? formData.skills : (dev?.skills || [])

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Profile & Settings
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your developer identity, skillset, and preferences
          </p>
        </div>

        {!isEditing ? (
          <Button
            variant="secondary"
            size="sm"
            icon={Edit3}
            onClick={handleStartEdit}
          >
            Edit Profile
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="lime"
              size="sm"
              icon={Check}
              onClick={handleSaveProfile}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Developer Profile Information Card */}
      <Card title="Developer Identity" icon={User}>
        {!isEditing ? (
          /* View Mode */
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white dark:bg-lime-400 dark:text-slate-950 flex items-center justify-center font-bold text-xl shrink-0">
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
        ) : (
          /* Edit Mode Form */
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:border-slate-400 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Professional Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  Timezone
                </label>
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                  GitHub Handle
                </label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-850 focus:outline-none focus:border-slate-400 font-mono text-xs"
                />
              </div>
            </div>
          </form>
        )}
      </Card>

      {/* Technical Skills & Expertise */}
      <Card title="Technical Skills" icon={Tag}>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 text-xs">
            {currentSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium transition-all"
              >
                <span>{skill}</span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 ml-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>

          {isEditing && (
            <div className="pt-2 flex items-center gap-2 max-w-sm">
              <input
                type="text"
                placeholder="Add skill (e.g., GraphQL, Docker)..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSkill()
                  }
                }}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
              />
              <Button
                type="button"
                variant="secondary"
                size="xs"
                icon={Plus}
                onClick={handleAddSkill}
              >
                Add
              </Button>
            </div>
          )}
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
