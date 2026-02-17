
"use client"

import { useState } from 'react'
import { ArrowLeft, User, Send as SendIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/store/useStore'

export default function SendPage() {
    const router = useRouter()
    const user = useStore((state) => state.user)
    const [amount, setAmount] = useState('')
    const [recipient, setRecipient] = useState('')

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        // Logic to update store/transact would go here
        alert(`Enviado ${amount} a ${recipient}`)
        router.push('/')
    }

    return (
        <div className="min-h-screen bg-granite-50 pb-24 md:p-0 md:bg-transparent">

            <div className="max-w-2xl mx-auto md:bg-white md:rounded-[2.5rem] md:shadow-2xl md:overflow-hidden md:mt-8">
                {/* Header */}
                <div className="bg-gradient-to-br from-berry-50 via-white to-gold-50 p-6 pt-8 md:p-10 rounded-b-3xl md:rounded-t-none relative overflow-hidden border-b-2 border-berry-100">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rosewood-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="flex items-center gap-4 mb-8 relative z-10">
                        <Link href="/" className="p-3 bg-berry-100 rounded-2xl hover:bg-berry-200 transition-colors text-berry-700">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <h1 className="text-2xl font-black tracking-tight text-space-900">Enviar Sabadolares</h1>
                    </div>

                    <div className="text-center pb-6 relative z-10">
                        <p className="text-berry-600 text-sm mb-2 font-bold uppercase tracking-widest">Saldo Disponible</p>
                        <p className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-berry-600 to-gold-600">
                            {user?.balance.toLocaleString()}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSend} className="p-6 md:p-10 space-y-8">
                    <div>
                        <label className="block text-sm font-bold text-granite-700 mb-3 ml-1 uppercase tracking-wide">Destinatario</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-granite-100 rounded-xl flex items-center justify-center text-granite-500 group-focus-within:bg-rosewood-100 group-focus-within:text-rosewood-600 transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Nombre o ID de usuario"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="w-full bg-white border-2 border-slate-100 rounded-3xl py-5 pl-16 pr-6 font-bold text-lg text-granite-800 focus:outline-none focus:border-rosewood-500 transition-colors shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-granite-700 mb-3 ml-1 uppercase tracking-wide">Monto a Enviar</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-granite-100 rounded-xl flex items-center justify-center text-granite-500 font-bold group-focus-within:bg-rosewood-100 group-focus-within:text-rosewood-600 transition-colors pointer-events-none">
                                $
                            </div>
                            <input
                                type="number"
                                placeholder="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-white border-2 border-slate-100 rounded-3xl py-5 pl-16 pr-6 font-mono text-3xl font-bold text-granite-900 focus:outline-none focus:border-rosewood-500 transition-colors shadow-sm"
                                required
                                min="1"
                                max={user?.balance}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-rosewood-600 hover:bg-rosewood-700 text-white font-bold py-6 rounded-3xl shadow-xl shadow-rosewood-500/30 flex items-center justify-center gap-3 transition-all hover:-translate-y-1 hover:shadow-2xl mt-4"
                    >
                        <div className="bg-white/20 p-1.5 rounded-lg">
                            <SendIcon className="w-5 h-5" />
                        </div>
                        <span className="text-lg">Confirmar Transferencia</span>
                    </button>
                </form>
            </div>
        </div>
    )
}
