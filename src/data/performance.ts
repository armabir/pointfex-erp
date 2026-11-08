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
    attendanceRate: 98,
    satisfactionIndex: 4.8,
    performanceTier: 'top_performer',
    evaluationNotes: 'Exceptional technical depth in frontend and modular state systems. Dependable sprint execution.',
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
    attendanceRate: 99,
    satisfactionIndex: 4.9,
    performanceTier: 'top_performer',
    evaluationNotes: 'Outstanding team coordination, clear acceptance criteria, zero sprint blockers.',
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
  {
    userId: 'user_cto_01', // Dr. Arthur Sterling
    overallScore: 98,
    completionRate: 95,
    onTimeDeliveryRate: 97,
    codeQualityScore: 98,
    peerReviewScore: 4.98,
    velocityPointsSprint3: 240,
    targetVelocityPoints: 235,
    sprintWeek: 3,
    attendanceRate: 100,
    satisfactionIndex: 4.9,
    performanceTier: 'top_performer',
    recentRewards: [
      {
        id: 'rew_cto_01',
        title: 'Executive Architectural Vision',
        description: 'Awarded by CEO for modular service mesh topology delivering sub-10ms inter-service latency across all squads.',
        date: '2026-10-31',
        icon: 'Award',
        bonusValue: '$1,500',
      },
      {
        id: 'rew_cto_02',
        title: 'Zero High-Severity Security Regressions',
        description: 'Clean automated penetration test results and zero CVE regressions across 12 production repos.',
        date: '2026-10-25',
        icon: 'ShieldCheck',
        bonusValue: '$900',
      },
    ],
    strengths: ['Enterprise distributed architectures', 'Cross-squad engineering velocity', 'Zero-trust cryptographic governance'],
    improvementAreas: ['Continue mentoring mid-level engineers on microservice tracing'],
  },
  // Remaining PMs (user_pm_02 to user_pm_06)
  ...['user_pm_02', 'user_pm_03', 'user_pm_04', 'user_pm_05', 'user_pm_06'].map((id, idx) => ({
    userId: id,
    overallScore: 91 + (idx % 4),
    completionRate: 88 + (idx % 5),
    onTimeDeliveryRate: 90 + (idx % 6),
    codeQualityScore: 92,
    peerReviewScore: 4.75,
    velocityPointsSprint3: 38 + idx,
    targetVelocityPoints: 40,
    sprintWeek: 3,
    attendanceRate: 96 + (idx % 4),
    satisfactionIndex: 4.6 + (idx * 0.05),
    performanceTier: idx === 3 ? 'needs_support' : 'strong_contributor',
    recentRewards: [
      {
        id: `rew_pm_${idx + 3}`,
        title: 'Sprint Pacing Recognition',
        description: 'Consistently kept backlog refined and burn-down velocity on target.',
        date: '2026-10-28',
        icon: 'Award',
        bonusValue: '$350',
      },
    ],
    strengths: ['Scrum velocity tracking', 'Stakeholder communication'],
    improvementAreas: ['Proactive dependency management'],
  })),
  // Developers (user_dev_02 to user_dev_24)
  ...Array.from({ length: 23 }, (_, i) => {
    const num = String(i + 2).padStart(2, '0')
    const id = `user_dev_${num}`
    const score = 86 + ((i * 3) % 12)
    const tier = score >= 93 ? 'top_performer' : score >= 88 ? 'strong_contributor' : 'needs_support'
    return {
      userId: id,
      overallScore: score,
      completionRate: 84 + (i % 12),
      onTimeDeliveryRate: 87 + (i % 10),
      codeQualityScore: 89 + (i % 8),
      peerReviewScore: 4.6 + ((i % 4) * 0.1),
      velocityPointsSprint3: 24 + (i % 8),
      targetVelocityPoints: 28,
      sprintWeek: 3,
      attendanceRate: 94 + (i % 6),
      satisfactionIndex: 4.4 + ((i % 5) * 0.1),
      performanceTier: tier,
      recentRewards: [
        {
          id: `rew_dev_${num}`,
          title: 'Sprint Milestone Contributor',
          description: 'High-quality unit testing and feature delivery for active squad sprint.',
          date: '2026-10-27',
          icon: 'ShieldCheck',
          bonusValue: '$200',
        },
      ],
      strengths: ['Core stack implementation', 'Reliable pull request turnaround'],
      improvementAreas: ['Documentation depth'],
    }
  }),
]

