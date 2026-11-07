import { useState, useRef, useEffect, type ComponentType } from 'react'
import { ChevronDown, Check, Shield, Briefcase, Code, BarChart, Users, DollarSign } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { ROLE_LIST } from '../../data/roles'

const ROLE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  developer: Code,
  pm: Briefcase,
  cto: Shield,
  cpo: Users,
  cfo: DollarSign,
  ceo: BarChart,
}

export function RoleSwitcher() {
  const { currentRole, setRole, currentPmId, setPmId, data, resolvers } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const activeRoleConfig = ROLE_LIST.find((r) => r.id === currentRole) || ROLE_LIST[0]
  const ActiveIcon = ROLE_ICONS[currentRole] || Code

  const currentPmUser = resolvers.getUser(currentPmId)
  const pmList = data.users.filter((u) => u.role === 'pm')

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#131722] border border-slate-200/70 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs text-slate-800 dark:text-slate-100 shadow-2xs transition-all cursor-pointer"
        title="Switch Role or PM Persona"
      >
        <ActiveIcon className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
        <span className="font-medium">
          {currentRole === 'pm' && currentPmUser
            ? `PM: ${currentPmUser.name.split(' ')[0]}`
            : activeRoleConfig.name}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#131722] border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in duration-100 max-h-[85vh] overflow-y-auto">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Switch Workspace
          </div>

          <div className="space-y-0.5 mb-2">
            {ROLE_LIST.map((role) => {
              const isSelected = role.id === currentRole
              const Icon = ROLE_ICONS[role.id] || Code

              return (
                <button
                  key={role.id}
                  onClick={() => {
                    setRole(role.id)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                    <span className="truncate">{role.name}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-slate-900 dark:text-white shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {/* PM Persona Selector (Available to switch between different PMs) */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>PM Squad Persona</span>
              <span className="text-[10px] text-lime-600 dark:text-lime-400 font-normal">6 Teams</span>
            </div>
            <div className="space-y-1">
              {pmList.map((pm) => {
                const team = data.teams.find((t) => t.pmId === pm.id || t.id === pm.teamId)
                const isCurrent = currentRole === 'pm' && currentPmId === pm.id

                return (
                  <button
                    key={pm.id}
                    onClick={() => {
                      setPmId(pm.id)
                      setRole('pm')
                      setIsOpen(false)
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-lime-50 dark:bg-lime-950/30 text-lime-900 dark:text-lime-300 border border-lime-200 dark:border-lime-900/50 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate text-xs">{pm.name}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                        {team?.name || 'Assigned Squad'}
                      </div>
                    </div>
                    {isCurrent && (
                      <Check className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0 ml-1.5" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

