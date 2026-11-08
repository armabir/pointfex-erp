import React, { useState, useRef } from 'react'
import { Modal } from './Modal'
import { Button } from './Button'
import { Upload, Check } from 'lucide-react'

export interface AvatarPickerModalProps {
  isOpen: boolean
  onClose: () => void
  currentAvatar: string
  onSave: (avatarUrl: string) => void
  userName?: string
}

// oxlint-disable-next-line react/only-export-components
export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
]

export function AvatarPickerModal({
  isOpen,
  onClose,
  currentAvatar,
  onSave,
  userName = 'Profile',
}: AvatarPickerModalProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar)
  const [customUrl, setCustomUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedAvatar(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onSave(selectedAvatar)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Change Profile Picture — ${userName}`}
    >
      <div className="space-y-5">
        {/* Current / Selected Preview */}
        <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="relative">
            <img
              src={selectedAvatar}
              alt="Avatar Preview"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-lime-500 shadow-sm"
            />
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 absolute -bottom-1 -right-1" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
              Active Selection Preview
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Select a preset avatar below or upload a custom image
            </span>
          </div>
        </div>

        {/* Upload from device */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-lime-500 dark:hover:border-lime-500 bg-white dark:bg-slate-800/40 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-slate-400" />
            <span>Upload Image from Computer</span>
          </button>
        </div>

        {/* Preset Avatars Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Or Choose from Preset Avatars
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
            {AVATAR_PRESETS.map((preset, idx) => {
              const isSelected = selectedAvatar === preset
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedAvatar(preset)}
                  className={`relative cursor-pointer rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    isSelected
                      ? 'border-lime-500 ring-2 ring-lime-400/30 scale-105'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <img
                    src={preset}
                    alt={`Preset ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-lime-500/20 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-lime-500 text-slate-950 flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Custom Image URL input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Or Paste Custom Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/photo.jpg"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-lime-500"
            />
            <Button
              variant="secondary"
              size="xs"
              onClick={() => {
                if (customUrl.trim()) {
                  setSelectedAvatar(customUrl.trim())
                  setCustomUrl('')
                }
              }}
              disabled={!customUrl.trim()}
            >
              Apply
            </Button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save Picture
          </Button>
        </div>
      </div>
    </Modal>
  )
}
