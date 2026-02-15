
"use client"

import { useStore } from '@/store/useStore'
import { Send, Download, Tent, CreditCard, Gift, BookOpen, Clock, Activity } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function Home() {
  const user = useStore((state) => state.user)
  const transactions = useStore((state) => state.transactions)

  if (!user) return <div className="p-8 text-center text-granite-500">Cargando billetera...</div>

  return (
    <div className="pb-24 pt-6 px-6 space-y-8  max-w-6xl mx-auto">

      {/* LEFT COLUMN (Header + Balance + Actions) */}
      <div className="md:col-span-12 lg:col-span-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full ring-4 ring-white shadow-lg bg-orange-200 flex items-center justify-center text-orange-700 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm text-rosy-taupe-500 font-bold uppercase tracking-wider">Bienvenido</p>
              <h2 className="text-2xl font-black text-granite-900">{user.full_name}</h2>
            </div>
          </div>
          <button className="text-granite-400 hover:text-granite-600 transition-colors bg-white p-2 rounded-full shadow-sm">
            <Activity className="w-6 h-6" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-granite-800 to-granite-900 rounded-[2.5rem] p-8 text-center shadow-2xl shadow-granite-900/20 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-rosewood-500/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

          <div className="relative z-10">
            <p className="text-granite-300 font-medium mb-4 uppercase tracking-widest text-xs">Saldo de Actividades</p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl text-rosewood-400 font-bold">$</span>
              <h1 className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-granite-200">
                {user.balance.toLocaleString()}
              </h1>
            </div>
            <p className="text-granite-400 font-medium bg-granite-950/30 inline-block px-4 py-1 rounded-full text-sm backdrop-blur-sm border border-white/10">
              Puntos acumulados
            </p>
          </div>
        </div>


      </div>

      {/* RIGHT COLUMN (Activity Feed) */}
      <div className="md:col-span-12 lg:col-span-4 bg-rosewood-600 md:rounded-3xl md:p-6 md:shadow-lg md:border md:border-slate-100 h-fit">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-granite-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-rosewood-500" />
            Actividad
          </h3>
          <Link href="/activity" className="text-rosewood-600 text-sm font-bold hover:text-rosewood-700 bg-rosewood-50 px-3 py-1 rounded-full transition-colors">
            Ver todo
          </Link>
        </div>

        <div className="space-y-4">
          {transactions.map((tx) => {
            const isNegative = tx.type === 'transfer' || tx.type === 'redemption'

            // Helper to get icon based on description/type (simple heuristic)
            let Icon = Gift
            let iconBg = "bg-rosewood-100"
            let iconColor = "text-rosewood-600"

            if (tx.description.toLowerCase().includes('campamento')) {
              Icon = Tent
              iconBg = "bg-almond-silk-100"
              iconColor = "text-almond-silk-700"
            } else if (tx.type === 'transfer') {
              Icon = CreditCard
              iconBg = "bg-rosewood-100"
              iconColor = "text-rosewood-600"
            } else if (tx.description.toLowerCase().includes('liderazgo') || tx.description.toLowerCase().includes('clase')) {
              Icon = BookOpen
              iconBg = "bg-granite-100"
              iconColor = "text-granite-600"
            }

            return (
              <div key={tx.id} className="group bg-rosewood-600 hover:bg-white hover:shadow-md rounded-2xl p-4 flex items-center justify-between transition-all duration-200 border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300", iconBg, iconColor)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-granite-800 text-sm mb-0.5">{tx.description}</h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {new Date(tx.created_at).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                <span className={cn("font-black text-lg", isNegative ? "text-rosewood-500" : "text-granite-700")}>
                  {isNegative ? '-' : '+'}{tx.amount}
                </span>
              </div>
            )
          })}

          {transactions.length === 0 && (
            <div className="text-center py-10 text-slate-400">
              <p>No hay actividad reciente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
