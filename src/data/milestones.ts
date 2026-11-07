import type { Milestone } from '../types'

export const MILESTONES: Milestone[] = [
  // Sprint Milestones for Project 1 (PulseFlow Analytics)
  {
    id: 'ms_01',
    projectId: 'proj_01',
    sprintWeek: 1,
    title: 'Phase 1: Architecture & UI Shell',
    dueDate: '2026-10-18',
    status: 'completed',
    progress: 100,
    deliverablesCount: 8,
    payoutAmount: 2400,
  },
  {
    id: 'ms_02',
    projectId: 'proj_01',
    sprintWeek: 2,
    title: 'Phase 2: Data Streams & Event Buffers',
    dueDate: '2026-10-25',
    status: 'completed',
    progress: 100,
    deliverablesCount: 12,
    payoutAmount: 3200,
  },
  {
    id: 'ms_03',
    projectId: 'proj_01',
    sprintWeek: 3,
    title: 'Phase 3: Interactive Dashboards & Telemetry',
    dueDate: '2026-11-06',
    status: 'active',
    progress: 68,
    deliverablesCount: 14,
    payoutAmount: 3800,
  },
  {
    id: 'ms_04',
    projectId: 'proj_01',
    sprintWeek: 4,
    title: 'Phase 4: Alerting Engine & Anomaly Detection',
    dueDate: '2026-11-13',
    status: 'pending',
    progress: 0,
    deliverablesCount: 10,
    payoutAmount: 3000,
  },
  {
    id: 'ms_05',
    projectId: 'proj_01',
    sprintWeek: 5,
    title: 'Phase 5: Performance Tuning, Load Tests & Handover',
    dueDate: '2026-11-20',
    status: 'pending',
    progress: 0,
    deliverablesCount: 8,
    payoutAmount: 4000,
  },

  // Project 2 (CloudMesh Gateway)
  {
    id: 'ms_06',
    projectId: 'proj_02',
    sprintWeek: 3,
    title: 'Phase 3: Route Orchestrator & Rate Limiter UI',
    dueDate: '2026-11-08',
    status: 'active',
    progress: 54,
    deliverablesCount: 10,
    payoutAmount: 3500,
  },
]

