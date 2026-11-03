import {
  LayoutDashboard,
  CheckSquare,
  FolderGit2,
  Users,
  Wallet,
  Send,
  UserCheck,
  ShieldAlert,
  BarChart3,
  Coins,
  TrendingUp,
  Settings,
  Calendar,
  GitBranch,
} from 'lucide-react'

// Role-specific navigation maps
export const ROLE_NAVIGATION = {
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
      { id: 'pm-overview', label: 'Sprint Cockpit', icon: LayoutDashboard, isImplemented: false },
      { id: 'pm-teams', label: 'Team Allocations (6 Teams)', icon: Users, isImplemented: false },
      { id: 'pm-projects', label: '12 Projects Board', icon: FolderGit2, isImplemented: false },
      { id: 'pm-deliverables', label: 'Milestone Approvals', icon: CheckSquare, isImplemented: false },
      { id: 'pm-reports', label: 'Developer Standups', icon: Send, isImplemented: false },
    ],
  },
  cto: {
    roleId: 'cto',
    roleLabel: 'CTO Engineering Command',
    items: [
      { id: 'cto-overview', label: 'Engineering Pulse', icon: LayoutDashboard, isImplemented: false },
      { id: 'cto-architecture', label: 'System Topology', icon: GitBranch, isImplemented: false },
      { id: 'cto-quality', label: 'Code Quality & CI/CD', icon: ShieldAlert, isImplemented: false },
      { id: 'cto-velocity', label: 'Velocity Benchmarks', icon: TrendingUp, isImplemented: false },
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

export function getNavigationForRole(roleId) {
  return ROLE_NAVIGATION[roleId] || ROLE_NAVIGATION.developer
}

