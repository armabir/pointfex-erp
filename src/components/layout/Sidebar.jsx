import React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { getNavigationForRole } from '../../config/navigation.js'

export function Sidebar() {
  const {
    currentRole,
    currentRoute,
    setRoute,
    isSidebarCollapsed,
    toggleSidebar,
    currentUser,
  } = useApp()

  const navConfig = getNavigationForRole(currentRole)

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-[#eaeef2] dark:bg-[#090c14] border-r border-slate-200/60 dark:border-slate-800/60 transition-all duration-200 select-none ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-20 px-6">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white shadow-xs shrink-0">
              <Sparkles className="w-4 h-4 text-[#e2f952]" />
            </div>
            <div className="min-w-0">
              <span className="font-display font-bold text-base tracking-tight text-slate-900 dark:text-white">
                Pointfex
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4 text-[#e2f952]" />
            </div>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
            isSidebarCollapsed ? 'hidden' : 'block'
          }`}
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1.5">
        {navConfig.items.map((item) => {
          const isActive = currentRoute === item.id
          const Icon = item.icon

          return (
            <button
              key={item.id}
              onClick={() => setRoute(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'bg-[#e2f952] text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60'
              } ${isSidebarCollapsed ? 'justify-center px-0 py-3' : ''}`}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-slate-950' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                }`}
              />

              {!isSidebarCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Collapse Toggle when Collapsed */}
      {isSidebarCollapsed && (
        <div className="p-3 flex justify-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* User profile capsule at bottom */}
      <div className="p-4">
        {!isSidebarCollapsed ? (
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-[#131722] border border-slate-100 dark:border-slate-800 shadow-2xs">
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                {currentUser?.initials || 'AR'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#131722] rounded-full" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                {currentUser?.name || 'Alex Rivera'}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                Senior Frontend
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center text-xs font-bold">
                {currentUser?.initials || 'AR'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-[#131722] rounded-full" />
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
