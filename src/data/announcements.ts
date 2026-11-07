import type { Announcement } from '../types'

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_01',
    title: 'Sprint 3 Mid-Sprint Demo & Code Freeze Schedule',
    content: 'All teams (Teams 1–6) are scheduled for their Sprint 3 milestone reviews this Friday at 3:00 PM EST. Please ensure PRs are in review by Thursday 6:00 PM.',
    authorId: 'user_pm_01', // Sarah Jenkins (PM)
    authorName: 'Sarah Jenkins (PM)',
    category: 'pm',
    priority: 'urgent',
    date: '2026-11-03',
    read: false,
    pinned: true,
  },
  {
    id: 'ann_02',
    title: 'Company All-Hands: Q4 Roadmap & Simulation Milestones',
    content: 'CEO Victoria Sterling-Fox will host a 30-minute company all-hands covering our simulated 5-week client roadmap, sprint rewards, and company-wide velocity.',
    authorId: 'user_ceo_01',
    authorName: 'Victoria Sterling-Fox (CEO)',
    category: 'company',
    priority: 'normal',
    date: '2026-11-02',
    read: false,
    pinned: false,
  },
  {
    id: 'ann_03',
    title: 'Security Advisory: Enforcing Strict CSP & NPM Lockfile Audits',
    content: 'CTO Office: All projects must upgrade packages to patched versions and ensure nonces are configured for inline script tags.',
    authorId: 'user_cto_01',
    authorName: 'Dr. Arthur Sterling (CTO)',
    category: 'critical',
    priority: 'urgent',
    date: '2026-11-01',
    read: true,
    pinned: false,
  },
  {
    id: 'ann_04',
    title: 'Virtual Wallet Milestone Payouts Disbursement Complete',
    content: 'CFO Office: Sprint 2 milestone bonuses and base compensation have been credited to developer virtual wallets. Review your statements in Earnings.',
    authorId: 'user_cfo_01',
    authorName: 'Vincent Gallagher (CFO)',
    category: 'company',
    priority: 'normal',
    date: '2026-10-29',
    read: true,
    pinned: false,
  },
]

