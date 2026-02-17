"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import { LogIn, UserPlus, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const setUser = useStore((state) => state.setUser)

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (error) throw error

                // Fetch profile
                if (data.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', data.user.id)
                        .single()

                    if (profile) {
                        setUser(profile as any)
                        router.push('/')
                    } else {
                        // Retry shortly if trigger hasn't finished (should be fast though)
                        const { data: retryProfile } = await supabase
                            .from('profiles')
                            .select('*')
                            .eq('id', data.user.id)
                            .single()
                        if (retryProfile) setUser(retryProfile as any)
                        router.push('/')
                    }
                }
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName.replace(/\s/g, '')}`
                        }
                    }
                })

                if (error) throw error

                // Ideally show check email screen, but for dev we might auto-confirm if enabled or handle session
                if (data.session) {
                    router.push('/')
                } else {
                    setError('Revisa tu email para confirmar tu cuenta.')
                    setLoading(false)
                    return
                }
            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error')
        } finally {
            if (!error?.includes('email')) setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-eggshell-100 via-white to-eggshell-200 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-berry-200/30 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-eggshell-300 p-8 rounded-3xl relative z-10 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-[-50px]">
                        <Image
                            src="/logo.png"
                            alt="SABAGO"
                            width={180}
                            height={50}
                            className="h-50 w-auto"
                            priority
                        />
                    </div>
                    <p className="text-space-500 text-sm">
                        {isLogin ? 'Bienvenido de vuelta, explorador' : 'Únete a la aventura'}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {!isLogin && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-2 mb-4">
                                    <label className="text-xs font-medium text-space-700 ml-1">Nombre Completo</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-space-400">
                                            <UserPlus className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Tu nombre"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full bg-eggshell-100 border border-eggshell-300 rounded-xl py-3 pl-10 pr-4 text-space-900 placeholder:text-space-400 focus:outline-none focus:ring-2 focus:ring-berry-500 transition-all"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-space-700 ml-1">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-space-400">
                                <Mail className="h-4 w-4" />
                            </div>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-eggshell-100 border border-eggshell-300 rounded-xl py-3 pl-10 pr-4 text-space-900 placeholder:text-space-400 focus:outline-none focus:ring-2 focus:ring-berry-500 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-space-700 ml-1">Contraseña</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-space-400">
                                <Lock className="h-4 w-4" />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-eggshell-100 border border-eggshell-300 rounded-xl py-3 pl-10 pr-4 text-space-900 placeholder:text-space-400 focus:outline-none focus:ring-2 focus:ring-berry-500 transition-all"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#d90368] hover:bg-[#ae0253] text-white font-medium py-3 rounded-xl shadow-lg shadow-berry-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                {isLogin ? 'Entrar' : 'Crear Cuenta'}
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsLogin(!isLogin)
                            setError(null)
                        }}
                        className="text-space-600 hover:text-space-900 text-sm transition-colors"
                    >
                        {isLogin ? (
                            <>No tienes cuenta? <span className="text-berry-400 font-medium">Regístrate</span></>
                        ) : (
                            <>Ya tienes cuenta? <span className="text-berry-400 font-medium">Inicia Sesión</span></>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
