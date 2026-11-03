import React, { createContext, useState, useMemo, useCallback } from 'react'
import { getInitialSeedData, createDataResolvers, CURRENT_DEV_ID } from '../data/index.js'
import { ROLES } from '../data/roles.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // Application State
  const [data, setData] = useState(() => getInitialSeedData())
  const [currentRole, setCurrentRole] = useState('developer')
  const [currentDevId, setCurrentDevId] = useState(CURRENT_DEV_ID)
  const [currentRoute, setCurrentRoute] = useState('dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [selectedTaskModal, setSelectedTaskModal] = useState(null)
  const [selectedProjectModal, setSelectedProjectModal] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

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
    // Return executive user matching the role
    const roleUser = data.users.find((u) => u.role === currentRole)
    return roleUser || resolvers.getUser(currentDevId)
  }, [currentRole, currentDevId, resolvers, data.users])

  // Current developer's team
  const currentTeam = useMemo(() => {
    if (!currentUser?.teamId) return null
    return resolvers.getTeam(currentUser.teamId)
  }, [currentUser, resolvers])

  // Handler: Change Role
  const handleSetRole = useCallback((roleId) => {
    setCurrentRole(roleId)
    if (roleId === 'developer') {
      setCurrentRoute('dashboard')
      showToast('Switched to Developer Workspace (Fully Functional)', 'success')
    } else {
      setCurrentRoute('overview')
      const targetRole = ROLES[roleId.toUpperCase()]?.name || roleId
      showToast(`Switched to ${targetRole} (Demo Placeholder)`, 'info')
    }
  }, [showToast])

  // Handler: Reset Demo Data
  const handleResetDemoData = useCallback(() => {
    setData(getInitialSeedData())
    setCurrentRole('developer')
    setCurrentDevId(CURRENT_DEV_ID)
    setCurrentRoute('dashboard')
    setSelectedTaskModal(null)
    setSelectedProjectModal(null)
    showToast('Demo data successfully restored to factory defaults.', 'success')
  }, [showToast])

  // Handler: Toggle Task Status (Updates state dynamically!)
  const handleUpdateTaskStatus = useCallback((taskId, newStatus) => {
    setData((prev) => {
      const taskIndex = prev.tasks.findIndex((t) => t.id === taskId)
      if (taskIndex === -1) return prev

      const oldTask = prev.tasks[taskIndex]
      const updatedTasks = [...prev.tasks]
      updatedTasks[taskIndex] = { ...oldTask, status: newStatus }

      // Also record in activity logs
      const newActivity = {
        id: `act_${Date.now()}`,
        userId: CURRENT_DEV_ID,
        action: 'status_change',
        entityType: 'task',
        entityId: taskId,
        entityTitle: oldTask.title,
        description: `Status changed from ${oldTask.status.replace('_', ' ')} to ${newStatus.replace('_', ' ')}`,
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
    showToast(`Task status updated to "${newStatus.replace('_', ' ')}"`, 'success')
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
    showToast('All notifications marked as read', 'info')
  }, [showToast])

  // Context value
  const value = {
    // State
    data,
    currentRole,
    currentDevId,
    currentRoute,
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
    setRoute: setCurrentRoute,
    toggleSidebar: () => setIsSidebarCollapsed((prev) => !prev),
    setSidebarCollapsed: setIsSidebarCollapsed,
    setSearchQuery,
    setIsSearchOpen,
    setSelectedTaskModal,
    setSelectedProjectModal,
    updateTaskStatus: handleUpdateTaskStatus,
    markNotificationRead: handleMarkNotificationRead,
    markAllNotificationsRead: handleMarkAllNotificationsRead,
    resetDemoData: handleResetDemoData,
    showToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export { AppContext }
export { useApp } from '../hooks/useApp.js'
