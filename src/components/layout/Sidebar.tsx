import { useMemo } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { usePermissions } from '../../hooks/usePermissions'
import { getDynamicNavigation } from '../../config/navigation'
import { Avatar } from '../common/Avatar'
import type { NavItem } from '../../types'

const ROLE_NAVIGATION_PRIORITY: Record<string, string[]> = {
  // Developers & PMs: 1. My Tasks, 2. Projects & Squads, 3. Directory
  developer: ['tasks', 'projects', 'team', 'people', 'dashboard', 'earnings', 'report', 'settings'],
  pm: [
    'tasks',
    'task-management',
    'projects',
    'team-management',
    'people',
    'dashboard',
    'budget-finance',
    'security-testing',
    'earnings',
    'report',
    'settings',
  ],
  // CFO: 1. Financial Operations, 2. Treasury & Budgets, 3. Executive Dashboard, 4. Directory
  cfo: [
    'budget',
    'earnings',
    'dashboard',
    'people',
    'reports',
    'audit-log',
    'projects-repos',
    'team-management',
    'tasks',
    'task-management',
    'settings',
  ],
  // CHRO: 1. People & Culture, 2. Performance, 3. Executive Dashboard, 4. Directory
  cpo: [
    'team-management',
    'performance',
    'dashboard',
    'people',
    'reports',
    'audit-log',
    'projects-repos',
    'tasks',
    'task-management',
    'access-control',
    'settings',
  ],
  // CEO & CTO: 1. Executive Dashboard, 2. Governance, 3. Engineering/Projects, 4. Financials
  ceo: [
    'dashboard',
    'access-control',
    'audit-log',
    'reports',
    'projects-repos',
    'team-management',
    'code-quality',
    'security-testing',
    'consultancy',
    'budget',
    'earnings',
    'people',
    'performance',
    'task-management',
    'tasks',
    'settings',
  ],
  cto: [
    'dashboard',
    'audit-log',
    'reports',
    'projects-repos',
    'team-management',
    'code-quality',
    'security-testing',
    'consultancy',
    'task-management',
    'tasks',
    'earnings',
    'people',
    'settings',
  ],
}

function sortNavigationByRolePriority(items: NavItem[], roleId: string): NavItem[] {
  const normalized = roleId.toLowerCase() === 'chro' ? 'cpo' : roleId.toLowerCase()
  const priorityOrder = ROLE_NAVIGATION_PRIORITY[normalized] || ROLE_NAVIGATION_PRIORITY.developer
  const rankMap = new Map(priorityOrder.map((id, idx) => [id, idx]))

  return [...items].sort((a, b) => {
    const rankA = rankMap.get(a.id) ?? 999
    const rankB = rankMap.get(b.id) ?? 999
    if (rankA !== rankB) return rankA - rankB
    return a.label.localeCompare(b.label)
  })
}

export function Sidebar() {
  const {
    currentRole,
    currentRoute,
    setRoute,
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    currentUser,
  } = useApp()
  // Keep the main sidebar strictly tied to baseline organizational role permissions;
  // temporary DAC delegations launch from Profile & Settings without cluttering the sidebar.
  const { rolePermissions } = usePermissions()

  const navConfig = getDynamicNavigation(rolePermissions, currentRole)

  const orderedNavItems = useMemo(
    () => sortNavigationByRolePriority(navConfig.items, currentRole),
    [navConfig.items, currentRole],
  )

  const handleNavigate = (routeId: string) => {
    setRoute(routeId)
    setMobileSidebarOpen(false)
  }

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-white dark:bg-[#0c111d] border-r border-slate-200 dark:border-slate-800 transition-all duration-200 select-none shadow-sm lg:shadow-none ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${isSidebarCollapsed ? 'lg:w-20 w-64' : 'w-64'}`}
    >
      {/* Top Brand Header with Logo & Collapse/Expand Chevron */}
      <div
        className={`flex items-center h-20 border-b border-slate-200/80 dark:border-slate-800 ${
          isSidebarCollapsed && !isMobileSidebarOpen
            ? 'justify-between px-3'
            : 'justify-between px-5'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="/Logo.png"
            alt="Pointfex Logo"
            className="w-9 h-9 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-700 shrink-0"
          />
          {(!isSidebarCollapsed || isMobileSidebarOpen) && (
            <div className="min-w-0">
              <div className="font-display font-bold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                Pointfex
              </div>
              <div className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mt-1 truncate">
                Enterprise ERP
              </div>
            </div>
          )}
        </div>

        {/* Desktop Collapse / Expand Button at Top Right of Logo */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden lg:inline-flex p-1.5 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 cursor-pointer shrink-0"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Mobile close */}
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
          aria-label="Close navigation menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Priority-Sorted, Permission-Filtered Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {orderedNavItems.map((item) => {
          const isActive = currentRoute === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/70'
              } ${isSidebarCollapsed && !isMobileSidebarOpen ? 'lg:justify-center lg:px-0' : ''}`}
              title={isSidebarCollapsed && !isMobileSidebarOpen ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                }`}
              />

              {(!isSidebarCollapsed || isMobileSidebarOpen) && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* User profile capsule at bottom */}
      <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800">
        {!isSidebarCollapsed || isMobileSidebarOpen ? (
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#131926] border border-slate-200/80 dark:border-slate-800">
            <div className="relative shrink-0">
              <Avatar
                src={currentUser?.avatarUrl || currentUser?.avatar}
                name={currentUser?.name}
                initials={currentUser?.initials}
                size="md"
                className="shadow-sm"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white dark:border-[#131926] rounded-full ${
                  currentUser?.isSuspended ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {currentUser?.name || 'Pointfex Member'}
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {currentUser?.title || navConfig.roleLabel}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative">
              <Avatar
                src={currentUser?.avatarUrl || currentUser?.avatar}
                name={currentUser?.name}
                initials={currentUser?.initials}
                size="md"
                className="shadow-sm"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white dark:border-[#0c111d] rounded-full ${
                  currentUser?.isSuspended ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
