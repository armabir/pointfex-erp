import React from 'react'
import { Card } from '../../components/common/Card.jsx'
import { StatusPill } from '../../components/common/StatusPill.jsx'
import { useDeveloperData } from '../../hooks/useDeveloperData.js'
import { formatCurrency, formatDate } from '../../utils/formatters.js'
import { Wallet, Clock, ShieldCheck } from 'lucide-react'

export function DeveloperEarningsPage() {
  const { wallet, transactions } = useDeveloperData()

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900 font-display">
          Earnings & Virtual Wallet
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Milestone payouts and sprint balances
        </p>
      </div>

      {/* 3 Soft Pastel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#fff8f2] border border-amber-100/80 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Available Balance</span>
            <div className="p-2 rounded-xl bg-amber-100/80 text-amber-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-slate-900">
            {formatCurrency(wallet.balance)}
          </div>
        </div>

        <div className="bg-[#f0fdf9] border border-emerald-100/80 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Milestone Escrow</span>
            <div className="p-2 rounded-xl bg-emerald-100/80 text-emerald-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-slate-900">
            {formatCurrency(wallet.pendingEscrow)}
          </div>
        </div>

        <div className="bg-[#f2f7ff] border border-sky-100/80 rounded-3xl p-5 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Earned</span>
            <div className="p-2 rounded-xl bg-sky-100/80 text-sky-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-display text-slate-900">
            {formatCurrency(wallet.totalEarnedToDate)}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <Card title="Transactions" icon={Wallet} noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 bg-slate-50/50">
                <th className="py-3 px-5 font-medium">Description</th>
                <th className="py-3 px-3 font-medium">Date</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-5 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-medium text-slate-800">
                    {tx.description}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-400">
                    {formatDate(tx.date, 'short')}
                  </td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <StatusPill status={tx.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap text-right font-medium text-emerald-600">
                    +{formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
