import React, { createContext, useState, useMemo, useCallback, useEffect } from 'react'
import { getInitialSeedData, createDataResolvers, CURRENT_DEV_ID } from '../data/index.js'
import { ROLES } from '../data/roles.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // 1. Initial State with URL hash & localStorage persistence
  const [data, setData] = useState(() => getInitialSeedData())

  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('pointfex_role') || 'developer'
  })

  const [currentDevId, setCurrentDevId] = useState(CURRENT_DEV_ID)

  const [currentRoute, setCurrentRouteState] = useState(() => {
    const hashRoute = window.location.hash.replace('#', '')
    if (hashRoute) return hashRoute
    return localStorage.getItem('pointfex_route') || 'dashboard'
  })

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('pointfex_theme') || 'light'
  })

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [selectedTaskModal, setSelectedTaskModal] = useState(null)
  const [selectedProjectModal, setSelectedProjectModal] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  // 2. Sync theme to document.documentElement class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('pointfex_theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  // 3. Persistent Route Handler
  const setRoute = useCallback((routeId) => {
    setCurrentRouteState(routeId)
    localStorage.setItem('pointfex_route', routeId)
    window.location.hash = routeId
  }, [])

  // Listen to browser forward/back hash change
  useEffect(() => {
    const handleHashChange = () => {
      const hashRoute = window.location.hash.replace('#', '')
      if (hashRoute && hashRoute !== currentRoute) {
        setCurrentRouteState(hashRoute)
        localStorage.setItem('pointfex_route', hashRoute)
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [currentRoute])

  // Show a non-intrusive toast notification
  const showToast = useCallback((msg, type = 'info') => {
    setToastMessage({ msg, type, id: Date.now() })
    setTimeout(() => {
      setToastMessage((prev) => (prev && prev.msg === msg ? null : prev))
    }, 3500)
  }, [])

  // Relational resolvers derived from current data state
  const resolvers = useMemo(() => createDataResolvers(data), [data])

  // Current logged in user object
  const currentUser = useMemo(() => {
    if (currentRole === 'developer') {
      return resolvers.getUser(currentDevId)
    }
    const roleUser = data.users.find((u) => u.role === currentRole)
    return roleUser || resolvers.getUser(currentDevId)
  }, [currentRole, currentDevId, resolvers, data.users])

  // Current developer's team
  const currentTeam = useMemo(() => {
    if (!currentUser?.teamId) return null
    return resolvers.getTeam(currentUser.teamId)
  }, [currentUser, resolvers])

  // Handler: Change Role (persisted)
  const handleSetRole = useCallback((roleId) => {
    setCurrentRole(roleId)
    localStorage.setItem('pointfex_role', roleId)
    if (roleId === 'developer') {
      const target = localStorage.getItem('pointfex_route') || 'dashboard'
      setRoute(target)
      showToast('Switched to Developer Workspace', 'success')
    } else {
      const targetRole = ROLES[roleId.toUpperCase()]?.name || roleId
      showToast(`Switched to ${targetRole} (Preview)`, 'info')
    }
  }, [setRoute, showToast])

  // Handler: Reset Demo Data
  const handleResetDemoData = useCallback(() => {
    setData(getInitialSeedData())
    setCurrentRole('developer')
    localStorage.setItem('pointfex_role', 'developer')
    setCurrentDevId(CURRENT_DEV_ID)
    setRoute('dashboard')
    setSelectedTaskModal(null)
    setSelectedProjectModal(null)
    showToast('Demo data restored to defaults', 'success')
  }, [setRoute, showToast])

  // Handler: Toggle Task Status
  const handleUpdateTaskStatus = useCallback((taskId, newStatus) => {
    // Permission constraint: Developers cannot mark tasks as Completed
    if (currentRole === 'developer' && newStatus === 'completed') {
      showToast('Permission denied: Only Project Managers (PM) can mark tasks as Completed', 'error')
      return false
    }

    setData((prev) => {
      const taskIndex = prev.tasks.findIndex((t) => t.id === taskId)
      if (taskIndex === -1) return prev

      const oldTask = prev.tasks[taskIndex]
      const updatedTasks = [...prev.tasks]
      updatedTasks[taskIndex] = { ...oldTask, status: newStatus }

      const newActivity = {
        id: `act_${Date.now()}`,
        userId: CURRENT_DEV_ID,
        action: 'status_change',
        entityType: 'task',
        entityId: taskId,
        entityTitle: oldTask.title,
        description: `Status changed to ${newStatus.replace('_', ' ')}`,
        timestamp: 'Just now',
        category: 'task',
        badgeColor: newStatus === 'completed' ? 'emerald' : 'sky',
      }

      return {
        ...prev,
        tasks: updatedTasks,
        activityLogs: [newActivity, ...prev.activityLogs],
      }
    })
    showToast(`Task moved to "${newStatus.replace('_', ' ')}"`, 'success')
    return true
  }, [currentRole, showToast])

  // Handler: Update User Profile (editable profile requirement)
  const handleUpdateUserProfile = useCallback((updatedFields) => {
    setData((prev) => {
      const userIndex = prev.users.findIndex((u) => u.id === currentDevId)
      if (userIndex === -1) return prev

      const updatedUsers = [...prev.users]
      updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...updatedFields }

      return {
        ...prev,
        users: updatedUsers,
      }
    })
    showToast('Profile updated successfully', 'success')
  }, [currentDevId, showToast])

  // Handler: Add Project Deliverable Submission
  const handleAddSubmission = useCallback((submission) => {
    setData((prev) => ({
      ...prev,
      reports: [submission, ...prev.reports],
    }))
    showToast('Project deliverable submitted for PM review', 'success')
  }, [showToast])

  // Handler: Add Complaint / Escalation
  const handleAddComplaint = useCallback((complaint) => {
    setData((prev) => ({
      ...prev,
      reports: [complaint, ...prev.reports],
    }))
    showToast('Grievance report submitted to management', 'success')
  }, [showToast])

  // Handler: Notifications
  const handleMarkNotificationRead = useCallback((notificationId) => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }))
  }, [])

  const handleMarkAllNotificationsRead = useCallback(() => {
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }))
    showToast('All notifications marked read', 'info')
  }, [showToast])

  // Context value
  const value = {
    // State
    data,
    currentRole,
    currentDevId,
    currentRoute,
    theme,
    isSidebarCollapsed,
    searchQuery,
    isSearchOpen,
    selectedTaskModal,
    selectedProjectModal,
    toastMessage,
    currentUser,
    currentTeam,
    resolvers,

    // Setters / Actions
    setRole: handleSetRole,
    setRoute,
    toggleTheme,
    toggleSidebar: () => setIsSidebarCollapsed((prev) => !prev),
    setSidebarCollapsed: setIsSidebarCollapsed,
    setSearchQuery,
    setIsSearchOpen,
    setSelectedTaskModal,
    setSelectedProjectModal,
    updateTaskStatus: handleUpdateTaskStatus,
    updateUserProfile: handleUpdateUserProfile,
    addSubmission: handleAddSubmission,
    addComplaint: handleAddComplaint,
    markNotificationRead: handleMarkNotificationRead,
    markAllNotificationsRead: handleMarkAllNotificationsRead,
    resetDemoData: handleResetDemoData,
    showToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export { AppContext }
