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
import { RolePlaceholderPage } from './pages/placeholders/RolePlaceholderPage.jsx'

function MainContentRouter() {
  const { currentRole, currentRoute } = useApp()

  // Non-developer roles show the role placeholder screen
  if (currentRole !== 'developer') {
    return <RolePlaceholderPage />
  }

  // Developer workspace route switcher
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

export default function App() {
  return (
    <AppProvider>
      <Shell>
        <MainContentRouter />
      </Shell>
    </AppProvider>
  )
}
