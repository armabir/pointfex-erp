import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check, Shield, Briefcase, Code, BarChart, Users, DollarSign } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { ROLE_LIST } from '../../data/roles.js'

const ROLE_ICONS = {
  developer: Code,
  pm: Briefcase,
  cto: Shield,
  cpo: Users,
  cfo: DollarSign,
  ceo: BarChart,
}

export function RoleSwitcher() {
  const { currentRole, setRole } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const activeRoleConfig = ROLE_LIST.find((r) => r.id === currentRole) || ROLE_LIST[0]
  const ActiveIcon = ROLE_ICONS[currentRole] || Code

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
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
        className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200/70 hover:border-slate-300 text-xs text-slate-800 shadow-2xs transition-all cursor-pointer"
        title="Switch Role"
      >
        <ActiveIcon className="w-3.5 h-3.5 text-slate-700" />
        <span className="font-medium">{activeRoleConfig.name}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-1.5 animate-in fade-in duration-100">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Switch Workspace
          </div>

          <div className="space-y-0.5">
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
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{role.name}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
