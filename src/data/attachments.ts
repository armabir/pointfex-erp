import type { TaskAttachment } from '../types'

export const TASK_ATTACHMENTS: TaskAttachment[] = [
  {
    id: 'att_01',
    taskId: 'task_01',
    name: 'pulseflow-waterfall-spec-v2.pdf',
    size: '1.4 MB',
    type: 'pdf',
    uploadedById: 'user_pm_01',
    uploadedAt: '2026-10-30T10:15:00Z',
  },
  {
    id: 'att_02',
    taskId: 'task_01',
    name: 'telemetry-trace-sample.json',
    size: '420 KB',
    type: 'json',
    uploadedById: 'user_dev_01',
    uploadedAt: '2026-11-01T09:20:00Z',
  },
  {
    id: 'att_03',
    taskId: 'task_03',
    name: 'cloudmesh-virtualized-table-mockup.fig',
    size: '3.2 MB',
    type: 'figma',
    uploadedById: 'user_dev_03',
    uploadedAt: '2026-11-01T15:00:00Z',
  },
  {
    id: 'att_04',
    taskId: 'task_12',
    name: 'csp-violation-report-staging.log',
    size: '88 KB',
    type: 'log',
    uploadedById: 'user_dev_04',
    uploadedAt: '2026-11-02T08:45:00Z',
  },
]

