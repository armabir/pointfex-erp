import { createContext, useContext, useState, useMemo, useCallback, useEffect, type ReactNode } from 'react'
import { getInitialSeedData, createDataResolvers, CURRENT_DEV_ID, CURRENT_PM_ID } from '../data'
import { ROLES } from '../data/roles'
import { api, type BackendHealthResponse } from '../services/api'
import type {
  SeedData,
  AppContextType,
  User,
  Team,
  Task,
  Report,
  Project,
  Repository,
  TaskStatus,
  TaskPriority,
  TaskChecklistItem,
  ToastMessage,
  ActivityLog,
  ProjectMilestone,
} from '../types'

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  // 1. Initial State with URL hash & localStorage persistence
  const [data, setData] = useState<SeedData>(() => getInitialSeedData())
  const [backendStatus, setBackendStatus] = useState<'connected' | 'connecting' | 'offline' | 'error'>('connecting')
  const [backendHealth, setBackendHealth] = useState<BackendHealthResponse | null>(null)

  const [currentRole, setCurrentRole] = useState<string>(() => {
    return localStorage.getItem('pointfex_role') || 'developer'
  })

  const [currentDevId, setCurrentDevId] = useState<string>(CURRENT_DEV_ID)
  const [currentPmId, setCurrentPmId] = useState<string>(() => {
    return localStorage.getItem('pointfex_pm_id') || CURRENT_PM_ID
  })

  const [currentRoute, setCurrentRouteState] = useState<string>(() => {
    const hashRoute = window.location.hash.replace('#', '')
    if (hashRoute) return hashRoute
    return localStorage.getItem('pointfex_route') || 'dashboard'
  })

  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem('pointfex_theme') || 'light'
  })

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [selectedTaskModal, setSelectedTaskModal] = useState<any>(null)
  const [selectedProjectModal, setSelectedProjectModal] = useState<any>(null)
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null)

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
  const setRoute = useCallback((routeId: string) => {
    setCurrentRouteState(routeId)
    if (currentRole === 'pm') {
      localStorage.setItem('pointfex_pm_route', routeId)
    } else if (currentRole === 'cto') {
      localStorage.setItem('pointfex_cto_route', routeId)
    } else if (currentRole === 'cfo') {
      localStorage.setItem('pointfex_cfo_route', routeId)
    } else if (currentRole === 'cpo' || currentRole === 'chro') {
      localStorage.setItem('pointfex_cpo_route', routeId)
    } else if (currentRole === 'ceo') {
      localStorage.setItem('pointfex_ceo_route', routeId)
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
  const showToast = useCallback((msg: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setToastMessage({ msg, type, id: Date.now() })
    setTimeout(() => {
      setToastMessage((prev) => (prev && prev.msg === msg ? null : prev))
    }, 3500)
  }, [])

  // Relational resolvers derived from current data state
  const resolvers = useMemo(() => createDataResolvers(data), [data])

  // Synchronize with PostgreSQL database via NestJS backend
  const refreshBackendData = useCallback(async () => {
    try {
      const health = await api.checkHealth()
      if (health && health.status === 'ok') {
        setBackendHealth(health)
        setBackendStatus('connected')
        const activeUserId = currentRole === 'developer' ? currentDevId : currentRole === 'pm' ? currentPmId : undefined
        const liveData = await api.fetchFullData(activeUserId, currentRole)
        setData(liveData)
      } else {
        setBackendStatus('offline')
      }
    } catch (err) {
      console.warn('Backend connection failed, running in offline fallback mode:', err)
      setBackendStatus('offline')
    }
  }, [currentRole, currentDevId, currentPmId])

  useEffect(() => {
    let active = true
    const initSync = async () => {
      try {
        const health = await api.checkHealth()
        if (!active) return
        if (health && health.status === 'ok') {
          setBackendHealth(health)
          setBackendStatus('connected')
          const activeUserId = currentRole === 'developer' ? currentDevId : currentRole === 'pm' ? currentPmId : undefined
          const liveData = await api.fetchFullData(activeUserId, currentRole)
          if (!active) return
          setData(liveData)
        } else {
          setBackendStatus('offline')
        }
      } catch (err) {
        if (!active) return
        console.warn('Backend connection failed, running in offline fallback mode:', err)
        setBackendStatus('offline')
      }
    }
    initSync()
    return () => {
      active = false
    }
  }, [currentRole, currentDevId, currentPmId])

  // Current logged in user object
  const currentUser = useMemo<User | null>(() => {
    if (currentRole === 'developer') {
      return resolvers.getUser(currentDevId)
    }
    if (currentRole === 'pm') {
      return resolvers.getUser(currentPmId) || data.users.find((u) => u.role === 'pm') || null
    }
    if (currentRole === 'cto') {
      return data.users.find((u) => u.role === 'cto') || resolvers.getUser('user_cto_01')
    }
    if (currentRole === 'cfo') {
      return data.users.find((u) => u.role === 'cfo') || resolvers.getUser('user_cfo_01')
    }
    if (currentRole === 'cpo' || currentRole === 'chro') {
      return data.users.find((u) => u.role === 'cpo') || resolvers.getUser('user_cpo_01')
    }
    if (currentRole === 'ceo') {
      return data.users.find((u) => u.role === 'ceo') || resolvers.getUser('user_ceo_01')
    }
    const roleUser = data.users.find((u) => u.role === currentRole)
    return roleUser || resolvers.getUser(currentDevId)
  }, [currentRole, currentDevId, currentPmId, resolvers, data.users])

  // Current user's team
  const currentTeam = useMemo<Team | null>(() => {
    if (currentRole === 'pm') {
      return data.teams.find((t) => t.pmId === currentPmId || t.id === currentUser?.teamId) || null
    }
    if (!currentUser?.teamId) return null
    return resolvers.getTeam(currentUser.teamId)
  }, [currentRole, currentPmId, currentUser, resolvers, data.teams])

  // Handler: Change Role (persisted)
  const handleSetRole = useCallback((roleId: string) => {
    const normalizedRole = roleId === 'chro' ? 'cpo' : roleId
    setCurrentRole(normalizedRole)
    localStorage.setItem('pointfex_role', normalizedRole)
    if (normalizedRole === 'developer') {
      const target = localStorage.getItem('pointfex_route') || 'dashboard'
      setRoute(target)
      showToast('Switched to Developer Workspace', 'success')
    } else if (normalizedRole === 'pm') {
      const target = localStorage.getItem('pointfex_pm_route') || 'dashboard'
      setRoute(target)
      showToast('Switched to Project Manager Workspace', 'success')
    } else if (normalizedRole === 'cto') {
      const target = localStorage.getItem('pointfex_cto_route') || 'dashboard'
      setRoute(target)
      showToast('Switched to CTO Engineering Command', 'success')
    } else if (normalizedRole === 'cfo') {
      const target = localStorage.getItem('pointfex_cfo_route') || 'dashboard'
      setRoute(target)
      showToast('Switched to CFO Financial Desk', 'success')
    } else if (normalizedRole === 'cpo') {
      const target = localStorage.getItem('pointfex_cpo_route') || 'dashboard'
      setRoute(target)
      showToast('Switched to CHRO People & Culture Hub', 'success')
    } else if (normalizedRole === 'ceo') {
      const target = localStorage.getItem('pointfex_ceo_route') || 'dashboard'
      setRoute(target)
      showToast('Switched to CEO Executive Command Suite', 'success')
    } else {
      const targetRole = ROLES[roleId.toUpperCase()]?.name || roleId
      showToast(`Switched to ${targetRole}`, 'info')
    }
  }, [setRoute, showToast])

  // Handler: Change Active PM User (for dynamic PM switching)
  const handleSetPmId = useCallback((pmId: string) => {
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
  const handleUpdateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus): boolean => {
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

      const newActivity: ActivityLog = {
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

    // Synchronize to backend database
    api.updateTaskStatus(taskId, newStatus, currentDevId, currentRole).catch((err) => {
      console.warn('Backend sync failed for updateTaskStatus:', err)
    })

    showToast(`Task moved to "${newStatus.replace('_', ' ')}"`, 'success')
    return true
  }, [currentRole, currentDevId, showToast])

  // Handler: Update User Profile (editable profile requirement)
  const handleUpdateUserProfile = useCallback((updatedFields: Partial<User>) => {
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

    // Synchronize to backend database
    api.updateEmployeeProfile(currentDevId, updatedFields, currentDevId, currentRole).catch((err) => {
      console.warn('Backend sync failed for updateEmployeeProfile:', err)
    })

    showToast('Profile updated successfully', 'success')
  }, [currentDevId, currentRole, showToast])

  // Handler: Add Project Deliverable Submission
  const handleAddSubmission = useCallback((submission: Report) => {
    setData((prev) => ({
      ...prev,
      reports: [submission, ...prev.reports],
    }))
    showToast('Project deliverable submitted for PM review', 'success')
  }, [showToast])

  // Handler: Add Complaint / Escalation
  const handleAddComplaint = useCallback((complaint: Report) => {
    setData((prev) => ({
      ...prev,
      reports: [complaint, ...prev.reports],
    }))
    showToast('Grievance report submitted to management', 'success')
  }, [showToast])

  // Handler: Notifications
  const handleMarkNotificationRead = useCallback((notificationId: string) => {
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
  const handleCreateTask = useCallback((taskData: {
    title: string
    description?: string
    projectId: string
    assigneeId: string
    priority?: TaskPriority
    dueDate?: string
    estimatedHours?: number | string
    tags?: string[]
    checklist?: TaskChecklistItem[]
  }): Task => {
    const newTask: Task = {
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
    const newActivity: ActivityLog = {
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

    // Synchronize to backend database
    api.createTask({
      title: taskData.title,
      description: taskData.description,
      projectId: taskData.projectId,
      assigneeId: taskData.assigneeId,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      estimatedHours: Number(taskData.estimatedHours) || 8,
      tags: taskData.tags,
    }, currentPmId, 'pm').catch((err) => console.warn('Backend sync failed for createTask:', err))

    showToast(`Task "${newTask.title}" created successfully`, 'success')
    return newTask
  }, [currentPmId, resolvers, showToast])

  // PM Handler: Approve Task & Mark Completed
  const handleApproveTask = useCallback((taskId: string, feedback?: string) => {
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

      const newActivity: ActivityLog = {
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

    // Synchronize to backend database
    api.approveTask(taskId, { feedback }, currentPmId, 'pm').catch((err) => {
      console.warn('Backend sync failed for approveTask:', err)
    })

    showToast('Task approved and marked as Completed', 'success')
  }, [currentPmId, showToast])

  // PM Handler: Reject Task & Return to In Progress
  const handleRejectTask = useCallback((taskId: string, feedback: string) => {
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

      const newActivity: ActivityLog = {
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

    // Synchronize to backend database
    api.rejectTask(taskId, feedback, currentPmId, 'pm').catch((err) => {
      console.warn('Backend sync failed for rejectTask:', err)
    })

    showToast('Task returned to In Progress with feedback', 'info')
  }, [currentPmId, showToast])

  // PM Handler: Reassign Task
  const handleReassignTask = useCallback((taskId: string, newAssigneeId: string) => {
    setData((prev) => {
      const taskIndex = prev.tasks.findIndex((t) => t.id === taskId)
      if (taskIndex === -1) return prev

      const oldTask = prev.tasks[taskIndex]
      const updatedTasks = [...prev.tasks]
      updatedTasks[taskIndex] = { ...oldTask, assigneeId: newAssigneeId }

      const newAssignee = resolvers.getUser(newAssigneeId)
      const newActivity: ActivityLog = {
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

    // Synchronize to backend database
    api.reassignTask(taskId, newAssigneeId, currentPmId, 'pm').catch((err) => {
      console.warn('Backend sync failed for reassignTask:', err)
    })

    const devName = resolvers.getUser(newAssigneeId)?.name || 'developer'
    showToast(`Task reassigned to ${devName}`, 'success')
  }, [currentPmId, resolvers, showToast])

  // PM Handler: Allocate Budget to Developer with Budget Validation & Wallet Credit
  const handleAllocateBudget = useCallback((allocation: {
    developerId: string
    projectId: string
    amount: number | string
    description?: string
    week?: number | string
  }) => {
    const allocAmount = Number(allocation.amount)
    if (isNaN(allocAmount) || allocAmount <= 0) {
      showToast('Please enter a valid positive allocation amount', 'error')
      return false
    }

    const project = data.projects.find((p) => p.id === allocation.projectId)
    if (!project) {
      showToast('Target project not found for budget allocation', 'error')
      return false
    }

    // Calculate current allocations for this project
    const currentAllocated = data.transactions
      .filter((t) => t.projectId === allocation.projectId && t.type === 'budget_allocation')
      .reduce((acc, t) => acc + (t.amount || 0), 0)

    const remainingBudget = project.budget - currentAllocated

    if (allocAmount > remainingBudget) {
      showToast(
        `Allocation rejected: Project has $${remainingBudget.toLocaleString()} remaining ($${allocAmount.toLocaleString()} requested)`,
        'error'
      )
      return false
    }

    const newTx: any = {
      id: `alloc_${Date.now()}`,
      userId: allocation.developerId,
      projectId: allocation.projectId,
      amount: allocAmount,
      type: 'budget_allocation',
      description: allocation.description || `Week ${allocation.week || 3} sprint allocation`,
      date: new Date().toISOString().split('T')[0],
      status: 'allocated',
    }

    setData((prev) => {
      // 1. Update Project allocatedBudget
      const updatedProjects = prev.projects.map((p) => {
        if (p.id === allocation.projectId) {
          const currentAlloc = p.allocatedBudget || 0
          return {
            ...p,
            allocatedBudget: currentAlloc + allocAmount,
          }
        }
        return p
      })

      // 2. Update Developer's Wallet
      const walletIdx = prev.wallets.findIndex((w) => w.userId === allocation.developerId)
      let updatedWallets = [...prev.wallets]
      if (walletIdx >= 0) {
        const oldW = prev.wallets[walletIdx]
        updatedWallets[walletIdx] = {
          ...oldW,
          balance: oldW.balance + allocAmount,
          totalEarnedToDate: (oldW.totalEarnedToDate || 0) + allocAmount,
        }
      } else {
        updatedWallets.push({
          userId: allocation.developerId,
          balance: allocAmount,
          currency: 'USD',
          pendingEscrow: 0,
          totalEarnedToDate: allocAmount,
        })
      }

      // 3. Update Treasury totalDistributedToDevs
      const updatedTreasury = {
        ...prev.treasury,
        totalDistributedToDevs: (prev.treasury?.totalDistributedToDevs || 0) + allocAmount,
      }

      // 4. Create Activity & Audit Log
      const dev = prev.users.find((u) => u.id === allocation.developerId)
      const newActivity: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: currentPmId,
        action: 'budget_allocated',
        actionCode: 'BUDGET_DISBURSED',
        severity: 'INFO',
        actorName: currentUser?.name || 'Project Manager',
        actorEmail: currentUser?.email || 'pm@pointfex.internal',
        actorRole: 'PM',
        entityType: 'project',
        entityId: allocation.projectId,
        entityTitle: project.name,
        description: `Disbursed $${allocAmount.toLocaleString()} to ${dev?.name || 'developer'} for ${project.name}`,
        timestamp: 'Just now',
        category: 'finance',
        badgeColor: 'emerald',
      }

      return {
        ...prev,
        projects: updatedProjects,
        wallets: updatedWallets,
        treasury: updatedTreasury,
        transactions: [newTx, ...prev.transactions],
        activityLogs: [newActivity, ...prev.activityLogs],
      }
    })

    // Synchronize to backend database
    api.allocateDeveloperBudget({
      projectId: allocation.projectId,
      employeeId: allocation.developerId,
      amount: allocAmount,
      description: allocation.description || 'Sprint developer budget allocation',
    }, currentPmId, 'pm').catch((err) => {
      console.warn('Backend sync failed for allocateDeveloperBudget:', err)
    })

    const devName = resolvers.getUser(allocation.developerId)?.name || 'developer'
    showToast(`Successfully allocated $${allocAmount.toLocaleString()} to ${devName}`, 'success')
    return true
  }, [currentPmId, currentUser, data.projects, data.transactions, resolvers, showToast])

  // PM Handler: Request Budget Increase from CFO
  const handleRequestBudgetIncrease = useCallback((req: {
    projectId: string
    amount: number | string
    reason: string
  }) => {
    // Synchronize to backend database
    api.requestBudget({
      projectId: req.projectId,
      requestedAmount: Number(req.amount) || 0,
      justification: req.reason,
    }, currentPmId, 'pm').catch((err) => {
      console.warn('Backend sync failed for requestBudget:', err)
    })

    const project = resolvers.getProject(req.projectId)
    const newReport: Report = {
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
  const handleSubmitPmReport = useCallback((report: {
    category: string
    recipient: string
    title: string
    description: string
    projectId?: string
    docsUrl?: string
  }) => {
    const newReport: Report = {
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
  const handleUpdatePmTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
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

  // PM Handler: Forward Developer Submission to C-Level
  const handleForwardSubmissionToCLevel = useCallback((submissionId: string, recipient: string, endorsement: string) => {
    setData((prev) => {
      const idx = prev.reports.findIndex((r) => r.id === submissionId)
      if (idx === -1) return prev

      const old = prev.reports[idx]
      const updatedReports = [...prev.reports]
      updatedReports[idx] = {
        ...old,
        status: 'forwarded_to_c_level',
        forwardedTo: recipient,
        forwardedBy: currentPmId,
        forwardedAt: new Date().toISOString(),
        pmEndorsement: endorsement,
        feedback: `Forwarded to ${recipient} with PM endorsement: "${endorsement}"`,
      }

      return {
        ...prev,
        reports: updatedReports,
      }
    })
    showToast(`Project idea forwarded to ${recipient}`, 'success')
  }, [currentPmId, showToast])

  // PM Handler: Add Project Milestone
  const handleAddProjectMilestone = useCallback((projectId: string, milestoneData: {
    title: string
    dueDate?: string
    status?: string
  }) => {
    setData((prev) => {
      const projIndex = prev.projects.findIndex((p) => p.id === projectId)
      if (projIndex === -1) return prev

      const project = prev.projects[projIndex]
      const newMilestone: ProjectMilestone = {
        id: `ms_${Date.now()}`,
        title: milestoneData.title,
        dueDate: milestoneData.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        status: milestoneData.status || 'pending',
      }

      const updatedProjects = [...prev.projects]
      updatedProjects[projIndex] = {
        ...project,
        milestones: [...(project.milestones || []), newMilestone],
      }

      return {
        ...prev,
        projects: updatedProjects,
      }
    })
    showToast('New milestone added to project', 'success')
  }, [showToast])

  // PM Handler: Update Milestone Status
  const handleUpdateMilestoneStatus = useCallback((projectId: string, milestoneId: string, newStatus: string) => {
    setData((prev) => {
      const projIndex = prev.projects.findIndex((p) => p.id === projectId)
      if (projIndex === -1) return prev

      const project = prev.projects[projIndex]
      const updatedMilestones = (project.milestones || []).map((ms) =>
        ms.id === milestoneId ? { ...ms, status: newStatus } : ms
      )

      const updatedProjects = [...prev.projects]
      updatedProjects[projIndex] = {
        ...project,
        milestones: updatedMilestones,
      }

      return {
        ...prev,
        projects: updatedProjects,
      }
    })
    showToast(`Milestone status updated to "${newStatus.replace('_', ' ')}"`, 'success')
  }, [showToast])

  // PM Handler: Update Complaint Status & Response
  const handleUpdateComplaintStatus = useCallback((complaintId: string, newStatus: string, pmComment?: string) => {
    setData((prev) => {
      const idx = prev.reports.findIndex((r) => r.id === complaintId)
      if (idx === -1) return prev

      const old = prev.reports[idx]
      const updatedReports = [...prev.reports]
      updatedReports[idx] = {
        ...old,
        status: newStatus as any,
        feedback: pmComment ? `[PM Response]: ${pmComment}` : old.feedback,
      }

      return {
        ...prev,
        reports: updatedReports,
      }
    })
    showToast(`Complaint updated to "${newStatus.replace('_', ' ')}"`, 'success')
  }, [showToast])

  // PM Handler: Update PM Profile (Skills, etc.)
  const handleUpdatePmProfile = useCallback((updatedFields: Partial<User>) => {
    setData((prev) => {
      const userIndex = prev.users.findIndex((u) => u.id === currentPmId)
      if (userIndex === -1) return prev

      const updatedUsers = [...prev.users]
      updatedUsers[userIndex] = { ...updatedUsers[userIndex], ...updatedFields }

      return {
        ...prev,
        users: updatedUsers,
      }
    })
    showToast('PM profile updated successfully', 'success')
  }, [currentPmId, showToast])

  // --- CTO WORKSPACE HANDLERS ---
  const handleCreateCtoEngineeringTask = useCallback((taskData: {
    title: string
    description?: string
    projectId: string
    pmId: string
    priority?: TaskPriority
    dueDate?: string
    estimatedHours?: number | string
    tags?: string[]
  }): Task => {
    const newTask: Task = {
      id: `task_cto_${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      projectId: taskData.projectId,
      assigneeId: taskData.pmId,
      creatorId: 'user_cto_01',
      status: 'todo',
      priority: taskData.priority || 'high',
      dueDate: taskData.dueDate || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      estimatedHours: Number(taskData.estimatedHours) || 8,
      loggedHours: 0,
      tags: taskData.tags || ['Engineering Task', 'CTO Mandate'],
      createdAt: new Date().toISOString().split('T')[0],
    }

    const newActivity: ActivityLog = {
      id: `act_${Date.now()}`,
      userId: 'user_cto_01',
      action: 'task_created',
      entityType: 'task',
      entityId: newTask.id,
      entityTitle: newTask.title,
      description: `CTO Arthur Sterling assigned engineering task to PM (${taskData.pmId})`,
      timestamp: 'Just now',
      category: 'task',
      badgeColor: 'purple',
    }

    setData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
      activityLogs: [newActivity, ...prev.activityLogs],
    }))

    showToast(`Engineering task created and assigned to PM`, 'success')
    return newTask
  }, [showToast])

  const handleReviewCtoTaskSubmission = useCallback((taskId: string, approved: boolean, feedback?: string) => {
    setData((prev) => {
      const idx = prev.tasks.findIndex((t) => t.id === taskId)
      if (idx === -1) return prev

      const oldTask = prev.tasks[idx]
      const updatedTasks = [...prev.tasks]
      updatedTasks[idx] = {
        ...oldTask,
        status: approved ? 'completed' : 'in_progress',
      }

      const newActivity: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: 'user_cto_01',
        action: approved ? 'task_approved' : 'task_revision_requested',
        entityType: 'task',
        entityId: taskId,
        entityTitle: oldTask.title,
        description: approved
          ? `CTO Arthur Sterling verified deliverable and approved task: "${feedback}"`
          : `CTO Arthur Sterling requested revisions: "${feedback}"`,
        timestamp: 'Just now',
        category: 'task',
        badgeColor: approved ? 'emerald' : 'amber',
      }

      return {
        ...prev,
        tasks: updatedTasks,
        activityLogs: [newActivity, ...prev.activityLogs],
      }
    })

    showToast(
      approved ? 'Deliverable approved & completed by CTO' : 'Revisions requested from PM',
      approved ? 'success' : 'info'
    )
  }, [showToast])

  const handleUpdateCtoPersonalTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => {
    setData((prev) => {
      const idx = prev.tasks.findIndex((t) => t.id === taskId)
      if (idx === -1) return prev

      const oldTask = prev.tasks[idx]
      const updatedTasks = [...prev.tasks]
      updatedTasks[idx] = { ...oldTask, status: newStatus }

      const newActivity: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: 'user_cto_01',
        action: 'status_change',
        entityType: 'task',
        entityId: taskId,
        entityTitle: oldTask.title,
        description: `CTO updated operational initiative status to ${newStatus.replace('_', ' ')}`,
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

    showToast(`Task moved to ${newStatus.replace('_', ' ')}`, 'info')
  }, [showToast])

  const handleCreateCtoPersonalTask = useCallback((taskData: {
    title: string
    description?: string
    priority?: TaskPriority
    dueDate?: string
    tags?: string[]
    projectId?: string
  }) => {
    const actorId = currentUser?.id || 'user_cto_01'
    const newTask: Task = {
      id: `task_${currentRole}_${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      projectId: taskData.projectId || 'proj_01',
      assigneeId: actorId,
      assignedTo: actorId,
      creatorId: actorId,
      status: 'todo',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      estimatedHours: 8,
      loggedHours: 0,
      tags: taskData.tags || ['Personal', 'Executive'],
      createdAt: new Date().toISOString(),
    }

    setData((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
      activityLogs: [
        {
          id: `act_${Date.now()}`,
          userId: 'user_cto_01',
          action: 'task_created',
          entityType: 'task',
          entityId: newTask.id,
          entityTitle: newTask.title,
          description: `CTO Arthur Sterling created personal task "${newTask.title}"`,
          timestamp: 'Just now',
          category: 'task',
          badgeColor: 'sky',
        },
        ...prev.activityLogs,
      ],
    }))

    showToast('Personal task added to board', 'success')
    return newTask
  }, [currentUser?.id, currentRole, showToast])

  const handleCreateProject = useCallback((projectData: {
    name: string
    code: string
    teamId?: string
    budget?: number
    deadline?: string
    description?: string
    repositoryUrl?: string
    srsUrl?: string
    tags?: string[]
  }) => {
    const newId = `proj_${Date.now()}`
    const repoId = `repo_${Date.now()}`
    const newProject: Project = {
      id: newId,
      name: projectData.name,
      code: projectData.code,
      teamId: projectData.teamId || 'team_01',
      pmId: 'user_pm_01',
      leadDevId: 'user_dev_01',
      repoId,
      progress: 0,
      health: 'on_track',
      totalWeeks: 5,
      currentWeek: 3,
      assignedDevIds: [],
      budget: projectData.budget || 35000,
      startDate: new Date().toISOString().split('T')[0],
      deadline: projectData.deadline || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      status: 'active',
      tags: projectData.tags || ['React', 'TypeScript'],
      description: projectData.description || 'New strategic engineering project',
      repositoryUrl: projectData.repositoryUrl || `https://github.com/pointfex/${projectData.code.toLowerCase()}`,
      srs: projectData.srsUrl ? {
        documentTitle: `${projectData.code}-SRS-v1.0.pdf`,
        documentUrl: projectData.srsUrl,
        version: 'v1.0 Draft',
        lastUpdated: new Date().toISOString().split('T')[0],
        overview: projectData.description || 'Software Requirements Specification',
        requirementsCount: 10,
        approvedBy: 'Dr. Arthur Sterling',
      } : undefined,
    }

    const newRepo: Repository = {
      id: repoId,
      projectId: newId,
      name: projectData.code.toLowerCase(),
      url: projectData.repositoryUrl || `https://github.com/pointfex/${projectData.code.toLowerCase()}`,
      defaultBranch: 'main',
      activeBranch: 'main',
      openPRsCount: 0,
      lastCommit: {
        hash: 'b1c2d3e',
        message: 'Initial project repository configuration',
        author: 'Dr. Arthur Sterling',
        timestamp: 'Just now',
        date: 'Just now',
      },
      stars: 0,
      forks: 0,
      openIssues: 0,
    }

    setData((prev) => ({
      ...prev,
      projects: [newProject, ...prev.projects],
      repositories: [newRepo, ...prev.repositories],
      activityLogs: [
        {
          id: `act_${Date.now()}`,
          userId: 'user_cto_01',
          action: 'project_created',
          entityType: 'project',
          entityId: newId,
          entityTitle: newProject.name,
          description: `CTO Arthur Sterling created project ${newProject.code} — ${newProject.name}`,
          timestamp: 'Just now',
          category: 'project',
          badgeColor: 'lime',
        },
        ...prev.activityLogs,
      ],
    }))

    // Synchronize to backend database
    api.createProject({
      name: projectData.name,
      code: projectData.code,
      description: projectData.description || '',
      budgetAllocated: projectData.budget,
      techStack: projectData.tags,
      teamId: projectData.teamId,
      repositoryUrl: projectData.repositoryUrl,
      srsDocUrl: projectData.srsUrl,
    }, currentUser?.id || 'emp_cto_01', 'cto').catch((err) => {
      console.warn('Backend sync failed for createProject:', err)
    })

    showToast(`Project ${newProject.code} created successfully`, 'success')
    return newProject
  }, [currentUser, showToast])

  const handleUpdateProject = useCallback((projectId: string, updates: Partial<Project> & { repositoryUrl?: string; srsUrl?: string }) => {
    setData((prev) => {
      const idx = prev.projects.findIndex((p) => p.id === projectId)
      if (idx === -1) return prev

      const oldProj = prev.projects[idx]
      const updatedProjects = [...prev.projects]
      updatedProjects[idx] = {
        ...oldProj,
        ...updates,
        srs: updates.srsUrl ? {
          documentTitle: oldProj.srs?.documentTitle || `${oldProj.code}-SRS-v1.0.pdf`,
          documentUrl: updates.srsUrl,
          version: oldProj.srs?.version || 'v1.0',
          lastUpdated: new Date().toISOString().split('T')[0],
          overview: oldProj.srs?.overview || oldProj.description || 'Software Requirements Specification',
          requirementsCount: oldProj.srs?.requirementsCount || 10,
          approvedBy: 'Dr. Arthur Sterling',
        } : oldProj.srs,
      }

      let updatedRepos = prev.repositories
      if (updates.repositoryUrl) {
        updatedRepos = prev.repositories.map((r) =>
          r.projectId === projectId ? { ...r, url: updates.repositoryUrl! } : r
        )
      }

      const newActivity: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: 'user_cto_01',
        action: 'project_updated',
        entityType: 'project',
        entityId: projectId,
        entityTitle: updatedProjects[idx].name,
        description: `CTO Arthur Sterling modified project details for ${oldProj.code}`,
        timestamp: 'Just now',
        category: 'project',
        badgeColor: 'sky',
      }

      return {
        ...prev,
        projects: updatedProjects,
        repositories: updatedRepos,
        activityLogs: [newActivity, ...prev.activityLogs],
      }
    })

    showToast('Project updated successfully', 'success')
  }, [showToast])

  const handleUpdateUser = useCallback((userId: string, updates: Partial<User>) => {
    setData((prev) => {
      const idx = prev.users.findIndex((u) => u.id === userId)
      if (idx === -1) return prev

      const oldUser = prev.users[idx]
      const updatedUsers = [...prev.users]
      updatedUsers[idx] = { ...oldUser, ...updates }

      let updatedTeams = prev.teams
      if (updates.teamId !== undefined && updates.teamId !== oldUser.teamId) {
        updatedTeams = prev.teams.map((t) => {
          let memberIds = t.memberIds.filter((id) => id !== userId)
          let pmId = t.pmId === userId ? '' : t.pmId
          if (t.id === updates.teamId) {
            if (updates.role === 'pm') {
              pmId = userId
            } else {
              memberIds = [...memberIds, userId]
            }
          }
          return { ...t, memberIds, pmId }
        })
      }

      const newActivity: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: 'user_cto_01',
        action: 'user_updated',
        entityType: 'user',
        entityId: userId,
        entityTitle: oldUser.name,
        description: `CTO Arthur Sterling updated role/team for ${oldUser.name}`,
        timestamp: 'Just now',
        category: 'user',
        badgeColor: 'purple',
      }

      return {
        ...prev,
        users: updatedUsers,
        teams: updatedTeams,
        activityLogs: [newActivity, ...prev.activityLogs],
      }
    })

    showToast('Member profile updated', 'success')
  }, [showToast])

  const handleCreateTeam = useCallback((teamData: {
    name: string
    code: string
    focus: string
    pmId?: string
    leadDevId?: string
    memberIds?: string[]
    projectIds?: string[]
    weeklyVelocity?: number
  }) => {
    const newId = `team_${Date.now()}`
    const newTeam: Team = {
      id: newId,
      name: teamData.name,
      code: teamData.code,
      focus: teamData.focus,
      pmId: teamData.pmId || '',
      leadDevId: teamData.leadDevId || '',
      memberIds: teamData.memberIds || [],
      projectIds: teamData.projectIds || [],
      weeklyVelocity: teamData.weeklyVelocity || 40,
    }

    setData((prev) => ({
      ...prev,
      teams: [...prev.teams, newTeam],
      activityLogs: [
        {
          id: `act_${Date.now()}`,
          userId: 'user_cto_01',
          action: 'team_created',
          entityType: 'team',
          entityId: newId,
          entityTitle: newTeam.name,
          description: `CTO Arthur Sterling created squad ${newTeam.name} (${newTeam.code})`,
          timestamp: 'Just now',
          category: 'team',
          badgeColor: 'emerald',
        },
        ...prev.activityLogs,
      ],
    }))

    showToast(`Squad ${newTeam.name} created`, 'success')
    return newTeam
  }, [showToast])

  const handleUpdateTeam = useCallback((teamId: string, updates: Partial<Team>) => {
    setData((prev) => {
      const idx = prev.teams.findIndex((t) => t.id === teamId)
      if (idx === -1) return prev

      const oldTeam = prev.teams[idx]
      const updatedTeams = [...prev.teams]
      updatedTeams[idx] = { ...oldTeam, ...updates }

      const newActivity: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: 'user_cto_01',
        action: 'team_updated',
        entityType: 'team',
        entityId: teamId,
        entityTitle: updatedTeams[idx].name,
        description: `CTO Arthur Sterling updated squad ${oldTeam.name}`,
        timestamp: 'Just now',
        category: 'team',
        badgeColor: 'indigo',
      }

      return {
        ...prev,
        teams: updatedTeams,
        activityLogs: [newActivity, ...prev.activityLogs],
      }
    })

    showToast('Squad updated successfully', 'success')
  }, [showToast])

  const handleReviewProjectIdea = useCallback((ideaId: string, status: string, feedback?: string) => {
    setData((prev) => {
      const idx = prev.reports.findIndex((r) => r.id === ideaId)
      if (idx === -1) return prev

      const old = prev.reports[idx]
      const updatedReports = [...prev.reports]
      updatedReports[idx] = {
        ...old,
        status: status as any,
        feedback: feedback ? `[CTO Review]: ${feedback}` : old.feedback,
      }

      const newActivity: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: 'user_cto_01',
        action: 'idea_reviewed',
        entityType: 'report',
        entityId: ideaId,
        entityTitle: old.title,
        description: `CTO Arthur Sterling reviewed project idea "${old.title}": ${status}`,
        timestamp: 'Just now',
        category: 'report',
        badgeColor: status === 'approved' ? 'emerald' : 'amber',
      }

      return {
        ...prev,
        reports: updatedReports,
        activityLogs: [newActivity, ...prev.activityLogs],
      }
    })

    showToast(`Project idea status set to "${status.replace('_', ' ')}"`, 'success')
  }, [showToast])

  const handleUpdateComplaintStatusGeneral = useCallback((complaintId: string, status: string, feedback?: string) => {
    setData((prev) => {
      const idx = prev.reports.findIndex((r) => r.id === complaintId)
      if (idx === -1) return prev

      const old = prev.reports[idx]
      const updatedReports = [...prev.reports]
      updatedReports[idx] = {
        ...old,
        status: status as any,
        feedback: feedback ? `[CTO Note]: ${feedback}` : old.feedback,
      }

      const newActivity: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: 'user_cto_01',
        action: 'complaint_updated',
        entityType: 'report',
        entityId: complaintId,
        entityTitle: old.title,
        description: `CTO Arthur Sterling updated complaint: ${status}`,
        timestamp: 'Just now',
        category: 'report',
        badgeColor: 'purple',
      }

      return {
        ...prev,
        reports: updatedReports,
        activityLogs: [newActivity, ...prev.activityLogs],
      }
    })

    showToast(`Complaint updated to "${status.replace('_', ' ')}"`, 'success')
  }, [showToast])

  const handleUpdateRepoConfig = useCallback((projectId: string, updates: {
    repositoryUrl?: string
    defaultBranch?: string
    tags?: string[]
    srsUrl?: string
  }) => {
    setData((prev) => {
      // Update repository
      const repoIdx = prev.repositories.findIndex((r) => r.projectId === projectId)
      const updatedRepos = [...prev.repositories]
      if (repoIdx !== -1) {
        updatedRepos[repoIdx] = {
          ...updatedRepos[repoIdx],
          url: updates.repositoryUrl || updatedRepos[repoIdx].url,
          defaultBranch: updates.defaultBranch || updatedRepos[repoIdx].defaultBranch,
        }
      }

      // Update project tags & srs
      const projIdx = prev.projects.findIndex((p) => p.id === projectId)
      const updatedProjects = [...prev.projects]
      if (projIdx !== -1) {
        const oldP = updatedProjects[projIdx]
        updatedProjects[projIdx] = {
          ...oldP,
          repositoryUrl: updates.repositoryUrl || oldP.repositoryUrl,
          tags: updates.tags || oldP.tags,
          srs: updates.srsUrl && oldP.srs ? { ...oldP.srs, documentUrl: updates.srsUrl } : oldP.srs,
        }
      }

      const newActivity: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: 'user_cto_01',
        action: 'repo_updated',
        entityType: 'repository',
        entityId: projectId,
        entityTitle: updatedProjects[projIdx]?.name || 'Project Repository',
        description: `CTO Arthur Sterling updated technical repository and architecture configuration`,
        timestamp: 'Just now',
        category: 'git',
        badgeColor: 'indigo',
      }

      return {
        ...prev,
        repositories: updatedRepos,
        projects: updatedProjects,
        activityLogs: [newActivity, ...prev.activityLogs],
      }
    })

    showToast('Technical configuration and repository details updated', 'success')
  }, [showToast])

  const handleReviewPullRequest = useCallback((prId: string, newStatus: 'approved' | 'merged' | 'changes_requested') => {
    setData((prev) => {
      const idx = prev.pullRequests.findIndex((pr) => pr.id === prId)
      if (idx === -1) return prev

      const oldPr = prev.pullRequests[idx]
      const updatedPrs = [...prev.pullRequests]
      updatedPrs[idx] = { ...oldPr, status: newStatus }

      const newActivity: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: 'user_cto_01',
        action: `pr_${newStatus}`,
        entityType: 'pull_request',
        entityId: prId,
        entityTitle: oldPr.title,
        description: `CTO Arthur Sterling set PR #${prId} status to ${newStatus.replace('_', ' ')}`,
        timestamp: 'Just now',
        category: 'git',
        badgeColor: newStatus === 'merged' ? 'purple' : newStatus === 'approved' ? 'emerald' : 'amber',
      }

      return {
        ...prev,
        pullRequests: updatedPrs,
        activityLogs: [newActivity, ...prev.activityLogs],
      }
    })

    showToast(`Pull request ${newStatus.replace('_', ' ')}`, 'success')
  }, [showToast])

  const handleCreateSecurityIssue = useCallback((issue: {
    title: string
    projectId: string
    severity: 'critical' | 'high' | 'medium' | 'low'
    category: 'dependency' | 'auth' | 'injection' | 'encryption' | 'infrastructure'
    assignedPmId?: string
    description: string
    recommendation: string
    cveOrPackage?: string
  }) => {
    const newAlert: any = {
      id: `sec_${Date.now()}`,
      title: issue.title,
      projectId: issue.projectId,
      severity: issue.severity,
      category: issue.category,
      status: 'open',
      detectedAt: new Date().toISOString(),
      assignedPmId: issue.assignedPmId,
      cveOrPackage: issue.cveOrPackage || 'Manual Security Finding',
      description: issue.description,
      recommendation: issue.recommendation,
    }

    const newActivity: ActivityLog = {
      id: `act_${Date.now()}`,
      userId: 'user_cto_01',
      action: 'security_alert_logged',
      entityType: 'security',
      entityId: newAlert.id,
      entityTitle: newAlert.title,
      description: `CTO logged ${issue.severity.toUpperCase()} security alert on project ${issue.projectId}`,
      timestamp: 'Just now',
      category: 'git',
      badgeColor: 'rose',
    }

    setData((prev) => ({
      ...prev,
      securityAlerts: [newAlert, ...prev.securityAlerts],
      activityLogs: [newActivity, ...prev.activityLogs],
    }))

    showToast(`Security issue logged and escalated to squad PM`, 'success')
  }, [showToast])

  const handleUpdateSecurityIssueStatus = useCallback((issueId: string, newStatus: 'open' | 'investigating' | 'patch_in_progress' | 'resolved') => {
    setData((prev) => {
      const idx = prev.securityAlerts.findIndex((s) => s.id === issueId)
      if (idx === -1) return prev

      const oldAlert = prev.securityAlerts[idx]
      const updatedAlerts = [...prev.securityAlerts]
      updatedAlerts[idx] = {
        ...oldAlert,
        status: newStatus,
        resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : oldAlert.resolvedAt,
      }

      return {
        ...prev,
        securityAlerts: updatedAlerts,
      }
    })

    showToast(`Security issue status set to ${newStatus.replace('_', ' ')}`, 'info')
  }, [showToast])

  const handleUpdateConsultancyStatus = useCallback((requestId: string, updates: {
    status: 'submitted' | 'under_review' | 'accepted' | 'assigned' | 'in_progress' | 'completed' | 'rejected'
    assignedConsultantName?: string
    feeUSD?: number
    targetDate?: string
    ctoNotes?: string
  }) => {
    setData((prev) => {
      const idx = prev.consultancyRequests.findIndex((c) => c.id === requestId)
      if (idx === -1) return prev

      const oldReq = prev.consultancyRequests[idx]
      const updatedReqs = [...prev.consultancyRequests]
      updatedReqs[idx] = {
        ...oldReq,
        ...updates,
        completedAt: updates.status === 'completed' ? new Date().toISOString() : oldReq.completedAt,
      }

      const newActivity: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: 'user_cto_01',
        action: 'consultancy_status_updated',
        entityType: 'consultancy',
        entityId: requestId,
        entityTitle: oldReq.title,
        description: `CTO updated consultancy request status to ${updates.status}`,
        timestamp: 'Just now',
        category: 'task',
        badgeColor: 'purple',
      }

      return {
        ...prev,
        consultancyRequests: updatedReqs,
        activityLogs: [newActivity, ...prev.activityLogs],
      }
    })

    showToast(`Consultancy request updated to "${updates.status}"`, 'success')
  }, [showToast])

  const handleSubmitCtoReport = useCallback((report: {
    category: string
    recipient: string
    title: string
    description: string
    projectId?: string
    docsUrl?: string
  }) => {
    const newReport: Report = {
      id: `rep_cto_${Date.now()}`,
      userId: 'user_cto_01',
      type: 'cto_report',
      category: report.category,
      recipient: report.recipient,
      title: report.title,
      description: report.description,
      projectId: report.projectId,
      docsUrl: report.docsUrl || '',
      date: new Date().toISOString().split('T')[0],
      status: 'under_review',
      submittedAt: new Date().toISOString(),
    }

    const newActivity: ActivityLog = {
      id: `act_${Date.now()}`,
      userId: 'user_cto_01',
      action: 'report_submitted',
      entityType: 'report',
      entityId: newReport.id,
      entityTitle: newReport.title,
      description: `CTO submitted ${report.category} to ${report.recipient}`,
      timestamp: 'Just now',
      category: 'comment',
      badgeColor: 'indigo',
    }

    setData((prev) => ({
      ...prev,
      reports: [newReport, ...prev.reports],
      activityLogs: [newActivity, ...prev.activityLogs],
    }))

    showToast(`Executive engineering report submitted to ${report.recipient}`, 'success')
  }, [showToast])

  const handleUpdateIncomingReportStatus = useCallback((reportId: string, newStatus: string, feedback?: string, forwardTo?: string) => {
    setData((prev) => {
      const idx = prev.reports.findIndex((r) => r.id === reportId)
      if (idx === -1) return prev

      const oldRep = prev.reports[idx]
      const updatedReports = [...prev.reports]
      updatedReports[idx] = {
        ...oldRep,
        status: newStatus as any,
        feedback: feedback ? `[CTO Note]: ${feedback}` : oldRep.feedback,
        forwardedTo: forwardTo || oldRep.forwardedTo,
        forwardedBy: forwardTo ? 'Dr. Arthur Sterling (CTO)' : oldRep.forwardedBy,
        forwardedAt: forwardTo ? new Date().toISOString() : oldRep.forwardedAt,
      }

      return {
        ...prev,
        reports: updatedReports,
      }
    })

    showToast(`Report updated: "${newStatus.replace('_', ' ')}"`, 'success')
  }, [showToast])

  const handleUpdateCtoProfile = useCallback((updatedFields: Partial<User>) => {
    setData((prev) => {
      const idx = prev.users.findIndex((u) => u.id === 'user_cto_01')
      if (idx === -1) return prev

      const updatedUsers = [...prev.users]
      updatedUsers[idx] = { ...updatedUsers[idx], ...updatedFields }

      return {
        ...prev,
        users: updatedUsers,
      }
    })

    showToast('CTO profile updated successfully', 'success')
  }, [showToast])

  // CFO Financial State Handlers
  const handleAllocateProjectBudget = useCallback((projectId: string, newBudget: number, reason?: string) => {
    if (newBudget <= 0) {
      showToast('Project budget must be greater than $0', 'error')
      return
    }

    const project = data.projects.find((p) => p.id === projectId)
    if (!project) {
      showToast('Project not found', 'error')
      return
    }

    const delta = newBudget - project.budget
    if (delta > 0 && delta > (data.treasury?.unallocatedReserves || 0)) {
      showToast(
        `Treasury reserves insufficient: Only $${(data.treasury?.unallocatedReserves || 0).toLocaleString()} unallocated reserves available`,
        'error'
      )
      return
    }

    setData((prev) => {
      const updatedProjects = prev.projects.map((p) => (p.id === projectId ? { ...p, budget: newBudget } : p))
      const updatedTreasury = {
        ...prev.treasury,
        totalApprovedBudgets: (prev.treasury?.totalApprovedBudgets || 0) + delta,
        unallocatedReserves: Math.max(0, (prev.treasury?.unallocatedReserves || 0) - delta),
      }

      const tx: any = {
        id: `tx_cfo_${Date.now()}`,
        userId: currentUser?.id || 'user_cfo_01',
        projectId,
        amount: delta,
        type: 'budget_allocation',
        description: reason || `CFO budget adjustment for ${project.name}`,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
      }

      const log: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: currentUser?.id || 'user_cfo_01',
        action: 'cfo_budget_reallocated',
        actionCode: 'CAPITAL_ALLOCATION_UPDATED',
        severity: 'INFO',
        actorName: currentUser?.name || 'Vincent Gallagher',
        actorEmail: currentUser?.email || 'cfo@pointfex.internal',
        actorRole: 'CFO',
        entityType: 'project',
        entityId: projectId,
        entityTitle: project.name,
        description: `Adjusted budget for ${project.name} to $${newBudget.toLocaleString()} (${delta >= 0 ? '+' : ''}$${delta.toLocaleString()})`,
        timestamp: 'Just now',
        category: 'finance',
        badgeColor: 'emerald',
      }

      return {
        ...prev,
        projects: updatedProjects,
        treasury: updatedTreasury,
        transactions: [tx, ...prev.transactions],
        activityLogs: [log, ...prev.activityLogs],
      }
    })

    showToast(`Updated ${project.name} budget pool to $${newBudget.toLocaleString()}`, 'success')
  }, [currentUser, data.projects, data.treasury, showToast])

  const handleApproveBudgetRequest = useCallback((reportId: string, approvedAmount: number, feedback?: string) => {
    const report = data.reports.find((r) => r.id === reportId)
    if (!report) {
      showToast('Budget request not found', 'error')
      return
    }

    if (approvedAmount > (data.treasury?.unallocatedReserves || 0)) {
      showToast(
        `Approval exceeds unallocated reserves ($${(data.treasury?.unallocatedReserves || 0).toLocaleString()} available)`,
        'error'
      )
      return
    }

    setData((prev) => {
      // 1. Update Project budget if report has projectId
      const updatedProjects = prev.projects.map((p) => {
        if (p.id === report.projectId) {
          return { ...p, budget: p.budget + approvedAmount }
        }
        return p
      })

      // 2. Update Treasury
      const updatedTreasury = {
        ...prev.treasury,
        totalApprovedBudgets: (prev.treasury?.totalApprovedBudgets || 0) + approvedAmount,
        unallocatedReserves: Math.max(0, (prev.treasury?.unallocatedReserves || 0) - approvedAmount),
      }

      // 3. Update Report status
      const updatedReports = prev.reports.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status: 'resolved' as const,
            feedback: feedback || `Approved by CFO in full: +$${approvedAmount.toLocaleString()} added to project budget.`,
            resolvedAt: new Date().toISOString(),
          }
        }
        return r
      })

      const log: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: currentUser?.id || 'user_cfo_01',
        action: 'budget_request_approved',
        actionCode: 'BUDGET_REQUEST_GRANTED',
        severity: 'SUCCESS',
        actorName: currentUser?.name || 'Vincent Gallagher',
        actorEmail: currentUser?.email || 'cfo@pointfex.internal',
        actorRole: 'CFO',
        entityType: 'report',
        entityId: reportId,
        entityTitle: report.title,
        description: `CFO approved +$${approvedAmount.toLocaleString()} budget increase request`,
        timestamp: 'Just now',
        category: 'finance',
        badgeColor: 'emerald',
      }

      return {
        ...prev,
        projects: updatedProjects,
        treasury: updatedTreasury,
        reports: updatedReports,
        activityLogs: [log, ...prev.activityLogs],
      }
    })

    showToast(`Approved +$${approvedAmount.toLocaleString()} budget increase`, 'success')
  }, [currentUser, data.reports, data.treasury, showToast])

  const handleRejectBudgetRequest = useCallback((reportId: string, feedback: string) => {
    setData((prev) => {
      const updatedReports = prev.reports.map((r) => {
        if (r.id === reportId) {
          return {
            ...r,
            status: 'dismissed' as const,
            feedback: feedback || 'Budget increase request rejected by CFO due to reserve constraints.',
            resolvedAt: new Date().toISOString(),
          }
        }
        return r
      })

      const log: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: currentUser?.id || 'user_cfo_01',
        action: 'budget_request_rejected',
        actionCode: 'BUDGET_REQUEST_DENIED',
        severity: 'WARNING',
        actorName: currentUser?.name || 'Vincent Gallagher',
        actorEmail: currentUser?.email || 'cfo@pointfex.internal',
        actorRole: 'CFO',
        entityType: 'report',
        entityId: reportId,
        description: `CFO dismissed budget request: "${feedback}"`,
        timestamp: 'Just now',
        category: 'finance',
        badgeColor: 'rose',
      }

      return {
        ...prev,
        reports: updatedReports,
        activityLogs: [log, ...prev.activityLogs],
      }
    })

    showToast('Budget request dismissed', 'info')
  }, [currentUser, showToast])

  const handleIssueFinancialAdjustment = useCallback((userId: string, amount: number, type: 'bonus' | 'penalty', reason: string) => {
    const targetUser = data.users.find((u) => u.id === userId)
    if (!targetUser) {
      showToast('Target employee not found', 'error')
      return
    }

    setData((prev) => {
      // Update wallet
      const walletIdx = prev.wallets.findIndex((w) => w.userId === userId)
      let updatedWallets = [...prev.wallets]
      if (walletIdx >= 0) {
        const oldW = prev.wallets[walletIdx]
        const newBalance = type === 'bonus' ? oldW.balance + amount : Math.max(0, oldW.balance - amount)
        const newEarned = type === 'bonus' ? (oldW.totalEarnedToDate || 0) + amount : (oldW.totalEarnedToDate || 0)
        updatedWallets[walletIdx] = {
          ...oldW,
          balance: newBalance,
          totalEarnedToDate: newEarned,
        }
      } else {
        updatedWallets.push({
          userId,
          balance: type === 'bonus' ? amount : 0,
          currency: 'USD',
          pendingEscrow: 0,
          totalEarnedToDate: type === 'bonus' ? amount : 0,
        })
      }

      // Update Treasury for bonuses
      let updatedTreasury = prev.treasury
      if (type === 'bonus') {
        updatedTreasury = {
          ...prev.treasury,
          totalDistributedToDevs: (prev.treasury?.totalDistributedToDevs || 0) + amount,
          unallocatedReserves: Math.max(0, (prev.treasury?.unallocatedReserves || 0) - amount),
        }
      }

      const tx: any = {
        id: `tx_adj_${Date.now()}`,
        userId,
        amount: type === 'bonus' ? amount : -amount,
        type: type === 'bonus' ? 'bonus' : 'deduction',
        description: reason,
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
      }

      const log: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: currentUser?.id || 'user_cfo_01',
        action: `financial_${type}`,
        actionCode: type === 'bonus' ? 'PERFORMANCE_BONUS_DISBURSED' : 'DISCIPLINARY_DEDUCTION_APPLIED',
        severity: type === 'bonus' ? 'SUCCESS' : 'WARNING',
        actorName: currentUser?.name || 'Leadership',
        actorEmail: currentUser?.email || 'leadership@pointfex.internal',
        actorRole: (currentRole || 'C-Suite').toUpperCase(),
        entityType: 'user',
        entityId: userId,
        entityTitle: targetUser.name,
        description: `${type.toUpperCase()}: $${amount.toLocaleString()} to ${targetUser.name} (${reason})`,
        timestamp: 'Just now',
        category: 'finance',
        badgeColor: type === 'bonus' ? 'emerald' : 'amber',
      }

      return {
        ...prev,
        wallets: updatedWallets,
        treasury: updatedTreasury,
        transactions: [tx, ...prev.transactions],
        activityLogs: [log, ...prev.activityLogs],
      }
    })

    showToast(`Issued $${amount.toLocaleString()} ${type} to ${targetUser.name}`, 'success')
  }, [currentUser, currentRole, data.users, showToast])

  // CHRO State Handlers
  const handleRecordPerformanceEvaluation = useCallback((userId: string, evaluation: {
    score: number
    tier: 'top_performer' | 'strong_contributor' | 'needs_support' | string
    notes: string
    strengths?: string[]
    improvementAreas?: string[]
  }) => {
    const targetUser = data.users.find((u) => u.id === userId)
    if (!targetUser) {
      showToast('Employee not found', 'error')
      return
    }

    setData((prev) => {
      const recordIdx = prev.performanceRecords.findIndex((r) => r.developerId === userId)
      let updatedRecords = [...prev.performanceRecords]
      const todayStr = new Date().toISOString().split('T')[0]

      if (recordIdx >= 0) {
        const oldR = prev.performanceRecords[recordIdx]
        updatedRecords[recordIdx] = {
          ...oldR,
          overallScore: evaluation.score,
          performanceTier: evaluation.tier as any,
          evaluationNotes: evaluation.notes,
          strengths: evaluation.strengths || oldR.strengths,
          improvements: evaluation.improvementAreas || oldR.improvements,
          lastEvaluationDate: todayStr,
        }
      } else {
        updatedRecords.push({
          userId,
          developerId: userId,
          overallScore: evaluation.score,
          deliverySpeed: 90,
          codeQuality: evaluation.score,
          reliability: 92,
          collaboration: 94,
          attendanceRate: 97,
          satisfactionIndex: 4.8,
          performanceTier: evaluation.tier as any,
          evaluationNotes: evaluation.notes,
          lastEvaluationDate: todayStr,
          strengths: evaluation.strengths || ['High velocity', 'Reliable execution'],
          improvements: evaluation.improvementAreas || ['Cross-team mentorship'],
          weeklyHours: [40, 42, 39, 41],
        })
      }

      const log: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: currentUser?.id || 'user_cpo_01',
        action: 'performance_evaluation_recorded',
        actionCode: 'HR_EVALUATION_LOGGED',
        severity: 'INFO',
        actorName: currentUser?.name || 'Amara Okafor',
        actorEmail: currentUser?.email || 'chro@pointfex.internal',
        actorRole: 'CHRO',
        entityType: 'user',
        entityId: userId,
        entityTitle: targetUser.name,
        description: `CHRO recorded performance evaluation: Score ${evaluation.score}% (${evaluation.tier.replace('_', ' ')})`,
        timestamp: 'Just now',
        category: 'people',
        badgeColor: 'sky',
      }

      return {
        ...prev,
        performanceRecords: updatedRecords,
        activityLogs: [log, ...prev.activityLogs],
      }
    })

    showToast(`Evaluation recorded for ${targetUser.name}`, 'success')
  }, [currentUser, data.users, showToast])

  const handleIssueEmployeeRecognition = useCallback((userId: string, title: string, description: string, bonusAmount?: number) => {
    const targetUser = data.users.find((u) => u.id === userId)
    if (!targetUser) {
      showToast('Employee not found', 'error')
      return
    }

    if (bonusAmount && bonusAmount > 0) {
      handleIssueFinancialAdjustment(userId, bonusAmount, 'bonus', `Award: ${title}`)
    }

    setData((prev) => {
      const log: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: currentUser?.id || 'user_cpo_01',
        action: 'employee_recognition_awarded',
        actionCode: 'HR_RECOGNITION_AWARDED',
        severity: 'SUCCESS',
        actorName: currentUser?.name || 'Amara Okafor',
        actorEmail: currentUser?.email || 'chro@pointfex.internal',
        actorRole: 'CHRO',
        entityType: 'user',
        entityId: userId,
        entityTitle: targetUser.name,
        description: `Recognized ${targetUser.name}: "${title}" — ${description}`,
        timestamp: 'Just now',
        category: 'people',
        badgeColor: 'emerald',
      }

      return {
        ...prev,
        activityLogs: [log, ...prev.activityLogs],
      }
    })

    showToast(`Awarded "${title}" to ${targetUser.name}`, 'success')
  }, [currentUser, data.users, handleIssueFinancialAdjustment, showToast])

  const handleIssueDisciplinaryAction = useCallback((userId: string, title: string, description: string, penaltyAmount?: number) => {
    const targetUser = data.users.find((u) => u.id === userId)
    if (!targetUser) {
      showToast('Employee not found', 'error')
      return
    }

    if (penaltyAmount && penaltyAmount > 0) {
      handleIssueFinancialAdjustment(userId, penaltyAmount, 'penalty', `Disciplinary: ${title}`)
    }

    setData((prev) => {
      const recordIdx = prev.performanceRecords.findIndex((r) => r.developerId === userId)
      let updatedRecords = [...prev.performanceRecords]
      if (recordIdx >= 0) {
        updatedRecords[recordIdx] = {
          ...updatedRecords[recordIdx],
          disciplinaryNotes: `${title}: ${description}`,
          performanceTier: 'needs_support',
        }
      }

      const log: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: currentUser?.id || 'user_cpo_01',
        action: 'disciplinary_action_recorded',
        actionCode: 'HR_DISCIPLINARY_RECORDED',
        severity: 'CRITICAL',
        actorName: currentUser?.name || 'Amara Okafor',
        actorEmail: currentUser?.email || 'chro@pointfex.internal',
        actorRole: 'CHRO',
        entityType: 'user',
        entityId: userId,
        entityTitle: targetUser.name,
        description: `Formal disciplinary action against ${targetUser.name}: "${title}"`,
        timestamp: 'Just now',
        category: 'people',
        badgeColor: 'rose',
      }

      return {
        ...prev,
        performanceRecords: updatedRecords,
        activityLogs: [log, ...prev.activityLogs],
      }
    })

    showToast(`Disciplinary action recorded for ${targetUser.name}`, 'warning')
  }, [currentUser, data.users, handleIssueFinancialAdjustment, showToast])

  const handleUpdateConfidentialComplaintStatus = useCallback((complaintId: string, status: string, mediationNotes?: string) => {
    setData((prev) => {
      const updatedReports = prev.reports.map((r) => {
        if (r.id === complaintId) {
          return {
            ...r,
            status: status as any,
            mediationNotes: mediationNotes || r.mediationNotes,
            resolvedAt: status === 'resolved' || status === 'dismissed' ? new Date().toISOString() : r.resolvedAt,
          }
        }
        return r
      })

      const log: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: currentUser?.id || 'user_cpo_01',
        action: 'confidential_grievance_adjudicated',
        actionCode: 'HR_CONFIDENTIAL_GRIEVANCE_UPDATED',
        severity: 'INFO',
        actorName: currentUser?.name || 'Amara Okafor',
        actorEmail: currentUser?.email || 'chro@pointfex.internal',
        actorRole: 'CHRO',
        entityType: 'report',
        entityId: complaintId,
        description: `Confidential grievance status changed to ${status}`,
        timestamp: 'Just now',
        category: 'people',
        badgeColor: 'purple',
      }

      return {
        ...prev,
        reports: updatedReports,
        activityLogs: [log, ...prev.activityLogs],
      }
    })

    showToast(`Confidential grievance updated to "${status}"`, 'success')
  }, [currentUser, showToast])

  // Executive Management Handlers
  const handleUpdateExecutiveProfile = useCallback((roleId: string, updatedFields: Partial<User>) => {
    setData((prev) => {
      const idx = prev.users.findIndex((u) => u.role === roleId || (roleId === 'chro' && u.role === 'cpo'))
      if (idx === -1) return prev

      const updatedUsers = [...prev.users]
      updatedUsers[idx] = { ...updatedUsers[idx], ...updatedFields }

      return {
        ...prev,
        users: updatedUsers,
      }
    })

    showToast('Executive profile updated successfully', 'success')
  }, [showToast])

  const handleCreateExecutiveDirective = useCallback((directive: {
    title: string
    description?: string
    assigneeRole: string
    assigneeId?: string
    priority?: TaskPriority
    dueDate?: string
    tags?: string[]
    projectId?: string
  }): Task => {
    const targetUserId =
      directive.assigneeId ||
      (directive.assigneeRole === 'pm'
        ? currentPmId
        : directive.assigneeRole === 'cto'
        ? 'user_cto_01'
        : directive.assigneeRole === 'cfo'
        ? 'user_cfo_01'
        : directive.assigneeRole === 'cpo' || directive.assigneeRole === 'chro'
        ? 'user_cpo_01'
        : CURRENT_DEV_ID)

    const newTask: Task = {
      id: `tsk_exec_${Date.now()}`,
      title: directive.title,
      description: directive.description || 'Executive strategic directive issued from C-Suite leadership.',
      status: 'todo',
      priority: directive.priority || 'urgent',
      assigneeId: targetUserId,
      assignedTo: targetUserId,
      creatorId: currentUser?.id || 'user_ceo_01',
      projectId: directive.projectId || data.projects[0]?.id || 'proj_01',
      dueDate: directive.dueDate || '2026-11-30',
      tags: directive.tags || ['Executive Directive', directive.assigneeRole.toUpperCase()],
      estimatedHours: 24,
      loggedHours: 0,
      createdAt: new Date().toISOString(),
      checklist: [
        { id: 'chk_1', text: 'Executive brief and stakeholder alignment', completed: false },
        { id: 'chk_2', text: 'Milestone execution and telemetry validation', completed: false },
        { id: 'chk_3', text: 'C-Suite sign-off and retrospective documentation', completed: false },
      ],
    }

    setData((prev) => {
      const log: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: currentUser?.id || 'user_ceo_01',
        action: 'executive_directive_dispatched',
        actionCode: 'EXECUTIVE_DIRECTIVE_ISSUED',
        severity: 'INFO',
        actorName: currentUser?.name || 'Chief Executive Officer',
        actorEmail: currentUser?.email || 'ceo@pointfex.internal',
        actorRole: (currentRole || 'CEO').toUpperCase(),
        entityType: 'task',
        entityId: newTask.id,
        entityTitle: newTask.title,
        description: `Dispatched directive to ${directive.assigneeRole.toUpperCase()}: "${newTask.title}"`,
        timestamp: 'Just now',
        category: 'task',
        badgeColor: 'sky',
      }

      return {
        ...prev,
        tasks: [newTask, ...prev.tasks],
        activityLogs: [log, ...prev.activityLogs],
      }
    })

    showToast(`Executive directive dispatched to ${directive.assigneeRole.toUpperCase()}`, 'success')
    return newTask
  }, [currentPmId, currentUser, currentRole, data.projects, showToast])

  const handleAuthorizeCeoAction = useCallback((actionType: string, entityId: string, notes?: string) => {
    setData((prev) => {
      const log: ActivityLog = {
        id: `act_${Date.now()}`,
        userId: currentUser?.id || 'user_ceo_01',
        action: 'ceo_authorization_granted',
        actionCode: 'CEO_DECISION_AUTHORIZED',
        severity: 'SUCCESS',
        actorName: currentUser?.name || 'Chief Executive Officer',
        actorEmail: currentUser?.email || 'ceo@pointfex.internal',
        actorRole: 'CEO',
        entityType: 'general',
        entityId,
        description: `CEO formally ratified ${actionType.replace(/_/g, ' ')}${notes ? `: ${notes}` : ''}`,
        timestamp: 'Just now',
        category: 'governance',
        badgeColor: 'emerald',
      }

      return {
        ...prev,
        activityLogs: [log, ...prev.activityLogs],
      }
    })

    showToast(`CEO Authorized: ${actionType.replace(/_/g, ' ').toUpperCase()}`, 'success')
  }, [currentUser, showToast])

  // Context value
  const value: AppContextType = {
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
    backendStatus,
    backendHealth,
    refreshBackendData,

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
    forwardSubmissionToCLevel: handleForwardSubmissionToCLevel,
    addProjectMilestone: handleAddProjectMilestone,
    updateMilestoneStatus: handleUpdateMilestoneStatus,
    updatePmProfile: handleUpdatePmProfile,
    updateComplaintStatus: handleUpdateComplaintStatus,

    // CTO Workspace Handlers
    createCtoPersonalTask: handleCreateCtoPersonalTask,
    createCtoEngineeringTask: handleCreateCtoEngineeringTask,
    reviewCtoTaskSubmission: handleReviewCtoTaskSubmission,
    updateCtoPersonalTaskStatus: handleUpdateCtoPersonalTaskStatus,
    createProject: handleCreateProject,
    updateProject: handleUpdateProject,
    updateUser: handleUpdateUser,
    createTeam: handleCreateTeam,
    updateTeam: handleUpdateTeam,
    reviewProjectIdea: handleReviewProjectIdea,
    updateComplaintStatusGeneral: handleUpdateComplaintStatusGeneral,
    updateRepoConfig: handleUpdateRepoConfig,
    reviewPullRequest: handleReviewPullRequest,
    createSecurityIssue: handleCreateSecurityIssue,
    updateSecurityIssueStatus: handleUpdateSecurityIssueStatus,
    updateConsultancyStatus: handleUpdateConsultancyStatus,
    submitCtoReport: handleSubmitCtoReport,
    updateIncomingReportStatus: handleUpdateIncomingReportStatus,
    updateCtoProfile: handleUpdateCtoProfile,

    // CFO Financial State Handlers
    allocateProjectBudget: handleAllocateProjectBudget,
    approveBudgetRequest: handleApproveBudgetRequest,
    rejectBudgetRequest: handleRejectBudgetRequest,
    issueFinancialAdjustment: handleIssueFinancialAdjustment,

    // CHRO State Handlers
    recordPerformanceEvaluation: handleRecordPerformanceEvaluation,
    issueEmployeeRecognition: handleIssueEmployeeRecognition,
    issueDisciplinaryAction: handleIssueDisciplinaryAction,
    updateConfidentialComplaintStatus: handleUpdateConfidentialComplaintStatus,

    // Executive Management Handlers
    updateExecutiveProfile: handleUpdateExecutiveProfile,
    createExecutiveDirective: handleCreateExecutiveDirective,
    authorizeCeoAction: handleAuthorizeCeoAction,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// oxlint-disable-next-line react/only-export-components
export function useApp(): AppContextType {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}

export { AppContext }
