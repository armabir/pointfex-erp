import { AppProvider, useApp } from './context/AppContext'
import { Shell } from './components/layout/Shell'
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
import { RolePlaceholderPage } from './pages/placeholders/RolePlaceholderPage'

function MainContentRouter() {
  const { currentRole, currentRoute } = useApp()

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

  // 3. Other non-implemented roles show role placeholder screen
  return <RolePlaceholderPage />
}

export default function App() {
  return (
    <AppProvider>
      <Shell>
        <MainContentRouter />
      </Shell>
    </AppProvider>
  )
}

