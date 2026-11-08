import { ROLES, ROLE_LIST } from './roles'
import { USERS, CURRENT_DEV_ID, getCurrentDeveloper, CURRENT_PM_ID, getCurrentPm } from './users'
import { TEAMS } from './teams'
import { PROJECTS } from './projects'
import { TASKS } from './tasks'
import { TASK_COMMENTS } from './comments'
import { TASK_ATTACHMENTS } from './attachments'
import { WALLETS } from './wallets'
import { TRANSACTIONS } from './transactions'
import { PERFORMANCE_RECORDS } from './performance'
import { REPORTS } from './reports'
import { ANNOUNCEMENTS } from './announcements'
import { NOTIFICATIONS } from './notifications'
import { ACTIVITY_LOGS } from './activityLogs'
import { MILESTONES } from './milestones'
import { REPOSITORIES } from './repositories'
import { PULL_REQUESTS } from './pullRequests'
import { CODE_QUALITY_GATES } from './codeQuality'
import { SECURITY_ALERTS, BUG_BOUNTIES } from './securityAlerts'
import { TESTING_SUITES } from './testingSuites'
import { CONSULTANCY_REQUESTS } from './consultancy'
import { CURRENT_CTO_ID, getCurrentCto } from './users'
import type {
  SeedData,
  DataResolvers,
  User,
  Project,
  Team,
  Milestone,
  Repository,
  Task,
  Wallet,
  PerformanceRecord,
  Transaction,
} from '../types'

export {
  ROLES,
  ROLE_LIST,
  USERS,
  CURRENT_DEV_ID,
  getCurrentDeveloper,
  CURRENT_PM_ID,
  getCurrentPm,
  CURRENT_CTO_ID,
  getCurrentCto,
  TEAMS,
  PROJECTS,
  TASKS,
  TASK_COMMENTS,
  TASK_ATTACHMENTS,
  WALLETS,
  TRANSACTIONS,
  PERFORMANCE_RECORDS,
  REPORTS,
  ANNOUNCEMENTS,
  NOTIFICATIONS,
  ACTIVITY_LOGS,
  MILESTONES,
  REPOSITORIES,
  PULL_REQUESTS,
  CODE_QUALITY_GATES,
  SECURITY_ALERTS,
  BUG_BOUNTIES,
  TESTING_SUITES,
  CONSULTANCY_REQUESTS,
}

// Deep clone helper for clean demo state isolation & instant resets
export function getInitialSeedData(): SeedData {
  return {
    roles: JSON.parse(JSON.stringify(ROLE_LIST)),
    users: JSON.parse(JSON.stringify(USERS)),
    teams: JSON.parse(JSON.stringify(TEAMS)),
    projects: JSON.parse(JSON.stringify(PROJECTS)),
    tasks: JSON.parse(JSON.stringify(TASKS)),
    comments: JSON.parse(JSON.stringify(TASK_COMMENTS)),
    attachments: JSON.parse(JSON.stringify(TASK_ATTACHMENTS)),
    wallets: JSON.parse(JSON.stringify(WALLETS)),
    transactions: JSON.parse(JSON.stringify(TRANSACTIONS)),
    performanceRecords: JSON.parse(JSON.stringify(PERFORMANCE_RECORDS)),
    reports: JSON.parse(JSON.stringify(REPORTS)),
    announcements: JSON.parse(JSON.stringify(ANNOUNCEMENTS)),
    notifications: JSON.parse(JSON.stringify(NOTIFICATIONS)),
    activityLogs: JSON.parse(JSON.stringify(ACTIVITY_LOGS)),
    milestones: JSON.parse(JSON.stringify(MILESTONES)),
    repositories: JSON.parse(JSON.stringify(REPOSITORIES)),
    pullRequests: JSON.parse(JSON.stringify(PULL_REQUESTS)),
    codeQualityGates: JSON.parse(JSON.stringify(CODE_QUALITY_GATES)),
    securityAlerts: JSON.parse(JSON.stringify(SECURITY_ALERTS)),
    testingSuites: JSON.parse(JSON.stringify(TESTING_SUITES)),
    bugBounties: JSON.parse(JSON.stringify(BUG_BOUNTIES)),
    consultancyRequests: JSON.parse(JSON.stringify(CONSULTANCY_REQUESTS)),
  }
}

// Relational resolution helpers
export const createDataResolvers = (data: SeedData): DataResolvers => {
  const getUser = (id: string): User | null => data.users.find((u) => u.id === id) || null
  const getProject = (id: string): Project | null => data.projects.find((p) => p.id === id) || null
  const getTeam = (id: string): Team | null => data.teams.find((t) => t.id === id) || null
  const getMilestone = (id: string): Milestone | null => data.milestones.find((m) => m.id === id) || null
  const getRepo = (id: string): Repository | null => data.repositories.find((r) => r.id === id) || null

  const getDeveloperTasks = (devId: string = CURRENT_DEV_ID): Task[] =>
    data.tasks.filter((task) => task.assigneeId === devId)

  const getDeveloperProjects = (devId: string = CURRENT_DEV_ID): Project[] => {
    const dev = getUser(devId)
    if (!dev) return []
    return data.projects.filter(
      (proj) => proj.teamId === dev.teamId || proj.assignedDevIds?.includes(devId)
    )
  }

  const getDeveloperWallet = (devId: string = CURRENT_DEV_ID): Wallet | null =>
    data.wallets.find((w) => w.userId === devId) || null

  const getDeveloperPerformance = (devId: string = CURRENT_DEV_ID): PerformanceRecord | null =>
    data.performanceRecords.find((p) => p.userId === devId) || null

  const getDeveloperTransactions = (devId: string = CURRENT_DEV_ID): Transaction[] =>
    data.transactions.filter((tx) => tx.userId === devId)

  return {
    getUser,
    getProject,
    getTeam,
    getMilestone,
    getRepo,
    getDeveloperTasks,
    getDeveloperProjects,
    getDeveloperWallet,
    getDeveloperPerformance,
    getDeveloperTransactions,
  }
}

