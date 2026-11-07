import React from 'react'
import { Search, Menu, Sun, Moon } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { Breadcrumbs } from '../common/Breadcrumbs.jsx'
import { RoleSwitcher } from './RoleSwitcher.jsx'
import { NotificationDropdown } from './NotificationDropdown.jsx'
import { UserMenu } from './UserMenu.jsx'

export function Header() {
  const {
    currentRole,
    currentRoute,
    setRoute,
    toggleSidebar,
    setIsSearchOpen,
    theme,
    toggleTheme,
  } = useApp()

  const getPageInfo = () => {
    if (currentRole !== 'developer') {
      const roleMap = {
        pm: 'Project Manager',
        cto: 'CTO Workspace',
        cpo: 'CPO Workspace',
        cfo: 'CFO Workspace',
        ceo: 'CEO Workspace',
      }
      return {
        title: roleMap[currentRole] || 'Workspace',
        breadcrumbs: [
          { label: 'Pointfex' },
          { label: roleMap[currentRole] || currentRole },
        ],
      }
    }

    const routeMap = {
      dashboard: { title: 'Dashboard', crumb: 'Dashboard' },
      tasks: { title: 'My Tasks', crumb: 'My Tasks' },
      projects: { title: 'My Projects', crumb: 'My Projects' },
      team: { title: 'My Team', crumb: 'My Team' },
      earnings: { title: 'Earnings', crumb: 'Earnings' },
      report: { title: 'Submissions & Complaints', crumb: 'Submissions & Complaints' },
      settings: { title: 'Settings', crumb: 'Settings' },
    }

    const curr = routeMap[currentRoute] || { title: 'Dashboard', crumb: 'Dashboard' }
    return {
      title: curr.title,
      breadcrumbs: [
        { label: 'Developer', onClick: () => setRoute('dashboard') },
        { label: curr.crumb },
      ],
    }
  }

  const { breadcrumbs } = getPageInfo()

  return (
    <header className="sticky top-0 z-20 h-20 bg-[#eaeef2]/90 dark:bg-[#090c14]/90 backdrop-blur-md flex items-center justify-between px-6 sm:px-8 border-b border-transparent dark:border-slate-800/60 transition-colors">
      {/* Left: Mobile Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer lg:hidden shadow-xs"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="min-w-0">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {/* Right: Starline-style Floating Pill Capsule for Search, Theme Toggle, and Notifications */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Temporary Role Switcher */}
        <RoleSwitcher />

        {/* Floating Capsule Bar (Search, Theme, Notifications) - Matching reference UI */}
        <div className="flex items-center bg-white dark:bg-[#131722] border border-slate-200/70 dark:border-slate-800 rounded-full px-1.5 py-1 shadow-2xs">
          {/* Search trigger button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Search (⌘K)"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <span className="w-px h-3.5 bg-slate-200/80 dark:bg-slate-800 mx-0.5" />

          {/* Dark Mode Switch Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          <span className="w-px h-3.5 bg-slate-200/80 dark:bg-slate-800 mx-0.5" />

          {/* Notification dropdown */}
          <NotificationDropdown />
        </div>

        {/* User profile capsule */}
        <UserMenu />
      </div>
    </header>
  )
}
