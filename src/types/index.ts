import type { ComponentType } from 'react'

// --- ROLES ---
export type RoleId = 'developer' | 'pm' | 'cto' | 'cpo' | 'cfo' | 'ceo' | string

export interface Role {
  id: RoleId
  name: string
  badge: string
  description: string
  isImplemented: boolean
}

// --- USERS ---
export type UserStatus = 'online' | 'offline' | 'away'

export interface User {
  id: string
  name: string
  email: string
  role: RoleId
  title: string
  teamId?: string
  avatar?: string
  initials: string
  status: UserStatus
  skills?: string[]
  timezone?: string
  github?: string
  joinedSprint?: string
  bio?: string
  phone?: string
  location?: string
}

// --- TEAMS ---
export interface Team {
  id: string
  name: string
  code: string
  focus?: string
  pmId: string
  leadDevId?: string
  memberIds: string[]
  projectIds?: string[]
  color?: string
  currentSprintWeek?: number
  totalSprintWeeks?: number
  health?: 'on_track' | 'needs_attention' | 'delayed' | string
  weeklyVelocity?: number
}

// --- PROJECTS ---
export interface ProjectMilestone {
  id: string
  title: string
  dueDate: string
  status: 'completed' | 'in_progress' | 'pending' | string
}

export interface ProjectSRS {
  documentTitle: string
  documentUrl: string
  version: string
  lastUpdated: string
  overview: string
  requirementsCount: number
}

export interface Project {
  id: string
  name: string
  code: string
  teamId: string
  pmId: string
  leadDevId?: string
  repoId?: string
  description: string
  status: 'in_progress' | 'planning' | 'completed' | 'on_hold' | string
  progress: number
  health: 'on_track' | 'needs_attention' | 'at_risk' | 'delayed' | string
  startDate: string
  deadline: string
  totalWeeks: number
  currentWeek: number
  budget: number
  client?: string
  priority?: string
  repositoryUrl?: string
  demoUrl?: string
  tags: string[]
  color?: string
  assignedDevIds: string[]
  milestones?: ProjectMilestone[]
  srs?: ProjectSRS
}

// --- TASKS ---
export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed' | 'blocked'
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low'

export interface TaskChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  projectId: string
  assigneeId: string
  creatorId: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  estimatedHours: number
  loggedHours: number
  milestoneId?: string
  tags: string[]
  checklist?: TaskChecklistItem[]
  createdAt: string
}

export interface TaskComment {
  id: string
  taskId: string
  authorId: string
  content: string
  createdAt: string
}

export interface TaskAttachment {
  id: string
  taskId: string
  name: string
  size: string
  type: string
  uploadedById: string
  uploadedAt: string
}

// --- WALLETS & TRANSACTIONS ---
export interface Wallet {
  userId: string
  balance: number
  currency: string
  currencySymbol?: string
  pendingEscrow: number
  totalEarnedToDate: number
  totalPenalties?: number
  hourlyRateEquivalent?: number
  sprintBonusEarned?: number
  lastPayoutDate?: string
  nextScheduledPayout?: string
  totalSpendings?: number
}

export type TransactionType =
  | 'milestone_payout'
  | 'penalty'
  | 'bonus'
  | 'advance_disbursement'
  | 'budget_allocation'
  | 'escrow_hold'
  | 'payout'
  | string

export interface Transaction {
  id: string
  userId: string
  projectId?: string
  milestoneId?: string
  amount: number
  type: TransactionType
  description: string
  date: string
  status: 'completed' | 'deducted' | 'pending' | 'allocated' | string
  reason?: string
}

// --- PERFORMANCE ---
export interface PerformanceReward {
  id: string
  title: string
  description: string
  date: string
  icon: string
  bonusValue?: string
  points?: number | string
}

export interface PerformanceRecord {
  userId: string
  overallScore: number
  completionRate: number
  onTimeDeliveryRate: number
  codeQualityScore?: number
  peerReviewScore?: number
  velocityPointsSprint3?: number
  targetVelocityPoints?: number
  sprintWeek?: number
  recentRewards: PerformanceReward[]
  strengths?: string[]
  improvementAreas?: string[]
}

// --- REPORTS & SUBMISSIONS ---
export type ReportType = 'project_submission' | 'complaint' | 'pm_report' | string

export interface Report {
  id: string
  userId: string
  teamId?: string
  type: ReportType
  title: string
  description: string
  date: string
  status: 'under_review' | 'approved' | 'rejected' | 'under_investigation' | 'forwarded_to_c_level' | string
  submittedAt: string
  docsUrl?: string
  feedback?: string
  complainTo?: string
  category?: string
  recipient?: string
  projectId?: string
  forwardedTo?: string
  forwardedBy?: string
  forwardedAt?: string
  pmEndorsement?: string
}

// --- ANNOUNCEMENTS & NOTIFICATIONS ---
export interface Announcement {
  id: string
  title: string
  content: string
  authorId: string
  authorName?: string
  category: 'pm' | 'company' | 'critical' | string
  priority: 'urgent' | 'normal' | 'low' | string
  date: string
  read: boolean
  pinned?: boolean
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: 'comment' | 'pr' | 'financial' | 'deadline' | 'milestone' | string
  timestamp: string
  createdAt: string
  read: boolean
  entityType?: 'task' | 'wallet' | 'milestone' | 'project' | string
  entityId?: string
}

// --- ACTIVITY LOGS ---
export interface ActivityLog {
  id: string
  userId: string
  action: string
  entityType: string
  entityId: string
  entityTitle: string
  description: string
  timestamp: string
  category: 'task' | 'comment' | 'git' | 'financial' | 'milestone' | string
  badgeColor?: string
}

// --- MILESTONES & REPOSITORIES ---
export interface Milestone {
  id: string
  projectId: string
  sprintWeek?: number
  title: string
  dueDate: string
  status: 'completed' | 'active' | 'pending' | string
  progress: number
  deliverablesCount?: number
  payoutAmount?: number
}

export interface CommitInfo {
  hash: string
  message: string
  author: string
  timestamp: string
}

export interface Repository {
  id: string
  projectId: string
  name: string
  url: string
  defaultBranch: string
  activeBranch?: string
  openPRsCount: number
  lastCommit: CommitInfo
  stars: number
  forks: number
  openIssues: number
}

// --- SEED DATA & RESOLVERS ---
export interface SeedData {
  roles: Role[]
  users: User[]
  teams: Team[]
  projects: Project[]
  tasks: Task[]
  comments: TaskComment[]
  attachments: TaskAttachment[]
  wallets: Wallet[]
  transactions: Transaction[]
  performanceRecords: PerformanceRecord[]
  reports: Report[]
  announcements: Announcement[]
  notifications: Notification[]
  activityLogs: ActivityLog[]
  milestones: Milestone[]
  repositories: Repository[]
}

export interface DataResolvers {
  getUser: (id: string) => User | null
  getProject: (id: string) => Project | null
  getTeam: (id: string) => Team | null
  getMilestone: (id: string) => Milestone | null
  getRepo: (id: string) => Repository | null
  getDeveloperTasks: (devId?: string) => Task[]
  getDeveloperProjects: (devId?: string) => Project[]
  getDeveloperWallet: (devId?: string) => Wallet | null
  getDeveloperPerformance: (devId?: string) => PerformanceRecord | null
  getDeveloperTransactions: (devId?: string) => Transaction[]
}

// --- NAVIGATION CONFIG ---
export interface NavItem {
  id: string
  label: string
  icon: ComponentType<{ className?: string }>
  isImplemented: boolean
}

export interface RoleNavigation {
  roleId: string
  roleLabel: string
  items: NavItem[]
}

// --- TOAST ---
export interface ToastMessage {
  msg: string
  type: 'info' | 'success' | 'error' | 'warning'
  id: number
}

// --- RELATIVE DEADLINE INFO ---
export interface RelativeDeadline {
  label: string
  isOverdue: boolean
  isUrgent: boolean
  days: number
  badgeColor?: string
}

// --- ENRICHED TASK ---
export interface EnrichedTask extends Task {
  deadlineInfo: RelativeDeadline
  projectName?: string
  projectCode?: string
  project?: Project | null
  assignee?: User | null
  creator?: User | null
}

// --- ENRICHED PROJECT ---
export interface EnrichedProject extends Project {
  repo?: Repository | null
  pm?: User | null
  tasksCount?: number
  totalTasksCount?: number
  completedTasksCount?: number
  inReviewTasksCount?: number
  assignedDevs?: User[]
}

// --- DEVELOPER WORKLOAD ---
export interface DeveloperWorkload extends User {
  totalTasks: number
  activeTasks: number
  completedTasks: number
  todoTasks: number
  blockedTasks: number
  inReviewTasks?: number
  tasks: EnrichedTask[]
  performance: PerformanceRecord
  isOverloaded: boolean
}

// --- APP CONTEXT TYPE ---
export interface AppContextType {
  data: SeedData
  currentRole: RoleId
  currentDevId: string
  currentPmId: string
  currentRoute: string
  theme: string
  isSidebarCollapsed: boolean
  searchQuery: string
  isSearchOpen: boolean
  selectedTaskModal: Task | EnrichedTask | null
  selectedProjectModal: Project | EnrichedProject | null
  toastMessage: ToastMessage | null
  currentUser: User | null
  currentTeam: Team | null
  resolvers: DataResolvers

  setRole: (roleId: string) => void
  setPmId: (pmId: string) => void
  setRoute: (routeId: string) => void
  toggleTheme: () => void
  toggleSidebar: () => void
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  setIsSearchOpen: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedTaskModal: React.Dispatch<React.SetStateAction<Task | EnrichedTask | null>>
  setSelectedProjectModal: React.Dispatch<React.SetStateAction<Project | EnrichedProject | null>>
  updateTaskStatus: (taskId: string, newStatus: TaskStatus) => boolean
  updateUserProfile: (updatedFields: Partial<User>) => void
  addSubmission: (submission: Report) => void
  addComplaint: (complaint: Report) => void
  markNotificationRead: (notificationId: string) => void
  markAllNotificationsRead: () => void
  resetDemoData: () => void
  showToast: (msg: string, type?: 'info' | 'success' | 'error' | 'warning') => void

  createTask: (taskData: {
    title: string
    description?: string
    projectId: string
    assigneeId: string
    priority?: TaskPriority
    dueDate?: string
    estimatedHours?: number | string
    tags?: string[]
    checklist?: TaskChecklistItem[]
  }) => Task
  approveTask: (taskId: string, feedback?: string) => void
  rejectTask: (taskId: string, feedback: string) => void
  reassignTask: (taskId: string, newAssigneeId: string) => void
  allocateBudget: (allocation: {
    developerId: string
    projectId: string
    amount: number | string
    description?: string
    week?: number | string
  }) => void
  requestBudgetIncrease: (req: {
    projectId: string
    amount: number | string
    reason: string
  }) => void
  submitPmReport: (report: {
    category: string
    recipient: string
    title: string
    description: string
    projectId?: string
    docsUrl?: string
  }) => void
  updatePmTaskStatus: (taskId: string, newStatus: TaskStatus) => void
  forwardSubmissionToCLevel: (submissionId: string, recipient: string, endorsement: string) => void
  addProjectMilestone: (
    projectId: string,
    milestoneData: {
      title: string
      dueDate?: string
      status?: string
    }
  ) => void
  updateMilestoneStatus: (projectId: string, milestoneId: string, newStatus: string) => void
  updatePmProfile: (updatedFields: Partial<User>) => void
  updateComplaintStatus: (complaintId: string, newStatus: string, pmComment?: string) => void
}
