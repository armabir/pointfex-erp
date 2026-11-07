import type { PerformanceRecord } from '../types'

export const PERFORMANCE_RECORDS: PerformanceRecord[] = [
  {
    userId: 'user_dev_01',
    overallScore: 94, // out of 100
    completionRate: 88, // %
    onTimeDeliveryRate: 96, // %
    codeQualityScore: 95, // %
    peerReviewScore: 4.9, // out of 5.0
    velocityPointsSprint3: 28,
    targetVelocityPoints: 30,
    sprintWeek: 3,
    recentRewards: [
      {
        id: 'rew_01',
        title: 'Sprint 2 MVP: Architecture Excellence',
        description: 'Awarded by CTO Arthur Sterling for ultra-fast canvas latency waterfall implementation.',
        date: '2026-10-29',
        icon: 'Award',
        bonusValue: '$300',
      },
      {
        id: 'rew_02',
        title: 'Zero Regression Badge',
        description: 'Zero Sev-1/Sev-2 regressions shipped during Sprint 2 deployment.',
        date: '2026-10-26',
        icon: 'ShieldCheck',
        bonusValue: '$150',
      },
      {
        id: 'rew_03',
        title: 'Top Code Reviewer',
        description: 'Completed 18 thorough pull request reviews across Team 1 and Team 2.',
        date: '2026-10-22',
        icon: 'GitPullRequest',
        bonusValue: '$150',
      },
    ],
    strengths: ['Canvas / WebGL optimization', 'Modular CSS & Tailwind', 'State machine design'],
    improvementAreas: ['Coordinate earlier with DevOps on security header deployment'],
  },
  {
    userId: 'user_pm_01', // Sarah Jenkins
    overallScore: 96,
    completionRate: 92,
    onTimeDeliveryRate: 98,
    codeQualityScore: 94,
    peerReviewScore: 4.95,
    velocityPointsSprint3: 42,
    targetVelocityPoints: 40,
    sprintWeek: 3,
    recentRewards: [
      {
        id: 'rew_pm_01',
        title: 'Outstanding Agile Delivery: Sprint 2',
        description: 'Awarded by CTO & CEO for leading Team 1 to 100% on-time milestone delivery with zero blockers.',
        date: '2026-10-30',
        icon: 'Award',
        bonusValue: '$600',
      },
      {
        id: 'rew_pm_02',
        title: 'Budget Discipline Accolade',
        description: 'Delivered Phase 2 telemetry deliverables 8% under approved project budget forecast.',
        date: '2026-10-26',
        icon: 'ShieldCheck',
        bonusValue: '$300',
      },
    ],
    strengths: ['Cross-functional coordination', 'Risk mitigation', 'Milestone pacing'],
    improvementAreas: ['Earlier documentation synchronization with QA squads'],
  },
]

