
"use client"

import { useStore } from '@/store/useStore'
import { Send, Download, Tent, CreditCard, Gift, BookOpen, Clock, Activity, ArrowRight, ShoppingBag } from 'lucide-react'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function Home() {
  const user = useStore((state) => state.user)
  const transactions = useStore((state) => state.transactions)

  if (!user) return <div className="p-8 text-center text-granite-500">Cargando billetera...</div>

  return (
    <div className="pb-24 pt-6 px-6 flex flex-col gap-8 max-w-2xl mx-auto">

      {/* LEFT COLUMN (Header + Balance + Actions) */}
      <div className="md:col-span-12 lg:col-span-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full ring-4 ring-white shadow-lg bg-gold-200 flex items-center justify-center text-gold-700 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm text-berry-500 font-bold uppercase tracking-wider">Bienvenido</p>
              <h2 className="text-2xl font-black text-space-900">{user.full_name}</h2>
            </div>
          </div>
          <button className="text-space-400 hover:text-space-600 transition-colors bg-white p-2 rounded-full shadow-sm">
            <Activity className="w-6 h-6" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-berry-500 rounded-[2.5rem] p-8 text-center shadow-2xl shadow-indigo-300/40 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-300/30 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

          <div className="relative z-10">
            <p className="text-white/90 font-medium mb-4 uppercase tracking-widest text-xs">Saldo en sabadolares</p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl text-gold-200 font-bold">$</span>
              <h1 className="text-7xl font-black tracking-tighter text-white drop-shadow-lg">
                {user.balance.toLocaleString()}
              </h1>
            </div>
            <p className="text-white/80 font-medium bg-white/20 inline-block px-4 py-1 rounded-full text-sm backdrop-blur-sm border border-white/30">
              acumulados
            </p>
          </div>
        </div>


      </div>

      {/* Admin Actions (Visible only for admins) */}
      {user.role === 'admin' && (
        <div className="md:col-span-12 lg:col-span-8 flex flex-col gap-4">
          <h3 className="text-sm font-black text-granite-400 uppercase tracking-widest flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-berry-500">
            Acciones de Administrador
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/wallet/send"
              className="group bg-gradient-to-br from-berry-500 to-indigo-600 p-6 rounded-[2rem] flex items-center justify-between text-white shadow-xl shadow-berry-200/50 hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                  <Gift className="w-8 h-8 text-gold-200" />
                </div>
                <div>
                  <h4 className="font-bold text-xl uppercase tracking-tighter">Recompensar</h4>
                  <p className="text-white/80 text-sm">Envía sabadolares a usuarios</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowRight className="w-6 h-6" />
              </div>
            </Link>

            <Link
              href="/admin/market"
              className="group bg-gradient-to-br from-gold-400 to-rosewood-500 p-6 rounded-[2rem] flex items-center justify-between text-white shadow-xl shadow-gold-200/50 hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-xl uppercase tracking-tighter">Editar Market</h4>
                  <p className="text-white/80 text-sm">Gestiona los productos disponibles</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <ArrowRight className="w-6 h-6" />
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* RIGHT COLUMN (Activity Feed) */}
      <div className="md:col-span-12 lg:col-span-4 bg-white md:rounded-3xl p-4 md:p-6 md:shadow-lg md:border md:border-space-100 h-fit rounded-[2.5rem] ">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black text-space-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-berry-500" />
            Actividad
          </h3>
          <Link href="/activity" className="text-berry-600 text-sm font-bold hover:text-berry-700 bg-berry-50 px-3 py-1 rounded-full transition-colors">
            Ver todo
          </Link>
        </div>

        <div className="space-y-4">
          {transactions.map((tx) => {
            const isNegative = tx.type === 'transfer' || tx.type === 'redemption'

            // Helper to get icon based on description/type (simple heuristic)
            let Icon = Gift
            let iconBg = "bg-berry-100"
            let iconColor = "text-berry-600"

            if (tx.description.toLowerCase().includes('campamento')) {
              Icon = Tent
              iconBg = "bg-gold-100"
              iconColor = "text-gold-700"
            } else if (tx.type === 'transfer') {
              Icon = CreditCard
              iconBg = "bg-berry-100"
              iconColor = "text-berry-600"
            } else if (tx.description.toLowerCase().includes('liderazgo') || tx.description.toLowerCase().includes('clase')) {
              Icon = BookOpen
              iconBg = "bg-space-100"
              iconColor = "text-space-600"
            }

            return (
              <div key={tx.id} className="group bg-white hover:bg-space-50 hover:shadow-md rounded-2xl p-4 flex items-center justify-between transition-all duration-200 border border-transparent hover:border-space-100">
                <div className="flex items-center gap-4">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300", iconBg, iconColor)}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="">
                    <h4 className="font-bold text-space-800 text-sm mb-0.5">{tx.description}</h4>
                    <p className="text-xs text-space-400 font-medium">
                      {new Date(tx.created_at).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                <span className={cn("font-black text-lg", isNegative ? "text-berry-500" : "text-space-700")}>
                  {isNegative ? '-' : '+'}{tx.amount}
                </span>
              </div>
            )
          })}

          {transactions.length === 0 && (
            <div className="text-center py-10 text-space-400">
              <p>No hay actividad reciente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
