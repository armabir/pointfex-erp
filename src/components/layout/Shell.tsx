import { useEffect, type ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useApp } from '../../context/AppContext'
import { QuickSearchModal } from '../common/QuickSearchModal'
import { TaskDetailModal } from '../common/TaskDetailModal'
import { ProjectDetailModal } from '../common/ProjectDetailModal'
import { CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react'

export interface ShellProps {
  children?: ReactNode
}

export function Shell({ children }: ShellProps) {
  const {
    isSidebarCollapsed,
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    isSearchOpen,
    setIsSearchOpen,
    selectedTaskModal,
    setSelectedTaskModal,
    selectedProjectModal,
    setSelectedProjectModal,
    toastMessage,
    isDataLoading,
    data,
  } = useApp()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setIsSearchOpen])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Mobile Sidebar Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Container (PC-first responsive padding) */}
      <div
        className={`flex-1 flex flex-col transition-all duration-200 ${
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        <Header />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-12 max-w-7xl w-full mx-auto">
          {isDataLoading && data.users.length === 0 ? (
            <div className="min-h-[55vh] flex flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-7 h-7 animate-spin text-indigo-600 dark:text-indigo-400" />
              <p className="text-xs font-medium tracking-wide">
                Loading enterprise workspace from PostgreSQL...
              </p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* Modals & Portal */}
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-white dark:bg-[#131722] border border-gray-200 dark:border-gray-800 shadow-xl text-xs text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          ) : toastMessage.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          )}
          <span className="font-medium">{toastMessage.msg}</span>
        </div>
      )}
    </div>
  )
}
