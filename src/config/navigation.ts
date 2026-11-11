import {
  LayoutDashboard,
  CheckSquare,
  FolderGit2,
  Users,
  Wallet,
  Send,
  UserCheck,
  BarChart3,
  Coins,
  Settings,
  GitBranch,
  Layers,
  ScrollText,
  GitPullRequest,
  ShieldCheck,
  Briefcase,
  FileText,
  KeyRound,
} from 'lucide-react'
import type { NavItem, RoleNavigation, RoleId } from '../types'

// Business-friendly navigation catalog driven strictly by active permissions
export function getDynamicNavigation(permissions: string[], roleId: RoleId): RoleNavigation {
  const permSet = new Set(permissions)
  const has = (code: string) => permSet.has(code)
  const hasAny = (...codes: string[]) => codes.some((c) => permSet.has(c))
  const normalizedRole = roleId === 'chro' ? 'cpo' : roleId
  const isExecutive = ['cto', 'cpo', 'cfo', 'ceo'].includes(normalizedRole)

  const items: NavItem[] = [
    {
      id: 'dashboard',
      label: isExecutive ? 'Executive Dashboard' : 'Dashboard',
      icon: LayoutDashboard,
      isImplemented: true,
    },
  ]

  if (hasAny('tasks:read_own', 'tasks:read_team', 'tasks:read_all')) {
    items.push({ id: 'tasks', label: 'My Tasks', icon: CheckSquare, isImplemented: true })
  }

  if (
    hasAny(
      'tasks:create_assign',
      'tasks:approve',
      'tasks:reject',
      'tasks:reassign',
      'directives:dispatch',
    )
  ) {
    items.push({
      id: 'task-management',
      label: 'Task Management',
      icon: Layers,
      isImplemented: true,
    })
  }

  if (has('projects:read_all')) {
    items.push({
      id: 'projects-repos',
      label: 'Projects & Engineering',
      icon: GitBranch,
      isImplemented: true,
    })
  } else if (has('projects:read_own')) {
    items.push({ id: 'projects', label: 'My Projects', icon: FolderGit2, isImplemented: true })
  }

  if (hasAny('teams:create', 'teams:update', 'teams:manage_members', 'teams:read_all')) {
    items.push({
      id: 'team-management',
      label: normalizedRole === 'cpo' ? 'People & Culture' : 'Squads & Teams',
      icon: Users,
      isImplemented: true,
    })
  } else if (has('teams:read_own')) {
    items.push({ id: 'team', label: 'My Squad', icon: Users, isImplemented: true })
  }

  if (has('employees:read_directory')) {
    items.push({ id: 'people', label: 'People Directory', icon: UserCheck, isImplemented: true })
  }

  if (
    hasAny(
      'treasury:read',
      'budgets:approve_request',
      'budgets:reject_request',
      'budgets:allocate_project',
      'finance:issue_adjustment',
      'revenue_share:process',
    )
  ) {
    items.push({ id: 'budget', label: 'Financial Operations', icon: Coins, isImplemented: true })
  } else if (
    hasAny('budgets:read_requests', 'budgets:request_increase', 'budgets:allocate_developer')
  ) {
    items.push({
      id: 'budget-finance',
      label: 'Financial Operations',
      icon: Coins,
      isImplemented: true,
    })
  }

  if (
    hasAny(
      'performance:read_all',
      'performance:evaluate',
      'performance:recognize',
      'performance:discipline',
      'grievances:read_confidential',
      'grievances:adjudicate_confidential',
    )
  ) {
    items.push({
      id: 'performance',
      label: 'Performance',
      icon: BarChart3,
      isImplemented: true,
    })
  }

  if (has('quality_gates:read')) {
    items.push({
      id: 'code-quality',
      label: 'Code Review & Quality',
      icon: GitPullRequest,
      isImplemented: true,
    })
  }

  if (hasAny('security_alerts:read', 'test_runs:read')) {
    items.push({
      id: 'security-testing',
      label: 'Security & Testing',
      icon: ShieldCheck,
      isImplemented: true,
    })
  }

  if (has('consultancy:manage')) {
    items.push({
      id: 'consultancy',
      label: 'Advisory & Consultancy',
      icon: Briefcase,
      isImplemented: true,
    })
  }

  if (hasAny('wallets:read_own', 'wallets:read_all')) {
    items.push({
      id: 'earnings',
      label: normalizedRole === 'cfo' ? 'Treasury & Budgets' : 'Financials & Wallets',
      icon: Wallet,
      isImplemented: true,
    })
  }

  if (
    hasAny(
      'roles:read',
      'roles:create',
      'roles:update',
      'roles:delete',
      'users:assign_role',
      'permissions:read',
      'permissions:delegate',
    )
  ) {
    items.push({
      id: 'access-control',
      label: 'Governance & Access',
      icon: KeyRound,
      isImplemented: true,
    })
  }

  if (
    hasAny(
      'reports:triage',
      'grievances:read_confidential',
      'grievances:adjudicate_confidential',
      'directives:dispatch',
    )
  ) {
    items.push({ id: 'reports', label: 'Executive Reports', icon: FileText, isImplemented: true })
  } else if (has('reports:create')) {
    items.push({
      id: 'report',
      label: 'Submissions & Complaints',
      icon: Send,
      isImplemented: true,
    })
  }

  if (hasAny('audit_logs:read', 'audit_logs:read_confidential')) {
    items.push({
      id: 'audit-log',
      label: 'Governance Audit Trail',
      icon: ScrollText,
      isImplemented: true,
    })
  }

  items.push({ id: 'settings', label: 'Profile & Settings', icon: Settings, isImplemented: true })

  const ROLE_LABELS: Record<string, string> = {
    developer: 'Engineering Workspace',
    pm: 'Project Delivery Workspace',
    cto: 'CTO Engineering Command',
    cpo: 'CHRO People & Culture Hub',
    cfo: 'CFO Financial Operations',
    ceo: 'CEO Executive Suite',
  }

  return {
    roleId: normalizedRole,
    roleLabel: ROLE_LABELS[normalizedRole] || 'Enterprise Workspace',
    items,
  }
}
