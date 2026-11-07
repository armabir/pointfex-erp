import { ROLES, ROLE_LIST } from './roles.js'
import { USERS, CURRENT_DEV_ID, getCurrentDeveloper, CURRENT_PM_ID, getCurrentPm } from './users.js'
import { TEAMS } from './teams.js'
import { PROJECTS } from './projects.js'
import { TASKS } from './tasks.js'
import { TASK_COMMENTS } from './comments.js'
import { TASK_ATTACHMENTS } from './attachments.js'
import { WALLETS } from './wallets.js'
import { TRANSACTIONS } from './transactions.js'
import { PERFORMANCE_RECORDS } from './performance.js'
import { REPORTS } from './reports.js'
import { ANNOUNCEMENTS } from './announcements.js'
import { NOTIFICATIONS } from './notifications.js'
import { ACTIVITY_LOGS } from './activityLogs.js'
import { MILESTONES } from './milestones.js'
import { REPOSITORIES } from './repositories.js'

export {
  ROLES,
  ROLE_LIST,
  USERS,
  CURRENT_DEV_ID,
  getCurrentDeveloper,
  CURRENT_PM_ID,
  getCurrentPm,
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
}

// Deep clone helper for clean demo state isolation & instant resets
export function getInitialSeedData() {
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
  }
}

// Relational resolution helpers
export const createDataResolvers = (data) => {
  const getUser = (id) => data.users.find((u) => u.id === id) || null
  const getProject = (id) => data.projects.find((p) => p.id === id) || null
  const getTeam = (id) => data.teams.find((t) => t.id === id) || null
  const getMilestone = (id) => data.milestones.find((m) => m.id === id) || null
  const getRepo = (id) => data.repositories.find((r) => r.id === id) || null

  const getDeveloperTasks = (devId = CURRENT_DEV_ID) =>
    data.tasks.filter((task) => task.assigneeId === devId)

  const getDeveloperProjects = (devId = CURRENT_DEV_ID) => {
    const dev = getUser(devId)
    if (!dev) return []
    return data.projects.filter(
      (proj) => proj.teamId === dev.teamId || proj.assignedDevIds?.includes(devId)
    )
  }

  const getDeveloperWallet = (devId = CURRENT_DEV_ID) =>
    data.wallets.find((w) => w.userId === devId) || null

  const getDeveloperPerformance = (devId = CURRENT_DEV_ID) =>
    data.performanceRecords.find((p) => p.userId === devId) || null

  const getDeveloperTransactions = (devId = CURRENT_DEV_ID) =>
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

