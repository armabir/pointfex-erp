import React, { useState } from 'react'
import { AlertTriangle, ShieldCheck, KeyRound, Lock } from 'lucide-react'
import { Modal } from './Modal'
import { Button } from './Button'

export interface SecurityConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (stepUpPhrase?: string, passwordConfirm?: string) => Promise<void> | void
  title: string
  details: string
  severity?: 'standard' | 'danger'
  requirePhrase?: string
  requirePassword?: boolean
  confirmLabel?: string
  isSubmitting?: boolean
}

function SecurityConfirmModalBody({
  onClose,
  onConfirm,
  details,
  severity = 'standard',
  requirePhrase,
  requirePassword = false,
  confirmLabel,
  isSubmitting = false,
}: Omit<SecurityConfirmModalProps, 'isOpen' | 'title'>) {
  const [typedPhrase, setTypedPhrase] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const isDanger = severity === 'danger'
  const phraseSatisfied = !requirePhrase || typedPhrase.trim() === requirePhrase
  const passwordSatisfied = !requirePassword || passwordConfirm.trim().length >= 4
  const canSubmit = phraseSatisfied && passwordSatisfied

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || isSubmitting) return
    void onConfirm(
      requirePhrase ? typedPhrase.trim() : undefined,
      requirePassword ? passwordConfirm : undefined,
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div
        className={`p-3.5 rounded-xl border flex items-start gap-3 ${
          isDanger
            ? 'bg-rose-50/80 dark:bg-rose-950/25 border-rose-200 dark:border-rose-900/60'
            : 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
        }`}
      >
        {isDanger ? (
          <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
        ) : (
          <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 dark:text-white">
            Are you sure you want to make this change?
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{details}</p>
        </div>
      </div>

      {requirePhrase && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
            <KeyRound className="w-3.5 h-3.5 text-rose-500" />
            <span>
              Confirmation Phrase: Type{' '}
              <span className="font-mono px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-slate-800 text-rose-700 dark:text-rose-300">
                {requirePhrase}
              </span>{' '}
              to proceed
            </span>
          </label>
          <input
            type="text"
            autoFocus={!requirePassword}
            value={typedPhrase}
            onChange={(e) => setTypedPhrase(e.target.value)}
            placeholder={requirePhrase}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-rose-500"
          />
        </div>
      )}

      {requirePassword && (
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200">
            <Lock className="w-3.5 h-3.5 text-rose-500" />
            <span>Step-Up Authentication: Enter your account password</span>
          </label>
          <input
            type="password"
            autoFocus
            autoComplete="current-password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            placeholder="Confirm your current password"
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-rose-500"
          />
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isSubmitting}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant={isDanger ? 'danger' : 'lime'}
          size="sm"
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? 'Processing...' : confirmLabel || 'Confirm Change'}
        </Button>
      </div>
    </form>
  )
}

export function SecurityConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  details,
  severity = 'standard',
  requirePhrase,
  requirePassword = false,
  confirmLabel,
  isSubmitting = false,
}: SecurityConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      {isOpen && (
        <SecurityConfirmModalBody
          onClose={onClose}
          onConfirm={onConfirm}
          details={details}
          severity={severity}
          requirePhrase={requirePhrase}
          requirePassword={requirePassword}
          confirmLabel={confirmLabel}
          isSubmitting={isSubmitting}
        />
      )}
    </Modal>
  )
}
