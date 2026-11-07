import React from 'react'
import { AppProvider, useApp } from './context/AppContext.jsx'
import { Shell } from './components/layout/Shell.jsx'
import { DeveloperDashboard } from './pages/developer/DeveloperDashboard.jsx'
import { DeveloperTasksPage } from './pages/developer/DeveloperTasksPage.jsx'
import { DeveloperProjectsPage } from './pages/developer/DeveloperProjectsPage.jsx'
import { DeveloperTeamPage } from './pages/developer/DeveloperTeamPage.jsx'
import { DeveloperEarningsPage } from './pages/developer/DeveloperEarningsPage.jsx'
import { DeveloperReportPage } from './pages/developer/DeveloperReportPage.jsx'
import { DeveloperSettingsPage } from './pages/developer/DeveloperSettingsPage.jsx'
import { PmDashboard } from './pages/pm/PmDashboard.jsx'
import { PmTasksPage } from './pages/pm/PmTasksPage.jsx'
import { PmTaskManagementPage } from './pages/pm/PmTaskManagementPage.jsx'
import { PmProjectsPage } from './pages/pm/PmProjectsPage.jsx'
import { PmTeamManagementPage } from './pages/pm/PmTeamManagementPage.jsx'
import { PmBudgetFinancePage } from './pages/pm/PmBudgetFinancePage.jsx'
import { PmEarningsPage } from './pages/pm/PmEarningsPage.jsx'
import { PmReportsPage } from './pages/pm/PmReportsPage.jsx'
import { PmSettingsPage } from './pages/pm/PmSettingsPage.jsx'
import { RolePlaceholderPage } from './pages/placeholders/RolePlaceholderPage.jsx'

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
