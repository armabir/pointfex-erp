import React from 'react'
import { Plus, Send } from 'lucide-react'
import { Button } from '../common/Button.jsx'
import { useApp } from '../../context/AppContext.jsx'

export function WelcomeBanner({ dev, onOpenQuickTask }) {
  const { setRoute } = useApp()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1">
      {/* Greeting - Clean and uncluttered, matching relaxing reference UI */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display tracking-tight flex items-center gap-2">
          Welcome, {dev?.name?.split(' ')[0] || 'Alex'} <span className="inline-block animate-wiggle">👋</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Here's what's happening with your projects and deliverables today.
        </p>
      </div>

      {/* Clean action buttons */}
      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          variant="secondary"
          size="sm"
          icon={Send}
          onClick={() => setRoute('report')}
        >
          Submit Deliverable
        </Button>

        <Button
          variant="lime"
          size="sm"
          icon={Plus}
          onClick={onOpenQuickTask}
        >
          New Task
        </Button>
      </div>
    </div>
  )
}
