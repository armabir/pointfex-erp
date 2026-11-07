import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react'
import { getInitialSeedData, createDataResolvers, CURRENT_DEV_ID, CURRENT_PM_ID } from '../data/index.js'
import { ROLES } from '../data/roles.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  // 1. Initial State with URL hash & localStorage persistence
  const [data, setData] = useState(() => getInitialSeedData())

  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('pointfex_role') || 'developer'
  })

  const [currentDevId, setCurrentDevId] = useState(CURRENT_DEV_ID)
  const [currentPmId, setCurrentPmId] = useState(() => {
    return localStorage.getItem('pointfex_pm_id') || CURRENT_PM_ID
  })

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
    if (currentRole === 'pm') {
      localStorage.setItem('pointfex_pm_route', routeId)
    } else {
      localStorage.setItem('pointfex_route', routeId)
    }
    window.location.hash = routeId
  }, [currentRole])

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
    if (currentRole === 'pm') {
      return resolvers.getUser(currentPmId) || data.users.find((u) => u.role === 'pm')
    }
    const roleUser = data.users.find((u) => u.role === currentRole)
    return roleUser || resolvers.getUser(currentDevId)
  }, [currentRole, currentDevId, currentPmId, resolvers, data.users])

  // Current user's team
  const currentTeam = useMemo(() => {
    if (currentRole === 'pm') {
      return data.teams.find((t) => t.pmId === currentPmId || t.id === currentUser?.teamId) || null
    }
    if (!currentUser?.teamId) return null
    return resolvers.getTeam(currentUser.teamId)
  }, [currentRole, currentPmId, currentUser, resolvers, data.teams])

  // Handler: Change Role (persisted)
  const handleSetRole = useCallback((roleId) => {
    setCurrentRole(roleId)
    localStorage.setItem('pointfex_role', roleId)
    if (roleId === 'developer') {
      const target = localStorage.getItem('pointfex_route') || 'dashboard'
      setRoute(target)
      showToast('Switched to Developer Workspace', 'success')
    } else if (roleId === 'pm') {
      const target = localStorage.getItem('pointfex_pm_route') || 'dashboard'
      setRoute(target)
      showToast('Switched to Project Manager Workspace', 'success')
    } else {
      const targetRole = ROLES[roleId.toUpperCase()]?.name || roleId
      showToast(`Switched to ${targetRole} (Preview)`, 'info')
    }
  }, [setRoute, showToast])

  // Handler: Change Active PM User (for dynamic PM switching)
  const handleSetPmId = useCallback((pmId) => {
    setCurrentPmId(pmId)
    localStorage.setItem('pointfex_pm_id', pmId)
    const pm = resolvers.getUser(pmId)
    showToast(`Active PM: ${pm?.name || 'Project Manager'}`, 'info')
  }, [resolvers, showToast])

  // Handler: Reset Demo Data
  const handleResetDemoData = useCallback(() => {
    setData(getInitialSeedData())
    setCurrentRole('developer')
    localStorage.setItem('pointfex_role', 'developer')
    setCurrentDevId(CURRENT_DEV_ID)
    setCurrentPmId(CURRENT_PM_ID)
    localStorage.setItem('pointfex_pm_id', CURRENT_PM_ID)
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

  // --- PM WORKSPACE ACTION HANDLERS ---

  // PM Handler: Create New Task for Team
  const handleCreateTask = useCallback((taskData) => {
    const newTask = {
      id: `task_${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      projectId: taskData.projectId,
      assigneeId: taskData.assigneeId,
      creatorId: currentPmId,
      status: 'todo',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      estimatedHours: Number(taskData.estimatedHours) || 8,
      loggedHours: 0,
      tags: taskData.tags || [],
      checklist: taskData.checklist || [],
      createdAt: new Date().toISOString().split('T')[0],
    }

    const assignee = resolvers.getUser(newTask.assigneeId)
    const newActivity = {
      id: `act_${Date.now()}`,
      userId: currentPmId,
      action: 'task_created',
      entityType: 'task',
      entityId: newTask.id,
      entityTitle: newTask.title,
      description: `Task created and assigned to ${assignee?.name || 'developer'}`,
      timestamp: 'Just now',
      category: 'task',
      badgeColor: 'sky',
    }

    setData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
      activityLogs: [newActivity, ...prev.activityLogs],
    }))

    showToast(`Task "${newTask.title}" created successfully`, 'success')
    return newTask
  }, [currentPmId, resolvers, showToast])

  // PM Handler: Approve Task & Mark Completed
  const handleApproveTask = useCallback((taskId, feedback) => {
    setData((prev) => {
      const taskIndex = prev.tasks.findIndex((t) => t.id === taskId)
      if (taskIndex === -1) return prev

      const oldTask = prev.tasks[taskIndex]
      const updatedTasks = [...prev.tasks]
      updatedTasks[taskIndex] = { ...oldTask, status: 'completed' }

      const updatedComments = feedback
        ? [
            ...prev.comments,
            {
              id: `comm_${Date.now()}`,
              taskId,
              authorId: currentPmId,
              content: `[PM Approval]: ${feedback}`,
              createdAt: new Date().toISOString(),
            },
          ]
        : prev.comments

      const newActivity = {
        id: `act_${Date.now()}`,
        userId: currentPmId,
        action: 'task_approved',
        entityType: 'task',
        entityId: taskId,
        entityTitle: oldTask.title,
        description: `Verified deliverable and marked task as Completed`,
        timestamp: 'Just now',
        category: 'task',
        badgeColor: 'emerald',
      }

      return {
        ...prev,
        tasks: updatedTasks,
        comments: updatedComments,
        activityLogs: [newActivity, ...prev.activityLogs],
      }
    })
    showToast('Task approved and marked as Completed', 'success')
  }, [currentPmId, showToast])

  // PM Handler: Reject Task & Return to In Progress
  const handleRejectTask = useCallback((taskId, feedback) => {
    setData((prev) => {
      const taskIndex = prev.tasks.findIndex((t) => t.id === taskId)
      if (taskIndex === -1) return prev

      const oldTask = prev.tasks[taskIndex]
      const updatedTasks = [...prev.tasks]
      updatedTasks[taskIndex] = { ...oldTask, status: 'in_progress' }

      const updatedComments = feedback
        ? [
            ...prev.comments,
            {
              id: `comm_${Date.now()}`,
              taskId,
              authorId: currentPmId,
              content: `[PM Review Feedback - Needs Revision]: ${feedback}`,
              createdAt: new Date().toISOString(),
            },
          ]
        : prev.comments

      const newActivity = {
        id: `act_${Date.now()}`,
        userId: currentPmId,
        action: 'task_rejected',
        entityType: 'task',
        entityId: taskId,
        entityTitle: oldTask.title,
        description: `Returned task to In Progress with review feedback`,
        timestamp: 'Just now',
        category: 'task',
        badgeColor: 'amber',
      }

      return {
        ...prev,
        tasks: updatedTasks,
        comments: updatedComments,
        activityLogs: [newActivity, ...prev.activityLogs],
      }
    })
    showToast('Task returned to In Progress with feedback', 'info')
  }, [currentPmId, showToast])

  // PM Handler: Reassign Task
  const handleReassignTask = useCallback((taskId, newAssigneeId) => {
    setData((prev) => {
      const taskIndex = prev.tasks.findIndex((t) => t.id === taskId)
      if (taskIndex === -1) return prev

      const oldTask = prev.tasks[taskIndex]
      const updatedTasks = [...prev.tasks]
      updatedTasks[taskIndex] = { ...oldTask, assigneeId: newAssigneeId }

      const newAssignee = resolvers.getUser(newAssigneeId)
      const newActivity = {
        id: `act_${Date.now()}`,
        userId: currentPmId,
        action: 'task_reassigned',
        entityType: 'task',
        entityId: taskId,
        entityTitle: oldTask.title,
        description: `Reassigned task to ${newAssignee?.name || 'developer'}`,
        timestamp: 'Just now',
        category: 'task',
        badgeColor: 'sky',
      }

      return {
        ...prev,
        tasks: updatedTasks,
        activityLogs: [newActivity, ...prev.activityLogs],
      }
    })
    const devName = resolvers.getUser(newAssigneeId)?.name || 'developer'
    showToast(`Task reassigned to ${devName}`, 'success')
  }, [currentPmId, resolvers, showToast])

  // PM Handler: Allocate Budget to Developer
  const handleAllocateBudget = useCallback((allocation) => {
    const newTx = {
      id: `alloc_${Date.now()}`,
      userId: allocation.developerId,
      projectId: allocation.projectId,
      amount: Number(allocation.amount),
      type: 'budget_allocation',
      description: allocation.description || `Week ${allocation.week || 3} sprint allocation`,
      date: new Date().toISOString().split('T')[0],
      status: 'allocated',
    }

    setData((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
    }))

    const devName = resolvers.getUser(allocation.developerId)?.name || 'developer'
    showToast(`Allocated $${allocation.amount} to ${devName}`, 'success')
  }, [resolvers, showToast])

  // PM Handler: Request Budget Increase from CFO
  const handleRequestBudgetIncrease = useCallback((req) => {
    const project = resolvers.getProject(req.projectId)
    const newReport = {
      id: `pm_budget_${Date.now()}`,
      userId: currentPmId,
      teamId: currentUser?.teamId || 'team_01',
      type: 'pm_report',
      category: 'Budget Request',
      recipient: 'Chief Financial Officer (CFO)',
      title: `Budget Increase Request: $${req.amount} for ${project?.name || 'Project'}`,
      description: req.reason,
      projectId: req.projectId,
      date: new Date().toISOString().split('T')[0],
      status: 'under_review',
      submittedAt: new Date().toISOString(),
      feedback: 'Awaiting CFO review in financial allocations queue.',
    }

    setData((prev) => ({
      ...prev,
      reports: [newReport, ...prev.reports],
    }))
    showToast(`Budget request of $${req.amount} submitted to CFO`, 'success')
  }, [currentPmId, currentUser, resolvers, showToast])

  // PM Handler: Submit Report to C-Level
  const handleSubmitPmReport = useCallback((report) => {
    const newReport = {
      id: `pm_rep_${Date.now()}`,
      userId: currentPmId,
      teamId: currentUser?.teamId || 'team_01',
      type: 'pm_report',
      category: report.category,
      recipient: report.recipient,
      title: report.title,
      description: report.description,
      projectId: report.projectId || '',
      docsUrl: report.docsUrl || '',
      date: new Date().toISOString().split('T')[0],
      status: 'under_review',
      submittedAt: new Date().toISOString(),
      feedback: `Report logged and queued for review by ${report.recipient}.`,
    }

    setData((prev) => ({
      ...prev,
      reports: [newReport, ...prev.reports],
    }))
    showToast(`Report submitted to ${report.recipient}`, 'success')
  }, [currentPmId, currentUser, showToast])

  // PM Handler: Update Personal Task Status
  const handleUpdatePmTaskStatus = useCallback((taskId, newStatus) => {
    setData((prev) => {
      const taskIndex = prev.tasks.findIndex((t) => t.id === taskId)
      if (taskIndex === -1) return prev

      const updatedTasks = [...prev.tasks]
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], status: newStatus }

      return {
        ...prev,
        tasks: updatedTasks,
      }
    })
    showToast(`Task status updated to ${newStatus.replace('_', ' ')}`, 'success')
  }, [showToast])

  // Context value
  const value = {
    // State
    data,
    currentRole,
    currentDevId,
    currentPmId,
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
    setPmId: handleSetPmId,
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

    // PM Workspace Handlers
    createTask: handleCreateTask,
    approveTask: handleApproveTask,
    rejectTask: handleRejectTask,
    reassignTask: handleReassignTask,
    allocateBudget: handleAllocateBudget,
    requestBudgetIncrease: handleRequestBudgetIncrease,
    submitPmReport: handleSubmitPmReport,
    updatePmTaskStatus: handleUpdatePmTaskStatus,
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
