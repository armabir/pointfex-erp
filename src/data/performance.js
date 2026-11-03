export const PERFORMANCE_RECORDS = [
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
]

