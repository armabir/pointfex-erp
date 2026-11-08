import { createContext, useContext, useState, useMemo, useCallback, useEffect, type ReactNode } from 'react'
import { getInitialSeedData, createDataResolvers, CURRENT_DEV_ID, CURRENT_PM_ID } from '../data'
import { ROLES } from '../data/roles'
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
    } else if (roleId === 'cto') {
      const target = localStorage.getItem('pointfex_cto_route') || 'dashboard'
      setRoute(target)
      showToast('Switched to CTO Engineering Command', 'success')
    } else {
      const targetRole = ROLES[roleId.toUpperCase()]?.name || roleId
      showToast(`Switched to ${targetRole} (Preview)`, 'info')
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
    showToast(`Task moved to "${newStatus.replace('_', ' ')}"`, 'success')
    return true
  }, [currentRole, showToast])

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
    showToast('Profile updated successfully', 'success')
  }, [currentDevId, showToast])

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
    const devName = resolvers.getUser(newAssigneeId)?.name || 'developer'
    showToast(`Task reassigned to ${devName}`, 'success')
  }, [currentPmId, resolvers, showToast])

  // PM Handler: Allocate Budget to Developer
  const handleAllocateBudget = useCallback((allocation: {
    developerId: string
    projectId: string
    amount: number | string
    description?: string
    week?: number | string
  }) => {
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
  const handleRequestBudgetIncrease = useCallback((req: {
    projectId: string
    amount: number | string
    reason: string
  }) => {
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
    const newTask: Task = {
      id: `task_cto_${Date.now()}`,
      title: taskData.title,
      description: taskData.description || '',
      projectId: taskData.projectId || 'proj_01',
      assigneeId: 'user_cto_01',
      creatorId: 'user_cto_01',
      status: 'todo',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      estimatedHours: 8,
      loggedHours: 0,
      tags: taskData.tags || ['Personal', 'Architecture'],
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
  }, [showToast])

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

    showToast(`Project ${newProject.code} created successfully`, 'success')
    return newProject
  }, [showToast])

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
