import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { ApiError } from '../../api/client'
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2, Sparkles } from 'lucide-react'

interface DemoEnvironment {
  label: string
  roleBadge: string
  email: string
}

const DEMO_ENABLED = import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true'
const DEMO_PASSWORD = (import.meta.env.VITE_DEMO_PASSWORD as string | undefined) || ''

const DEMO_ENVIRONMENTS: DemoEnvironment[] = [
  {
    label: 'Login as CEO (Noor)',
    roleBadge: 'CEO',
    email: 'noor.ceo@pointfex.internal',
  },
  {
    label: 'Login as CTO (Abir)',
    roleBadge: 'CTO',
    email: 'abir.cto@pointfex.internal',
  },
  {
    label: 'Login as CFO (Rahid)',
    roleBadge: 'CFO',
    email: 'rahid.cfo@pointfex.internal',
  },
  {
    label: 'Login as CHRO (Naim)',
    roleBadge: 'CHRO',
    email: 'naim.chro@pointfex.internal',
  },
  {
    label: 'Login as PM (Jihad)',
    roleBadge: 'PM',
    email: 'jihad.pm@pointfex.internal',
  },
  {
    label: 'Login as DEV (Fahim)',
    roleBadge: 'DEV',
    email: 'fahim.dev@pointfex.internal',
  },
]

export function LoginPage() {
  const { loginWithCredentials } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeDemoEmail, setActiveDemoEmail] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleAuthenticate = async (targetEmail: string, targetPassword: string) => {
    setErrorMsg(null)
    setIsSubmitting(true)
    try {
      await loginWithCredentials(targetEmail, targetPassword)
    } catch (err: unknown) {
      const status =
        err instanceof ApiError ? err.status : (err as { status?: number } | null)?.status
      if (status === 429) {
        setErrorMsg(
          'Security Alert: Too many login attempts detected. Please wait 60 seconds before trying again.',
        )
      } else {
        const message = err instanceof Error ? err.message : undefined
        setErrorMsg(message || 'Unable to sign in. Check your credentials and try again.')
      }
    } finally {
      setIsSubmitting(false)
      setActiveDemoEmail(null)
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both your corporate email and password.')
      return
    }
    await handleAuthenticate(email.trim(), password)
  }

  const handleDemoLogin = async (env: DemoEnvironment) => {
    if (!DEMO_PASSWORD) {
      setErrorMsg('Demo password is not configured in frontend environment variables.')
      return
    }
    setEmail(env.email)
    setPassword(DEMO_PASSWORD)
    setActiveDemoEmail(env.email)
    await handleAuthenticate(env.email, DEMO_PASSWORD)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {/* Subtle Ambient Accent Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[540px] h-[540px] rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 w-[420px] h-[420px] rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute bottom-12 -right-24 w-[360px] h-[360px] rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      {/* Main Glassmorphism Login Card */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/75 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-7 sm:p-8">
        {/* Branding Header */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-slate-950/90 border border-white/10 shadow-lg flex items-center justify-center p-2 mb-4">
            <img src="/Logo.png" alt="Pointfex Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Pointfex ERP</h1>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Zero-Trust Corporate Identity Portal</span>
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Corporate Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@pointfex.internal"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950/70 border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
          >
            {isSubmitting && !activeDemoEmail ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to Workspace</span>
            )}
          </button>
        </form>

        {/* Demo Environments Quick-Login Strip (rendered only when explicitly enabled via env) */}
        <div className="mt-7 pt-5 border-t border-white/10">
          {DEMO_ENABLED && DEMO_PASSWORD && (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Quick Access Accounts
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {DEMO_ENVIRONMENTS.map((env) => {
                  const isLoadingThis = isSubmitting && activeDemoEmail === env.email
                  return (
                    <button
                      key={env.email}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => void handleDemoLogin(env)}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-800/70 hover:bg-indigo-600/20 border border-slate-700/70 hover:border-indigo-500/50 text-left text-xs text-slate-200 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                    >
                      <span className="font-medium truncate">{env.label}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-950/80 text-indigo-300 border border-indigo-500/30 shrink-0">
                        {isLoadingThis ? '...' : env.roleBadge}
                      </span>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          <p className="text-[10px] text-slate-500 text-center">
            Accounts are provisioned exclusively by CHRO / CEO Executive Onboarding.
          </p>
        </div>
      </div>
    </div>
  )
}
