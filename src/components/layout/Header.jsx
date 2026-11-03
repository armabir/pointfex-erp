import React from 'react'
import { Search, Menu } from 'lucide-react'
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
      earnings: { title: 'Earnings & Performance', crumb: 'Earnings' },
      report: { title: 'Report to PM', crumb: 'Report' },
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
    <header className="sticky top-0 z-20 h-20 bg-[#eef1f6]/90 backdrop-blur-md flex items-center justify-between px-6 sm:px-8">
      {/* Left: Mobile Toggle + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-white transition-colors cursor-pointer lg:hidden shadow-xs"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="min-w-0">
          <Breadcrumbs items={breadcrumbs} />
        </div>
      </div>

      {/* Right: Soft Pills Capsule for Search, Role Switcher, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Search trigger button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/70 text-xs text-slate-400 hover:text-slate-700 hover:border-slate-300 shadow-2xs transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] text-slate-400 bg-slate-100 rounded-md">
            ⌘K
          </kbd>
        </button>

        {/* Temporary Role Switcher */}
        <RoleSwitcher />

        {/* Notification pill */}
        <div className="bg-white border border-slate-200/70 rounded-2xl p-1 shadow-2xs flex items-center">
          <NotificationDropdown />
        </div>

        {/* User profile capsule */}
        <UserMenu />
      </div>
    </header>
  )
}
