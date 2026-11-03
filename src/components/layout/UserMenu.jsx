import React, { useState, useRef, useEffect } from 'react'
import { RotateCcw, Settings } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

export function UserMenu() {
  const { currentUser, setRoute, resetDemoData } = useApp()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  if (!currentUser) return null

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200/70 hover:border-slate-300 shadow-2xs transition-colors cursor-pointer"
        aria-label="User profile menu"
      >
        <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
          {currentUser.initials || 'AR'}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 p-2 animate-in fade-in duration-100">
          <div className="p-3 border-b border-slate-100 mb-1">
            <div className="text-xs font-semibold text-slate-900 truncate">
              {currentUser.name}
            </div>
            <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
          </div>

          <div className="space-y-0.5 text-xs">
            <button
              onClick={() => {
                setRoute('settings')
                setIsOpen(false)
              }}
              className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Profile & Settings</span>
            </button>

            <button
              onClick={() => {
                resetDemoData()
                setIsOpen(false)
              }}
              className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
