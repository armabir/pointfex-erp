import type { User } from '../../types'

export interface WelcomeBannerProps {
  dev?: User | null
}

export function WelcomeBanner({ dev }: WelcomeBannerProps) {
  return (
    <div className="py-1">
      {/* Greeting - Clean and uncluttered, matching relaxing reference UI */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display tracking-tight flex items-center gap-2">
          Welcome, {dev?.name?.split(' ')[0] || 'Alex'} <span className="inline-block animate-wiggle">👋</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Here's what's happening with your projects and deliverables today.
        </p>
      </div>
    </div>
  )
}

