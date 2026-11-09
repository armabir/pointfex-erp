import type {
  SeedData,
  User,
  Team,
  Project,
  Task,
  Wallet,
  Transaction,
  PerformanceRecord,
  Report,
  CodeQualityGate,
  SecurityAlert,
  TestingSuite,
  ConsultancyRequest,
  CompanyTreasury,
  Milestone,
} from '../types'
import { getInitialSeedData } from '../data'

/**
 * Normalizes the API Base URL from Vite environment variables.
 * Handles trailing slashes cleanly.
 */
export function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '')
  }
  // Default to relative /api (uses Vite proxy in local dev, or reverse-proxy in prod)
  return '/api'
}

/**
 * Generates headers for API requests including role-based demo headers
 */
export function getApiHeaders(userId?: string, role?: string): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  if (userId) {
    headers['x-demo-user-id'] = userId
  }
  if (role) {
    headers['x-demo-role'] = role.toLowerCase()
  }
  return headers
}

export interface BackendHealthResponse {
  status: 'ok' | 'degraded' | 'offline'
  service: string
  environment: string
  timestamp: string
  uptimeSeconds: number
  database: {
    status: string
    latencyMs: number
  }
  corsAllowedOrigins?: string
  version: string
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = getApiBaseUrl()
  }

  /**
   * Health check to verify live backend & database connectivity
   */
  async checkHealth(): Promise<BackendHealthResponse | null> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  }

  /**
   * Generic authenticated HTTP fetch helper with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    userId?: string,
    role?: string,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
    const headers = {
      ...getApiHeaders(userId, role),
      ...(options.headers || {}),
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      let errorMessage = `API error: ${response.status} ${response.statusText}`
      try {
        const errorJson = await response.json()
        if (errorJson.message) {
          errorMessage = Array.isArray(errorJson.message)
            ? errorJson.message.join(', ')
            : errorJson.message
        }
      } catch {
        // use fallback message
      }
      throw new Error(errorMessage)
    }

    return response.json()
  }

  /**
   * Hydrates all ERP records from backend database into frontend SeedData format.
   * If any backend entity endpoint fails, falls back gracefully to initial mock data.
   */
  async fetchFullData(activeUserId?: string, activeRole?: string): Promise<SeedData> {
    const fallback = getInitialSeedData()

    try {
      // 1. Fetch primary entities concurrently
      const [
        employeesRes,
        teamsRes,
        projectsRes,
        tasksRes,
        treasuryRes,
        walletsRes,
        transactionsRes,
        performanceRes,
        reportsRes,
      ] = await Promise.allSettled([
        this.request<any[]>('/employees', { method: 'GET' }, activeUserId, activeRole),
        this.request<any[]>('/teams', { method: 'GET' }, activeUserId, activeRole),
        this.request<any[]>('/projects', { method: 'GET' }, activeUserId, activeRole),
        this.request<any[]>('/tasks', { method: 'GET' }, activeUserId, activeRole),
        this.request<any>('/finance/treasury', { method: 'GET' }, activeUserId, activeRole),
        this.request<any[]>('/finance/wallets', { method: 'GET' }, activeUserId, activeRole),
        this.request<any[]>('/finance/transactions', { method: 'GET' }, activeUserId, activeRole),
        this.request<any[]>('/performance', { method: 'GET' }, activeUserId, activeRole),
        this.request<any[]>('/reports', { method: 'GET' }, activeUserId, activeRole),
      ])

      // 2. Fetch executive/engineering streams (requiring executive demo role headers)
      const [
        auditLogsRes,
        qualityGatesRes,
        securityAlertsRes,
        testRunsRes,
        consultancyRes,
      ] = await Promise.allSettled([
        this.request<any[]>('/audit-logs', { method: 'GET' }, activeUserId || 'emp_cto_01', 'cto'),
        this.request<any[]>('/engineering/quality-gates', { method: 'GET' }, activeUserId, activeRole),
        this.request<any[]>('/engineering/security-alerts', { method: 'GET' }, activeUserId, activeRole),
        this.request<any[]>('/engineering/test-runs', { method: 'GET' }, activeUserId, activeRole),
        this.request<any[]>('/consultancy', { method: 'GET' }, activeUserId, activeRole),
      ])

      // --- Map Employees -> Users ---
      let users: User[] = fallback.users
      if (employeesRes.status === 'fulfilled' && Array.isArray(employeesRes.value)) {
        users = employeesRes.value.map((emp) => {
          const primaryRole = emp.positionAssignments?.[0]?.position?.roleCategory || 'developer'
          const teamId = emp.teamMemberships?.[0]?.teamId
          return {
            id: emp.id,
            name: emp.name,
            email: emp.email,
            title: emp.title,
            initials: emp.initials || emp.name.slice(0, 2).toUpperCase(),
            avatar: emp.avatarUrl,
            avatarUrl: emp.avatarUrl,
            status: emp.status || 'online',
            skills: emp.skills || [],
            timezone: emp.timezone || 'UTC+6 (BST)',
            github: emp.github || undefined,
            phone: emp.phone || undefined,
            location: emp.location || undefined,
            bio: emp.bio || undefined,
            role: primaryRole,
            teamId: teamId || undefined,
            joinedSprint: emp.joinedSprint || 'Sprint 1',
          }
        })
      }

      // --- Map Teams ---
      let teams: Team[] = fallback.teams
      if (teamsRes.status === 'fulfilled' && Array.isArray(teamsRes.value)) {
        teams = teamsRes.value.map((t) => {
          const pmId = t.pmPosition?.assignments?.[0]?.employeeId || t.pmPositionId || 'emp_pm_01'
          const leadDevId = t.memberships?.find((m: any) => m.isLead)?.employeeId
          const memberIds = t.memberships?.map((m: any) => m.employeeId) || []
          const projectIds = t.teamProjects?.map((tp: any) => tp.projectId) || []
          return {
            id: t.id,
            name: t.name,
            code: t.code,
            focus: t.focus || '',
            pmId,
            leadDevId,
            memberIds,
            projectIds,
            color: t.color || '#38bdf8',
            currentSprintWeek: t.currentSprintWeek || 1,
            totalSprintWeeks: t.totalSprintWeeks || 4,
            health: t.health || 'on_track',
            weeklyVelocity: t.weeklyVelocity || 30,
          }
        })
      }

      // --- Map Projects & Milestones ---
      let projects: Project[] = fallback.projects
      let milestones: Milestone[] = fallback.milestones
      if (projectsRes.status === 'fulfilled' && Array.isArray(projectsRes.value)) {
        const extractedMilestones: Milestone[] = []
        projects = projectsRes.value.map((p) => {
          const teamId = p.teamProjects?.[0]?.teamId || p.teamId || 'team_01'
          const teamObj = p.teamProjects?.[0]?.team
          const pmId = teamObj?.pmPosition?.assignments?.[0]?.employeeId || teamObj?.pmPositionId || 'emp_pm_01'
          const leadDevId = teamObj?.memberships?.find((m: any) => m.isLead)?.employeeId
          const assignedDevIds = teamObj?.memberships?.map((m: any) => m.employeeId) || []

          const projectMilestones = (p.milestones || []).map((m: any) => {
            const msItem: Milestone = {
              id: m.id,
              projectId: p.id,
              title: m.title,
              dueDate: m.dueDate ? new Date(m.dueDate).toISOString().split('T')[0] : '',
              status: m.status || 'pending',
              payoutAmount: Number(m.payoutAmount || 0),
              progress: m.status === 'completed' ? 100 : m.status === 'in_progress' ? 50 : 0,
            }
            extractedMilestones.push(msItem)
            return msItem
          })

          return {
            id: p.id,
            name: p.name,
            code: p.code,
            teamId,
            pmId,
            leadDevId,
            repoId: `repo_${p.id}`,
            description: p.description || '',
            status: p.status || 'in_progress',
            progress: Number(p.progress || 0),
            health: p.health || 'on_track',
            startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : '2026-10-12',
            deadline: p.deadline ? new Date(p.deadline).toISOString().split('T')[0] : '2026-11-20',
            totalWeeks: Number(p.totalWeeks || 4),
            currentWeek: Number(p.currentWeek || 1),
            budget: Number(p.budget || 35000),
            allocatedBudget: Number(p.allocatedBudget || 30000),
            clientRevenue: Number(p.clientRevenue || 50000),
            client: p.client || undefined,
            priority: p.priority || undefined,
            repositoryUrl: p.repositoryUrl || undefined,
            demoUrl: p.demoUrl || undefined,
            tags: p.tags || ['React 19', 'TypeScript', 'Vite'],
            color: p.color || '#38bdf8',
            assignedDevIds,
            milestones: projectMilestones.map((m: Milestone) => ({
              id: m.id,
              title: m.title,
              dueDate: m.dueDate,
              status: m.status,
            })),
            srs: p.srsTitle
              ? {
                  documentTitle: p.srsTitle,
                  documentUrl: p.srsUrl || '',
                  version: p.srsVersion || 'v1.0',
                  lastUpdated: p.srsLastUpdated
                    ? new Date(p.srsLastUpdated).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0],
                  overview: p.srsOverview || '',
                  requirementsCount: Number(p.srsRequirementsCount || 10),
                  approvedBy: 'Dr. Shamsul Arefin',
                }
              : undefined,
          }
        })
        if (extractedMilestones.length > 0) {
          milestones = extractedMilestones
        }
      }

      // --- Map Tasks ---
      let tasks: Task[] = fallback.tasks
      if (tasksRes.status === 'fulfilled' && Array.isArray(tasksRes.value)) {
        tasks = tasksRes.value.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          projectId: t.projectId,
          assigneeId: t.assigneeId,
          assignedTo: t.assigneeId,
          creatorId: t.creatorId,
          status: t.status,
          priority: t.priority,
          dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : new Date().toISOString(),
          estimatedHours: t.estimatedHours || 8,
          loggedHours: t.loggedHours || 0,
          milestoneId: t.milestoneId || undefined,
          tags: t.tags || ['Feature'],
          checklist: (t.checklist || []).map((c: any) => ({
            id: c.id,
            text: c.text,
            completed: Boolean(c.completed),
          })),
          createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : new Date().toISOString(),
        }))
      }

      // --- Map Treasury ---
      let treasury: CompanyTreasury = fallback.treasury
      if (treasuryRes.status === 'fulfilled' && treasuryRes.value) {
        const t = treasuryRes.value
        treasury = {
          initialCapital: Number(t.initialCapital || 500000),
          totalApprovedBudgets: Number(t.totalApprovedBudgets || 380000),
          totalDistributedToDevs: Number(t.totalDistributedToDevs || 245600),
          totalClientRevenue: Number(t.totalClientRevenue || 740000),
          unallocatedReserves: Number(t.unallocatedReserves || 120000),
        }
      }

      // --- Map Wallets ---
      let wallets: Wallet[] = fallback.wallets
      if (walletsRes.status === 'fulfilled' && Array.isArray(walletsRes.value)) {
        wallets = walletsRes.value.map((w) => ({
          userId: w.employeeId,
          balance: Number(w.balance || 0),
          currency: w.currency || 'BDT',
          currencySymbol: '৳',
          pendingEscrow: Number(w.pendingEscrow || 0),
          totalEarnedToDate: Number(w.totalEarnedToDate || 0),
          totalPenalties: Number(w.totalPenalties || 0),
          hourlyRateEquivalent: Number(w.hourlyRateEquivalent || 0),
          sprintBonusEarned: Number(w.sprintBonusEarned || 0),
          lastPayoutDate: w.lastPayoutDate ? new Date(w.lastPayoutDate).toISOString() : undefined,
          nextScheduledPayout: w.nextScheduledPayout ? new Date(w.nextScheduledPayout).toISOString() : undefined,
        }))
      }

      // --- Map Transactions ---
      let transactions: Transaction[] = fallback.transactions
      if (transactionsRes.status === 'fulfilled' && Array.isArray(transactionsRes.value)) {
        transactions = transactionsRes.value.map((tx) => ({
          id: tx.id,
          userId: tx.employeeId,
          projectId: tx.projectId || undefined,
          milestoneId: tx.milestoneId || undefined,
          type: tx.type,
          amount: Number(tx.amount || 0),
          currency: tx.currency || 'BDT',
          currencySymbol: '৳',
          description: tx.description,
          date: tx.createdAt ? new Date(tx.createdAt).toISOString() : new Date().toISOString(),
          status: tx.status || 'settled',
        }))
      }

      // --- Map Performance Records ---
      let performanceRecords: PerformanceRecord[] = fallback.performanceRecords
      if (performanceRes.status === 'fulfilled' && Array.isArray(performanceRes.value)) {
        performanceRecords = performanceRes.value.map((p) => ({
          id: p.id,
          userId: p.employeeId,
          evaluationPeriod: p.evaluationPeriod || 'Q4 2026',
          overallScore: Number(p.overallScore || 85),
          codeQualityRating: Number(p.codeQualityRating || 88),
          velocityRating: Number(p.velocityRating || 85),
          collaborationRating: Number(p.collaborationRating || 90),
          reliabilityRating: Number(p.reliabilityRating || 88),
          strengths: p.strengths || [],
          improvements: p.improvements || [],
          reviewerNotes: p.reviewerNotes || '',
          reviewerId: p.reviewerId || 'emp_chro_01',
          reviewerName: p.reviewerName || 'CHRO Nadia Rahman',
          createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
        }))
      }

      // --- Map Reports ---
      let reports: Report[] = fallback.reports
      if (reportsRes.status === 'fulfilled' && Array.isArray(reportsRes.value)) {
        reports = reportsRes.value.map((r) => {
          const createdDate = r.createdAt
            ? new Date(r.createdAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0]

          return {
            id: r.id,
            userId: r.authorId || 'emp_dev_01',
            authorId: r.authorId,
            authorName: r.author?.name || 'Pointfex Team Member',
            teamId: r.teamId || undefined,
            projectId: r.projectId || undefined,
            type: r.type || 'complaint',
            category: r.category || 'general',
            title: r.title,
            description: r.description,
            status: r.status || 'submitted',
            date: createdDate,
            submittedAt: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Today',
            createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
            isConfidential: Boolean(r.isConfidential),
            priority: r.priority || 'medium',
            forwardedToLeadership: Boolean(r.forwardedToLeadership),
            pmNotes: r.pmNotes || undefined,
            leadershipFeedback: r.leadershipFeedback || undefined,
            resolutionSummary: r.resolutionSummary || undefined,
          }
        })
      }

      // --- Map Audit Logs ---
      let activityLogs = fallback.activityLogs
      if (auditLogsRes.status === 'fulfilled' && Array.isArray(auditLogsRes.value)) {
        activityLogs = auditLogsRes.value.map((a) => ({
          id: a.id,
          userId: a.actorId,
          action: a.actionCode?.toLowerCase() || a.action?.toLowerCase() || 'general',
          entityType: a.entityType || 'system',
          entityId: a.entityId || a.id,
          entityTitle: a.action,
          description: a.description || `${a.actorName} performed ${a.action}`,
          timestamp: a.createdAt ? new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
          category: (a.entityType?.toLowerCase() as any) || 'system',
          badgeColor: a.severity === 'CRITICAL' ? 'rose' : a.severity === 'WARN' ? 'amber' : 'sky',
        }))
      }

      // --- Map Code Quality Gates ---
      let codeQualityGates: CodeQualityGate[] = fallback.codeQualityGates
      if (qualityGatesRes.status === 'fulfilled' && Array.isArray(qualityGatesRes.value)) {
        codeQualityGates = qualityGatesRes.value.map((q) => ({
          projectId: q.projectId,
          complianceScore: Number(q.complianceScore || 90),
          testCoverage: Number(q.testCoverage || 85),
          techDebtHours: Number(q.techDebtHours || 8),
          codeSmellsCount: Number(q.codeSmellsCount || 0),
          bugsDetected: Number(q.bugsDetected || 0),
          vulnerabilitiesCount: Number(q.vulnerabilitiesCount || 0),
          lastAnalysis: q.lastAnalysis ? new Date(q.lastAnalysis).toISOString() : new Date().toISOString(),
          status: q.status || 'passed',
        }))
      }

      // --- Map Security Alerts ---
      let securityAlerts: SecurityAlert[] = fallback.securityAlerts
      if (securityAlertsRes.status === 'fulfilled' && Array.isArray(securityAlertsRes.value)) {
        securityAlerts = securityAlertsRes.value.map((s) => ({
          id: s.id,
          projectId: s.projectId,
          title: s.title,
          severity: s.severity || 'medium',
          category: s.category || 'dependency',
          status: s.status || 'open',
          detectedAt: s.detectedAt ? new Date(s.detectedAt).toISOString() : new Date().toISOString(),
          resolvedAt: s.resolvedAt ? new Date(s.resolvedAt).toISOString() : undefined,
          assignedPmId: s.assignedPmId || undefined,
          cveOrPackage: s.cveOrPackage || undefined,
          description: s.description || '',
          recommendation: s.recommendation || '',
        }))
      }

      // --- Map Testing Suites ---
      let testingSuites: TestingSuite[] = fallback.testingSuites
      if (testRunsRes.status === 'fulfilled' && Array.isArray(testRunsRes.value)) {
        testingSuites = testRunsRes.value.map((tr) => ({
          id: tr.id,
          projectId: tr.projectId,
          name: tr.name,
          totalTests: Number(tr.totalTests || 100),
          passed: Number(tr.passed || 95),
          failed: Number(tr.failed || 5),
          skipped: Number(tr.skipped || 0),
          duration: tr.duration || '3.2s',
          coveragePercent: Number(tr.coveragePercent || 88),
          lastRun: tr.lastRun ? new Date(tr.lastRun).toISOString() : new Date().toISOString(),
          status: tr.status || 'passed',
        }))
      }

      // --- Map Consultancy Requests ---
      let consultancyRequests: ConsultancyRequest[] = fallback.consultancyRequests
      if (consultancyRes.status === 'fulfilled' && Array.isArray(consultancyRes.value)) {
        consultancyRequests = consultancyRes.value.map((c) => ({
          id: c.id,
          title: c.title,
          requesterId: c.requesterId,
          teamId: c.teamId,
          projectId: c.projectId,
          category: c.category,
          description: c.description,
          urgency: c.urgency || 'medium',
          status: c.status || 'submitted',
          assignedConsultantId: c.assignedConsultantId || undefined,
          assignedConsultantName: c.assignedConsultantName || undefined,
          estimatedHours: c.estimatedHours ? Number(c.estimatedHours) : undefined,
          feeUSD: c.feeUSD ? Number(c.feeUSD) : undefined,
          requestedAt: c.requestedAt ? new Date(c.requestedAt).toISOString() : new Date().toISOString(),
          targetDate: c.targetDate ? new Date(c.targetDate).toISOString() : undefined,
          ctoNotes: c.ctoNotes || undefined,
          completedAt: c.completedAt ? new Date(c.completedAt).toISOString() : undefined,
        }))
      }

      return {
        ...fallback,
        users,
        teams,
        projects,
        tasks,
        treasury,
        wallets,
        transactions,
        performanceRecords,
        reports,
        activityLogs,
        milestones,
        codeQualityGates,
        securityAlerts,
        testingSuites,
        consultancyRequests,
      }
    } catch (err) {
      console.warn('Backend API connection degraded, using client fallback seed data:', err)
      return fallback
    }
  }

  // ==========================================================================
  // MUTATION METHODS (Synchronizing frontend actions to PostgreSQL via NestJS)
  // ==========================================================================

  /**
   * Update task status (Kanban board drag/drop or column change)
   */
  async updateTaskStatus(
    taskId: string,
    status: string,
    userId?: string,
    role?: string,
  ): Promise<any> {
    return this.request(
      `/tasks/${taskId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      },
      userId,
      role,
    )
  }

  /**
   * Create a new task
   */
  async createTask(
    payload: {
      title: string
      description?: string
      projectId: string
      assigneeId: string
      priority?: string
      dueDate?: string
      estimatedHours?: number
      tags?: string[]
      milestoneId?: string
    },
    userId?: string,
    role?: string,
  ): Promise<any> {
    return this.request(
      '/tasks',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      userId,
      role,
    )
  }

  /**
   * Approve task (PM action)
   */
  async approveTask(
    taskId: string,
    payload: { bonusAmount?: number; feedback?: string },
    userId?: string,
    role?: string,
  ): Promise<any> {
    return this.request(
      `/tasks/${taskId}/approve`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      userId,
      role || 'pm',
    )
  }

  /**
   * Reject task with feedback (PM action)
   */
  async rejectTask(
    taskId: string,
    rejectionReason: string,
    userId?: string,
    role?: string,
  ): Promise<any> {
    return this.request(
      `/tasks/${taskId}/reject`,
      {
        method: 'POST',
        body: JSON.stringify({ rejectionReason }),
      },
      userId,
      role || 'pm',
    )
  }

  /**
   * Reassign task to a different developer
   */
  async reassignTask(
    taskId: string,
    newAssigneeId: string,
    userId?: string,
    role?: string,
  ): Promise<any> {
    return this.request(
      `/tasks/${taskId}/reassign`,
      {
        method: 'POST',
        body: JSON.stringify({ newAssigneeId }),
      },
      userId,
      role || 'pm',
    )
  }

  /**
   * Toggle or update a task checklist item
   */
  async updateChecklistItem(
    taskId: string,
    itemId: string,
    completed: boolean,
    userId?: string,
    role?: string,
  ): Promise<any> {
    return this.request(
      `/tasks/${taskId}/checklist/${itemId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ completed }),
      },
      userId,
      role,
    )
  }

  /**
   * Add a comment to a task
   */
  async addTaskComment(
    taskId: string,
    content: string,
    userId?: string,
    role?: string,
  ): Promise<any> {
    return this.request(
      `/tasks/${taskId}/comments`,
      {
        method: 'POST',
        body: JSON.stringify({ content }),
      },
      userId,
      role,
    )
  }

  /**
   * Update employee profile (name, title, skills, timezone, bio, phone, location)
   */
  async updateEmployeeProfile(
    employeeId: string,
    payload: Partial<User>,
    userId?: string,
    role?: string,
  ): Promise<any> {
    return this.request(
      `/employees/${employeeId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          name: payload.name,
          title: payload.title,
          skills: payload.skills,
          timezone: payload.timezone,
          phone: payload.phone,
          location: payload.location,
          bio: payload.bio,
          avatarUrl: payload.avatarUrl || payload.avatar,
        }),
      },
      userId,
      role,
    )
  }

  /**
   * Allocate developer budget from project funds
   */
  async allocateDeveloperBudget(
    payload: {
      projectId: string
      employeeId: string
      amount: number
      description: string
    },
    userId?: string,
    role?: string,
  ): Promise<any> {
    return this.request(
      '/finance/allocate-developer',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      userId,
      role || 'pm',
    )
  }

  /**
   * Submit a budget increase request to CFO
   */
  async requestBudget(
    payload: {
      projectId: string
      requestedAmount: number
      justification: string
    },
    userId?: string,
    role?: string,
  ): Promise<any> {
    return this.request(
      '/finance/request-budget',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      userId,
      role || 'pm',
    )
  }

  /**
   * CFO approve budget request
   */
  async approveBudgetRequest(requestId: string, userId?: string, role?: string): Promise<any> {
    return this.request(
      `/finance/approve-budget/${requestId}`,
      {
        method: 'POST',
      },
      userId,
      role || 'cfo',
    )
  }

  /**
   * CFO reject budget request
   */
  async rejectBudgetRequest(requestId: string, reason?: string, userId?: string, role?: string): Promise<any> {
    return this.request(
      `/finance/reject-budget/${requestId}`,
      {
        method: 'POST',
        body: JSON.stringify({ reason }),
      },
      userId,
      role || 'cfo',
    )
  }

  /**
   * Submit a new report / grievance
   */
  async createReport(
    payload: {
      title: string
      description: string
      type: string
      category?: string
      projectId?: string
      isConfidential?: boolean
    },
    userId?: string,
    role?: string,
  ): Promise<any> {
    return this.request(
      '/reports',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      userId,
      role,
    )
  }

  /**
   * Update report status (PM/HR/Leadership review)
   */
  async updateReportStatus(
    reportId: string,
    payload: { status: string; pmNotes?: string; leadershipFeedback?: string },
    userId?: string,
    role?: string,
  ): Promise<any> {
    return this.request(
      `/reports/${reportId}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      userId,
      role,
    )
  }

  /**
   * Create a new engineering project
   */
  async createProject(
    payload: {
      name: string
      code: string
      description: string
      budgetAllocated?: number
      techStack?: string[]
      teamId?: string
      repositoryUrl?: string
      srsDocUrl?: string
    },
    userId?: string,
    role?: string,
  ): Promise<any> {
    return this.request(
      '/projects',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      userId,
      role || 'cto',
    )
  }

  /**
   * Create a consultancy request
   */
  async createConsultancyRequest(payload: any, userId?: string, role?: string): Promise<any> {
    return this.request(
      '/consultancy',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      userId,
      role,
    )
  }
}

export const api = new ApiService()
