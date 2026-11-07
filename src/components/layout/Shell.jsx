import React, { useEffect } from 'react'
import { Sidebar } from './Sidebar.jsx'
import { Header } from './Header.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { QuickSearchModal } from '../common/QuickSearchModal.jsx'
import { TaskDetailModal } from '../common/TaskDetailModal.jsx'
import { ProjectDetailModal } from '../common/ProjectDetailModal.jsx'
import { CheckCircle2, AlertCircle, Info } from 'lucide-react'

export function Shell({ children }) {
  const {
    isSidebarCollapsed,
    isSearchOpen,
    setIsSearchOpen,
    selectedTaskModal,
    setSelectedTaskModal,
    selectedProjectModal,
    setSelectedProjectModal,
    toastMessage,
  } = useApp()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setIsSearchOpen])

  return (
    <div className="min-h-screen bg-[#eaeef2] dark:bg-[#090c14] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${
          isSidebarCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        <Header />

        <main className="flex-1 px-6 sm:px-8 pb-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Modals */}
      <QuickSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <TaskDetailModal
        task={selectedTaskModal}
        isOpen={Boolean(selectedTaskModal)}
        onClose={() => setSelectedTaskModal(null)}
      />

      <ProjectDetailModal
        project={selectedProjectModal}
        isOpen={Boolean(selectedProjectModal)}
        onClose={() => setSelectedProjectModal(null)}
      />

      {/* Toast notification pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-[#131722] border border-slate-100 dark:border-slate-800 shadow-xl text-xs text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-sky-500 shrink-0" />
          )}
          <span className="font-medium">{toastMessage.msg}</span>
        </div>
      )}
    </div>
  )
}
