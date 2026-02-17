
"use client"

import { useStore } from '@/store/useStore'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User, Settings, LogOut, Bell, HelpCircle, Shield, CreditCard, ChevronRight } from 'lucide-react'

export default function ProfilePage() {
    const router = useRouter()
    const user = useStore((state) => state.user)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.replace('/auth')
    }

    if (!user) return null

    return (
        <div className="pb-24 pt-6 px-6 md:p-0 max-w-4xl mx-auto">
            <div className="md:grid md:grid-cols-12 md:gap-10">

                {/* Profile Card */}
                <div className="md:col-span-5 mb-8 md:mb-0">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-granite-100 to-rosy-taupe-100 z-0"></div>

                        <div className="w-32 h-32 rounded-full ring-8 ring-white shadow-xl bg-orange-100 mb-6 overflow-hidden relative z-10 mx-auto">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-2xl font-black text-granite-900 mb-1">{user.full_name}</h2>
                            <p className="text-rosewood-500 font-bold bg-rosewood-50 px-4 py-1 rounded-full inline-block">@{user.username || 'usuario'}</p>

                            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-slate-400 text-xs font-bold uppercase">Clase</p>
                                    <p className="text-granite-800 font-bold">Guía Mayor</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-slate-400 text-xs font-bold uppercase">Club</p>
                                    <p className="text-granite-800 font-bold">Orion</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="md:col-span-7 space-y-4">
                    <h2 className="text-xl font-black text-granite-800 mb-6 hidden md:block">Configuración</h2>

                    <div className="space-y-4">
                        {[
                            { icon: Settings, label: 'Configuración de Cuenta', desc: 'Correo, contraseña, avatar' },
                            { icon: Bell, label: 'Notificaciones', desc: 'Alertas de premios y transferencias' },
                            { icon: Shield, label: 'Privacidad y Seguridad', desc: 'PIN, biometría' },
                            { icon: HelpCircle, label: 'Ayuda y Soporte', desc: 'FAQ, contacto' },
                        ].map((item, idx) => (
                            <button key={idx} className="w-full bg-white p-4 rounded-3xl flex items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 group text-left">
                                <div className="w-12 h-12 rounded-2xl bg-granite-50 flex items-center justify-center text-granite-600 group-hover:bg-granite-900 group-hover:text-white transition-colors">
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <span className="block font-bold text-granite-800 text-lg">{item.label}</span>
                                    <span className="block text-slate-400 text-sm">{item.desc}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-granite-800" />
                            </button>
                        ))}
                    </div>

                    <button onClick={handleLogout} className="w-full bg-rosewood-50 p-5 rounded-3xl flex items-center gap-4 hover:bg-rosewood-100 transition-colors mt-8 group">
                        <div className="w-10 h-10 rounded-full bg-rosewood-100 flex items-center justify-center text-rosewood-600 group-hover:scale-110 transition-transform">
                            <LogOut className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-rosewood-700 text-lg">Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
