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
  // CFO Wallet
  {
    userId: 'user_cfo_01', // Vincent Gallagher
    balance: 12500.00,
    currency: 'USD',
    currencySymbol: '$',
    pendingEscrow: 4000.00,
    totalEarnedToDate: 31200.00,
    totalPenalties: 0.00,
    hourlyRateEquivalent: 130.00,
    sprintBonusEarned: 3000.00,
    totalSpendings: 500.00,
    lastPayoutDate: '2026-10-28',
    nextScheduledPayout: '2026-11-06',
  },
  // CHRO / CPO Wallet
  {
    userId: 'user_cpo_01', // Amara Okafor
    balance: 11800.00,
    currency: 'USD',
    currencySymbol: '$',
    pendingEscrow: 3800.00,
    totalEarnedToDate: 29500.00,
    totalPenalties: 0.00,
    hourlyRateEquivalent: 125.00,
    sprintBonusEarned: 2800.00,
    totalSpendings: 350.00,
    lastPayoutDate: '2026-10-28',
    nextScheduledPayout: '2026-11-06',
  },
  // CEO Wallet
  {
    userId: 'user_ceo_01', // Victoria Sterling-Fox
    balance: 34000.00,
    currency: 'USD',
    currencySymbol: '$',
    pendingEscrow: 8500.00,
    totalEarnedToDate: 78000.00,
    totalPenalties: 0.00,
    hourlyRateEquivalent: 220.00,
    sprintBonusEarned: 8000.00,
    totalSpendings: 1200.00,
    lastPayoutDate: '2026-10-28',
    nextScheduledPayout: '2026-11-06',
  },
  // Remaining PMs (user_pm_03 to user_pm_06)
  ...['user_pm_03', 'user_pm_04', 'user_pm_05', 'user_pm_06'].map((id, idx) => ({
    userId: id,
    balance: 4800.00 + idx * 250,
    currency: 'USD',
    currencySymbol: '$',
    pendingEscrow: 1600.00,
    totalEarnedToDate: 13000.00 + idx * 400,
    totalPenalties: 0.00,
    hourlyRateEquivalent: 85.00,
    sprintBonusEarned: 900.00,
    totalSpendings: 150.00,
    lastPayoutDate: '2026-10-28',
    nextScheduledPayout: '2026-11-06',
  })),
  // Developers (user_dev_02 to user_dev_24)
  ...Array.from({ length: 23 }, (_, i) => {
    const num = String(i + 2).padStart(2, '0')
    const id = `user_dev_${num}`
    return {
      userId: id,
      balance: 3200.00 + (i % 5) * 200,
      currency: 'USD',
      currencySymbol: '$',
      pendingEscrow: 1100.00,
      totalEarnedToDate: 8400.00 + (i % 4) * 350,
      totalPenalties: (i % 6 === 0) ? 100.00 : 0.00,
      hourlyRateEquivalent: 60.00,
      sprintBonusEarned: 500.00,
      totalSpendings: 200.00,
      lastPayoutDate: '2026-10-28',
      nextScheduledPayout: '2026-11-06',
    }
  }),
]

