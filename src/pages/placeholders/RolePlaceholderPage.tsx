import type { ComponentType } from 'react'
import { Button } from '../../components/common/Button'
import { useApp } from '../../context/AppContext'
import {
  ArrowLeft,
  Briefcase,
  Shield,
  Users,
  DollarSign,
  BarChart,
} from 'lucide-react'

interface RoleMetaConfig {
  icon: ComponentType<{ className?: string }>
  title: string
  description: string
}

const ROLE_META: Record<string, RoleMetaConfig> = {
  pm: {
    icon: Briefcase,
    title: 'Project Manager Workspace',
    description: 'Sprint planning and milestone approvals.',
  },
  cto: {
    icon: Shield,
    title: 'CTO Workspace',
    description: 'Architecture review and system standards.',
  },
  cpo: {
    icon: Users,
    title: 'CPO Workspace',
    description: 'Team capacity and allocations.',
  },
  cfo: {
    icon: DollarSign,
    title: 'CFO Workspace',
    description: 'Sprint budgets and payout ledgers.',
  },
  ceo: {
    icon: BarChart,
    title: 'CEO Workspace',
    description: 'Executive roadmap and performance summary.',
  },
}

export function RolePlaceholderPage() {
  const { currentRole, setRole } = useApp()
  const roleConfig = ROLE_META[currentRole] || ROLE_META.pm
  const Icon = roleConfig.icon

  return (
    <div className="max-w-xl mx-auto py-12 space-y-4 text-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-sm">
        <div className="inline-flex p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mb-1">
          <Icon className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            {roleConfig.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1.5 leading-relaxed">
            {roleConfig.description} This role dashboard will be implemented in an upcoming phase.
          </p>
        </div>

        <div className="pt-3">
          <Button
            variant="lime"
            size="md"
            icon={ArrowLeft}
            onClick={() => setRole('developer')}
          >
            Back to Developer Workspace
          </Button>
        </div>
      </div>
    </div>
  )
}

