import { AppProvider, useApp } from './context/AppContext'
import { Shell } from './components/layout/Shell'
import { LoginPage } from './pages/auth/LoginPage'
import { DesktopNoticeModal } from './components/common/DesktopNoticeModal'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { DeveloperDashboard } from './pages/developer/DeveloperDashboard'
import { DeveloperTasksPage } from './pages/developer/DeveloperTasksPage'
import { DeveloperProjectsPage } from './pages/developer/DeveloperProjectsPage'
import { DeveloperTeamPage } from './pages/developer/DeveloperTeamPage'
import { DeveloperEarningsPage } from './pages/developer/DeveloperEarningsPage'
import { DeveloperReportPage } from './pages/developer/DeveloperReportPage'
import { DeveloperSettingsPage } from './pages/developer/DeveloperSettingsPage'
import { PmDashboard } from './pages/pm/PmDashboard'
import { PmTasksPage } from './pages/pm/PmTasksPage'
import { PmTaskManagementPage } from './pages/pm/PmTaskManagementPage'
import { PmProjectsPage } from './pages/pm/PmProjectsPage'
import { PmTeamManagementPage } from './pages/pm/PmTeamManagementPage'
import { PmBudgetFinancePage } from './pages/pm/PmBudgetFinancePage'
import { PmEarningsPage } from './pages/pm/PmEarningsPage'
import { PmReportsPage } from './pages/pm/PmReportsPage'
import { PmSettingsPage } from './pages/pm/PmSettingsPage'

// Phase 3: CTO Workspace Pages (13 panels)
import { CtoDashboard } from './pages/cto/CtoDashboard'
import { CtoTasksPage } from './pages/cto/CtoTasksPage'
import { CtoTaskManagementPage } from './pages/cto/CtoTaskManagementPage'
import { CtoTeamManagementPage } from './pages/cto/CtoTeamManagementPage'
import { CtoAuditLogPage } from './pages/cto/CtoAuditLogPage'
import { CtoPeoplePage } from './pages/cto/CtoPeoplePage'
import { CtoProjectsReposPage } from './pages/cto/CtoProjectsReposPage'
import { CtoCodeQualityPage } from './pages/cto/CtoCodeQualityPage'
import { CtoSecurityTestingPage } from './pages/cto/CtoSecurityTestingPage'
import { CtoConsultancyPage } from './pages/cto/CtoConsultancyPage'
import { CtoEarningsPage } from './pages/cto/CtoEarningsPage'
import { CtoReportsPage } from './pages/cto/CtoReportsPage'
import { CtoSettingsPage } from './pages/cto/CtoSettingsPage'

// Phase 4: CFO, CHRO, and CEO Workspace Pages
import { CfoDashboard } from './pages/cfo/CfoDashboard'
import { CfoBudgetPage } from './pages/cfo/CfoBudgetPage'
import { ChroDashboard } from './pages/chro/ChroDashboard'
import { ChroPerformancePage } from './pages/chro/ChroPerformancePage'
import { CeoDashboard } from './pages/ceo/CeoDashboard'
import { CeoRoleMatrixPage } from './pages/ceo/CeoRoleMatrixPage'

import { RolePlaceholderPage } from './pages/placeholders/RolePlaceholderPage'

function MainContentRouter() {
  const { currentRole, currentRoute, hasPermission, hasAnyPermission } = useApp()

  // Universal permission-driven modules (accessible dynamically to any role holding effective permissions,
  // including temporary DAC grants launched directly from Profile & Settings)
  if (
    currentRoute === 'people' &&
    hasAnyPermission(
      'employees:read_directory',
      'employees:create',
      'employees:update_any',
      'employees:suspend',
      'positions:read',
      'positions:assign',
      'users:assign_role',
    )
  ) {
    return <CtoPeoplePage />
  }
  if (
    currentRoute === 'task-management' &&
    hasAnyPermission(
      'tasks:create_assign',
      'tasks:approve',
      'tasks:reject',
      'tasks:reassign',
      'directives:read',
      'directives:dispatch',
    )
  ) {
    return currentRole === 'pm' ? <PmTaskManagementPage /> : <CtoTaskManagementPage />
  }
  if (
    currentRoute === 'access-control' &&
    hasAnyPermission(
      'roles:read',
      'roles:create',
      'roles:update',
      'roles:delete',
      'users:assign_role',
      'permissions:read',
      'permissions:delegate',
      'decisions:read',
      'decisions:ratify',
    )
  ) {
    return <CeoRoleMatrixPage />
  }
  if (
    currentRoute === 'budget' &&
    hasAnyPermission(
      'treasury:read',
      'wallets:read_all',
      'transactions:read_all',
      'budgets:approve_request',
      'budgets:reject_request',
      'budgets:allocate_project',
      'finance:issue_adjustment',
      'revenue_share:process',
    )
  ) {
    return <CfoBudgetPage />
  }
  if (
    currentRoute === 'budget-finance' &&
    hasAnyPermission(
      'budgets:read_requests',
      'budgets:request_increase',
      'budgets:allocate_developer',
    )
  ) {
    return <PmBudgetFinancePage />
  }
  if (
    currentRoute === 'performance' &&
    hasAnyPermission(
      'performance:read_all',
      'performance:evaluate',
      'performance:recognize',
      'performance:discipline',
      'grievances:create',
      'grievances:read_confidential',
      'grievances:adjudicate_confidential',
    )
  ) {
    return <ChroPerformancePage />
  }
  if (
    currentRoute === 'reports' &&
    hasAnyPermission(
      'reports:triage',
      'reports:forward',
      'reports:read_standard',
      'grievances:read_confidential',
      'grievances:adjudicate_confidential',
      'directives:dispatch',
    )
  ) {
    return currentRole === 'pm' ? <PmReportsPage /> : <CtoReportsPage />
  }
  if (currentRoute === 'code-quality' && hasPermission('quality_gates:read')) {
    return <CtoCodeQualityPage />
  }
  if (
    currentRoute === 'security-testing' &&
    hasAnyPermission(
      'security_alerts:read',
      'security_alerts:create',
      'security_alerts:update_status',
      'test_runs:read',
    )
  ) {
    return <CtoSecurityTestingPage />
  }
  if (currentRoute === 'consultancy' && hasPermission('consultancy:manage')) {
    return <CtoConsultancyPage />
  }
  if (
    currentRoute === 'audit-log' &&
    hasAnyPermission('audit_logs:read', 'audit_logs:read_confidential')
  ) {
    return <CtoAuditLogPage />
  }
  if (
    currentRoute === 'team-management' &&
    hasAnyPermission('teams:create', 'teams:update', 'teams:manage_members', 'teams:read_all')
  ) {
    return currentRole === 'pm' ? <PmTeamManagementPage /> : <CtoTeamManagementPage />
  }
  if (
    currentRoute === 'projects-repos' &&
    hasAnyPermission(
      'projects:read_all',
      'projects:create',
      'projects:update',
      'projects:assign_team',
      'milestones:create',
      'milestones:update',
    )
  ) {
    return <CtoProjectsReposPage />
  }
  if (currentRoute === 'earnings' && hasAnyPermission('wallets:read_own', 'wallets:read_all')) {
    if (currentRole === 'cfo') return <CfoBudgetPage />
    if (currentRole === 'pm') return <PmEarningsPage />
    if (currentRole === 'developer') return <DeveloperEarningsPage />
    return <CtoEarningsPage />
  }

  // 1. Developer workspace route switcher
  if (currentRole === 'developer') {
    switch (currentRoute) {
      case 'dashboard':
        return <DeveloperDashboard />
      case 'tasks':
        return <DeveloperTasksPage />
      case 'projects':
        return <DeveloperProjectsPage />
      case 'team':
        return <DeveloperTeamPage />
      case 'earnings':
        return <DeveloperEarningsPage />
      case 'report':
        return <DeveloperReportPage />
      case 'settings':
        return <DeveloperSettingsPage />
      default:
        return <DeveloperDashboard />
    }
  }

  // 2. Project Manager (PM) workspace route switcher
  if (currentRole === 'pm') {
    switch (currentRoute) {
      case 'dashboard':
        return <PmDashboard />
      case 'tasks':
        return <PmTasksPage />
      case 'task-management':
        return <PmTaskManagementPage />
      case 'projects':
        return <PmProjectsPage />
      case 'team-management':
        return <PmTeamManagementPage />
      case 'budget-finance':
        return <PmBudgetFinancePage />
      case 'earnings':
        return <PmEarningsPage />
      case 'report':
        return <PmReportsPage />
      case 'settings':
        return <PmSettingsPage />
      default:
        return <PmDashboard />
    }
  }

  // 3. Chief Technology Officer (CTO) workspace route switcher (13 panels)
  if (currentRole === 'cto') {
    switch (currentRoute) {
      case 'dashboard':
        return <CtoDashboard />
      case 'tasks':
        return <CtoTasksPage />
      case 'task-management':
        return <CtoTaskManagementPage />
      case 'team-management':
        return <CtoTeamManagementPage />
      case 'audit-log':
        return <CtoAuditLogPage />
      case 'people':
        return <CtoPeoplePage />
      case 'projects-repos':
        return <CtoProjectsReposPage />
      case 'code-quality':
        return <CtoCodeQualityPage />
      case 'security-testing':
        return <CtoSecurityTestingPage />
      case 'consultancy':
        return <CtoConsultancyPage />
      case 'earnings':
        return <CtoEarningsPage />
      case 'reports':
        return <CtoReportsPage />
      case 'settings':
        return <CtoSettingsPage />
      default:
        return <CtoDashboard />
    }
  }

  // 4. Chief Financial Officer (CFO) workspace route switcher (9 panels)
  if (currentRole === 'cfo') {
    switch (currentRoute) {
      case 'dashboard':
        return <CfoDashboard />
      case 'tasks':
        return <CtoTasksPage />
      case 'task-management':
        return <CtoTaskManagementPage />
      case 'team-management':
        return <CtoTeamManagementPage />
      case 'budget':
        return <CfoBudgetPage />
      case 'people':
        return <CtoPeoplePage />
      case 'reports':
        return <CtoReportsPage />
      case 'settings':
        return <CtoSettingsPage />
      case 'audit-log':
        return <CtoAuditLogPage />
      default:
        return <CfoDashboard />
    }
  }

  // 5. Chief Human Resources Officer (CHRO) workspace route switcher (9 panels)
  if (currentRole === 'cpo' || currentRole === 'chro') {
    switch (currentRoute) {
      case 'dashboard':
        return <ChroDashboard />
      case 'tasks':
        return <CtoTasksPage />
      case 'task-management':
        return <CtoTaskManagementPage />
      case 'team-management':
        return <CtoTeamManagementPage />
      case 'performance':
        return <ChroPerformancePage />
      case 'people':
        return <CtoPeoplePage />
      case 'reports':
        return <CtoReportsPage />
      case 'settings':
        return <CtoSettingsPage />
      case 'audit-log':
        return <CtoAuditLogPage />
      default:
        return <ChroDashboard />
    }
  }

  // 6. Chief Executive Officer (CEO) workspace route switcher (15 panels)
  if (currentRole === 'ceo') {
    switch (currentRoute) {
      case 'dashboard':
        return <CeoDashboard />
      case 'tasks':
        return <CtoTasksPage />
      case 'task-management':
        return <CtoTaskManagementPage />
      case 'team-management':
        return <CtoTeamManagementPage />
      case 'projects-repos':
        return <CtoProjectsReposPage />
      case 'code-quality':
        return <CtoCodeQualityPage />
      case 'security-testing':
        return <CtoSecurityTestingPage />
      case 'consultancy':
        return <CtoConsultancyPage />
      case 'budget':
        return <CfoBudgetPage />
      case 'performance':
        return <ChroPerformancePage />
      case 'earnings':
        return <CtoEarningsPage />
      case 'people':
        return <CtoPeoplePage />
      case 'access-control':
        return <CeoRoleMatrixPage />
      case 'reports':
        return <CtoReportsPage />
      case 'settings':
        return <CtoSettingsPage />
      case 'audit-log':
        return <CtoAuditLogPage />
      default:
        return <CeoDashboard />
    }
  }

  // 7. Other non-implemented roles show role placeholder screen
  return <RolePlaceholderPage />
}

function AppRoot() {
  const { isAuthenticated, isAuthChecking } = useApp()

  if (isAuthChecking) {
    return (
      <>
        <DesktopNoticeModal />
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-300">
          <img src="/Logo.png" alt="Pointfex" className="w-11 h-11 object-contain animate-pulse" />
          <p className="text-xs font-medium tracking-wide text-slate-400">
            Verifying secure session...
          </p>
        </div>
      </>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <DesktopNoticeModal />
        <LoginPage />
      </>
    )
  }

  return (
    <>
      <DesktopNoticeModal />
      <Shell>
        <MainContentRouter />
      </Shell>
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppRoot />
      </AppProvider>
    </ErrorBoundary>
  )
}
