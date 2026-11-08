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
  Calendar,
  GitBranch,
  Layers,
  ScrollText,
  GitPullRequest,
  ShieldCheck,
  Briefcase,
  FileText,
} from 'lucide-react'
import type { RoleNavigation, RoleId } from '../types'

// Role-specific navigation maps
export const ROLE_NAVIGATION: Record<string, RoleNavigation> = {
  developer: {
    roleId: 'developer',
    roleLabel: 'Developer Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, isImplemented: true },
      { id: 'tasks', label: 'My Tasks', icon: CheckSquare, isImplemented: true },
      { id: 'projects', label: 'My Projects', icon: FolderGit2, isImplemented: true },
      { id: 'team', label: 'My Team', icon: Users, isImplemented: true },
      { id: 'earnings', label: 'Earnings', icon: Wallet, isImplemented: true },
      { id: 'report', label: 'Submissions & Complaints', icon: Send, isImplemented: true },
      { id: 'settings', label: 'Profile & Settings', icon: Settings, isImplemented: true },
    ],
  },
  pm: {
    roleId: 'pm',
    roleLabel: 'Project Manager Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, isImplemented: true },
      { id: 'tasks', label: 'My Tasks', icon: CheckSquare, isImplemented: true },
      { id: 'task-management', label: 'Task Management', icon: Layers, isImplemented: true },
      { id: 'projects', label: 'My Projects', icon: FolderGit2, isImplemented: true },
      { id: 'team-management', label: 'Team Management', icon: Users, isImplemented: true },
      { id: 'budget-finance', label: 'Budget & Finance', icon: Coins, isImplemented: true },
      { id: 'earnings', label: 'Earnings & Performance', icon: Wallet, isImplemented: true },
      { id: 'report', label: 'Submissions & Complaints', icon: Send, isImplemented: true },
      { id: 'settings', label: 'Profile & Settings', icon: Settings, isImplemented: true },
    ],
  },
  cto: {
    roleId: 'cto',
    roleLabel: 'CTO Engineering Command',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, isImplemented: true },
      { id: 'tasks', label: 'My Tasks', icon: CheckSquare, isImplemented: true },
      { id: 'task-management', label: 'Task Management', icon: Layers, isImplemented: true },
      { id: 'team-management', label: 'Team Management', icon: Users, isImplemented: true },
      { id: 'people', label: 'People', icon: UserCheck, isImplemented: true },
      { id: 'projects-repos', label: 'Projects & Repos', icon: GitBranch, isImplemented: true },
      { id: 'code-quality', label: 'Code Review & Quality', icon: GitPullRequest, isImplemented: true },
      { id: 'security-testing', label: 'Security & Testing', icon: ShieldCheck, isImplemented: true },
      { id: 'consultancy', label: 'Consultancy', icon: Briefcase, isImplemented: true },
      { id: 'earnings', label: 'Earnings & Performance', icon: Wallet, isImplemented: true },
      { id: 'reports', label: 'Reports', icon: FileText, isImplemented: true },
      { id: 'settings', label: 'Profile & Settings', icon: Settings, isImplemented: true },
      { id: 'audit-log', label: 'Audit Log', icon: ScrollText, isImplemented: true },
    ],
  },
  cpo: {
    roleId: 'cpo',
    roleLabel: 'Chief People Officer Hub',
    items: [
      { id: 'cpo-overview', label: 'People Analytics', icon: LayoutDashboard, isImplemented: false },
      { id: 'cpo-roster', label: '24 Dev Roster & Capacity', icon: Users, isImplemented: false },
      { id: 'cpo-satisfaction', label: 'Satisfaction & Morale', icon: UserCheck, isImplemented: false },
    ],
  },
  cfo: {
    roleId: 'cfo',
    roleLabel: 'CFO Financial Desk',
    items: [
      { id: 'cfo-overview', label: 'Sprint Budget Burn', icon: LayoutDashboard, isImplemented: false },
      { id: 'cfo-escrow', label: 'Project Escrow Locks', icon: Coins, isImplemented: false },
      { id: 'cfo-payouts', label: 'Developer Wallets', icon: Wallet, isImplemented: false },
    ],
  },
  ceo: {
    roleId: 'ceo',
    roleLabel: 'CEO Executive Suite',
    items: [
      { id: 'ceo-overview', label: 'Executive Radar', icon: LayoutDashboard, isImplemented: false },
      { id: 'ceo-milestones', label: '5-Week Sprint Roadmap', icon: Calendar, isImplemented: false },
      { id: 'ceo-health', label: 'Company Scorecard', icon: BarChart3, isImplemented: false },
    ],
  },
}

export function getNavigationForRole(roleId: RoleId): RoleNavigation {
  return ROLE_NAVIGATION[roleId] || ROLE_NAVIGATION.developer
}

