import type { Wallet } from '../types'

export const WALLETS: Wallet[] = [
  {
    userId: 'user_dev_01',
    balance: 3850.00,
    currency: 'USD',
    currencySymbol: '$',
    pendingEscrow: 1250.00,
    totalEarnedToDate: 9600.00,
    totalPenalties: 250.00,
    hourlyRateEquivalent: 65.00,
    sprintBonusEarned: 600.00,
    lastPayoutDate: '2026-10-28',
    nextScheduledPayout: '2026-11-06',
  },
  // PM Wallets
  {
    userId: 'user_pm_01', // Sarah Jenkins
    balance: 5400.00,
    currency: 'USD',
    currencySymbol: '$',
    pendingEscrow: 2200.00,
    totalEarnedToDate: 14200.00,
    totalPenalties: 0.00,
    hourlyRateEquivalent: 85.00,
    sprintBonusEarned: 1200.00,
    totalSpendings: 250.00,
    lastPayoutDate: '2026-10-28',
    nextScheduledPayout: '2026-11-06',
  },
  {
    userId: 'user_pm_02', // Vikram Seth
    balance: 4900.00,
    currency: 'USD',
    currencySymbol: '$',
    pendingEscrow: 1800.00,
    totalEarnedToDate: 13500.00,
    totalPenalties: 50.00,
    hourlyRateEquivalent: 85.00,
    sprintBonusEarned: 950.00,
    totalSpendings: 180.00,
    lastPayoutDate: '2026-10-28',
    nextScheduledPayout: '2026-11-06',
  },
  // CTO Wallet
  {
    userId: 'user_cto_01', // Dr. Arthur Sterling
    balance: 9400.00,
    currency: 'USD',
    currencySymbol: '$',
    pendingEscrow: 3500.00,
    totalEarnedToDate: 26800.00,
    totalPenalties: 0.00,
    hourlyRateEquivalent: 125.00,
    sprintBonusEarned: 2400.00,
    totalSpendings: 450.00,
    lastPayoutDate: '2026-10-28',
    nextScheduledPayout: '2026-11-06',
  },
]

