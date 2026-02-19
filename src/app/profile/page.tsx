
"use client"

import { useStore } from '@/store/useStore'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LogOut, Home, Hash } from 'lucide-react'


export default function ProfilePage() {
    const router = useRouter()
    const user = useStore((state) => state.user)
    const logout = useStore((state) => state.logout)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        logout()
        router.replace('/auth')
    }

    if (!user) return null

    return (
        <div className="pb-24 pt-6 px-6 md:p-10 max-w-2xl mx-auto">
            {/* Profile Card */}
            <div className="mb-8">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-space-200/50 border border-space-100 flex flex-col items-center text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-100 to-berry-100 z-0"></div>

                    <div className="w-32 h-32 rounded-full ring-8 ring-white shadow-xl bg-gold-100 mb-6 overflow-hidden relative z-10 mx-auto">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl font-black text-space-900 mb-1">{user.full_name}</h2>
                        <p className="text-berry-500 font-bold bg-berry-50 px-4 py-1 rounded-full inline-block">@{user.username || 'usuario'}</p>

                        <div className="mt-8 grid grid-cols-1 gap-4 w-full">
                            <div className="bg-space-50 p-4 rounded-2xl flex items-center justify-between">
                                <div className="text-left">
                                    <p className="text-space-400 text-xs font-bold uppercase tracking-wider">Iglesia</p>
                                    <p className="text-space-800 font-bold">{user.church?.name || 'No vinculada'}</p>
                                </div>
                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                    <Home className="w-5 h-5 text-indigo-500" />
                                </div>
                            </div>
                            <div className="bg-space-50 p-4 rounded-2xl flex items-center justify-between border-2 border-dashed border-indigo-100">
                                <div className="text-left">
                                    <p className="text-space-400 text-xs font-bold uppercase tracking-wider">Código de Invitación</p>
                                    <p className="text-space-800 font-mono text-xl font-black tracking-widest">{user.church?.invite_code || '-----'}</p>
                                </div>
                                <div className="bg-indigo-500 p-2 rounded-lg shadow-md text-white">
                                    <Hash className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <button onClick={handleLogout} className="w-full bg-berry-50 p-5 rounded-3xl flex items-center justify-center gap-4 hover:bg-berry-100 transition-colors group shadow-sm border border-berry-100">
                <div className="w-10 h-10 rounded-full bg-berry-100 flex items-center justify-center text-berry-600 group-hover:scale-110 transition-transform">
                    <LogOut className="w-5 h-5" />
                </div>
                <span className="font-bold text-berry-700 text-lg">Cerrar Sesión</span>
            </button>
        </div>
    )
}
