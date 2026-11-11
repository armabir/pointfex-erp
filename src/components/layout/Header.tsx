import { Search, Menu, Sun, Moon } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Breadcrumbs, type BreadcrumbItem } from '../common/Breadcrumbs'
import { NotificationDropdown } from './NotificationDropdown'
import { UserMenu } from './UserMenu'

export function Header() {
  const {
    currentRole,
    currentRoute,
    setRoute,
    setMobileSidebarOpen,
    setIsSearchOpen,
    theme,
    toggleTheme,
  } = useApp()

  const getPageInfo = (): { title: string; breadcrumbs: BreadcrumbItem[] } => {
    const roleLabelMap: Record<string, string> = {
      developer: 'Engineering',
      pm: 'Project Delivery',
      cto: 'CTO Command',
      cfo: 'CFO Desk',
      cpo: 'CHRO Hub',
      chro: 'CHRO Hub',
      ceo: 'CEO Executive Suite',
    }
    const routeMap: Record<string, { title: string; crumb: string }> = {
      dashboard: { title: 'Dashboard', crumb: 'Dashboard' },
      tasks: { title: 'My Tasks', crumb: 'My Tasks' },
      'task-management': { title: 'Task Management', crumb: 'Task Management' },
      projects: { title: 'My Projects', crumb: 'My Projects' },
      'projects-repos': { title: 'Projects & Repositories', crumb: 'Projects & Repositories' },
      team: { title: 'My Team', crumb: 'My Team' },
      'team-management': { title: 'Team Management', crumb: 'Team Management' },
      people: { title: 'People Directory', crumb: 'People Directory' },
      budget: { title: 'Financial Operations', crumb: 'Financial Operations' },
      'budget-finance': { title: 'Financial Operations', crumb: 'Financial Operations' },
      performance: { title: 'Performance & Culture', crumb: 'Performance & Culture' },
      'code-quality': { title: 'Code Review & Quality', crumb: 'Code Review & Quality' },
      'security-testing': { title: 'Security & Testing', crumb: 'Security & Testing' },
      consultancy: { title: 'Advisory & Consultancy', crumb: 'Advisory & Consultancy' },
      earnings: { title: 'Compensation & Earnings', crumb: 'Compensation & Earnings' },
      'access-control': { title: 'Roles & Access Control', crumb: 'Roles & Access Control' },
      reports: { title: 'Executive Reports', crumb: 'Executive Reports' },
      report: { title: 'Submissions & Complaints', crumb: 'Submissions & Complaints' },
      'audit-log': { title: 'Governance Audit Trail', crumb: 'Governance Audit Trail' },
      settings: { title: 'Profile & Settings', crumb: 'Profile & Settings' },
    }
    const curr = routeMap[currentRoute] || { title: 'Workspace', crumb: 'Dashboard' }
    return {
      title: curr.title,
      breadcrumbs: [
        {
          label: roleLabelMap[currentRole] || 'Pointfex ERP',
          onClick: () => setRoute('dashboard'),
        },
        { label: curr.crumb },
      ],
    }
  }

  const { breadcrumbs } = getPageInfo()

  return (
    <header className="sticky top-0 z-20 h-16 sm:h-20 bg-slate-50/90 dark:bg-[#090d16]/90 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Left: Mobile Hamburger + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => setMobileSidebarOpen((prev) => !prev)}
          className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer lg:hidden shadow-sm"
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
        {/* Floating Capsule Bar (Search, Theme, Notifications) */}
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
