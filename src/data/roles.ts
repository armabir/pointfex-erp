import type { Role } from '../types'

export const ROLES: Record<string, Role> = {
  DEVELOPER: {
    id: 'developer',
    name: 'Developer',
    badge: 'Dev Workspace',
    description: 'Execute tasks, submit sprint deliverables, track performance, and report to PM.',
    isImplemented: true,
  },
  PM: {
    id: 'pm',
    name: 'Project Manager (PM)',
    badge: 'Management',
    description: 'Manage sprints, allocate tasks to 4-dev teams, review deliverables, and approve milestones.',
    isImplemented: true,
  },
  CTO: {
    id: 'cto',
    name: 'Chief Technology Officer (CTO)',
    badge: 'Executive',
    description: 'Oversee architectural standards, cross-team tech stacks, code quality, and engineering velocity.',
    isImplemented: false,
  },
  CPO: {
    id: 'cpo',
    name: 'Chief People Officer (CPO)',
    badge: 'Executive',
    description: 'Team allocations, dev capacity planning, developer satisfaction, and performance grading.',
    isImplemented: false,
  },
  CFO: {
    id: 'cfo',
    name: 'Chief Financial Officer (CFO)',
    badge: 'Executive',
    description: 'Sprint budgets, project escrow balances, virtual wallets, and payroll disbursements.',
    isImplemented: false,
  },
  CEO: {
    id: 'ceo',
    name: 'Chief Executive Officer (CEO)',
    badge: 'Executive',
    description: 'High-level business KPIs, client delivery timelines, company growth, and global health.',
    isImplemented: false,
  },
}

export const ROLE_LIST: Role[] = Object.values(ROLES)

