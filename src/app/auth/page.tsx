"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'
import { LogIn, UserPlus, Mail, Lock, Loader2, ArrowRight, Home, Hash, CheckCircle2 } from 'lucide-react'

type AuthStep = 'login' | 'has-code-query' | 'enter-code' | 'register-details' | 'success'

export default function AuthPage() {
    const [step, setStep] = useState<AuthStep>('login')
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [churchName, setChurchName] = useState('')
    const [inviteCode, setInviteCode] = useState('')
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const setUser = useStore((state) => state.setUser)

    const generateInviteCode = () => {
        return Math.floor(10000 + Math.random() * 90000).toString()
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (step === 'login') {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })

                if (error) throw error

                if (data.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', data.user.id)
                        .single()

                    if (profile) {
                        setUser(profile as any)
                        router.push('/')
                    }
                }
            } else {
                // Registration Logic
                const signUpData: any = {
                    full_name: fullName,
                    avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName.replace(/\s/g, '')}`,
                }

                if (churchName) {
                    // Creating new church
                    signUpData.church_name = churchName
                    signUpData.generated_invite_code = generateInviteCode()
                } else {
                    // Joining existing church
                    signUpData.invite_code = inviteCode
                }

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: signUpData
                    }
                })

                if (error) throw error

                // Transition to success screen even if email confirmation is required (no session)
                setStep('success')

            }
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error')
        } finally {
            setLoading(false)
        }
    }

    const renderHeader = () => {
        if (step === 'success') return null

        let title = "Bienvenido"
        let subtitle = "Acceso a Sabago"

        if (step === 'login') {
            title = "¡Hola de nuevo!"
            subtitle = "Ingresa para continuar"
        } else {
            title = "Únete a Sabago"
            subtitle = "Completa tu registro"
        }


        return (
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
                <h2 className="text-2xl font-bold text-space-900 mt-2">{title}</h2>
                <p className="text-space-500 text-sm">{subtitle}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-eggshell-100 via-white to-eggshell-200 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-berry-200/30 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-eggshell-300 p-8 rounded-3xl relative z-10 shadow-2xl"
            >
                {renderHeader()}

                <AnimatePresence mode="wait">
                    {step === 'login' && (
                        <motion.form
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleAuth}
                            className="space-y-4"
                        >
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
                                        className="w-full bg-eggshell-100 border border-eggshell-300 rounded-xl py-3 pl-10 pr-4 text-space-900 focus:outline-none focus:ring-2 focus:ring-berry-500 transition-all"
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
                                        className="w-full bg-eggshell-100 border border-eggshell-300 rounded-xl py-3 pl-10 pr-4 text-space-900 focus:outline-none focus:ring-2 focus:ring-berry-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#d90368] hover:bg-[#ae0253] text-white font-medium py-3 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Entrar <ArrowRight className="h-4 w-4" /></>}
                            </button>

                            <p className="text-center text-sm text-space-600">
                                ¿No tienes cuenta? <button type="button" onClick={() => setStep('has-code-query')} className="text-berry-500 font-bold">Regístrate</button>
                            </p>
                        </motion.form>
                    )}

                    {step === 'has-code-query' && (
                        <motion.div
                            key="query"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6 text-center"
                        >
                            <h3 className="text-lg font-semibold text-space-800">¿Tienes el código de tu iglesia?</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => setStep('enter-code')}
                                    className="p-4 bg-eggshell-100 border border-eggshell-300 rounded-2xl hover:border-berry-500 hover:bg-berry-50 transition-all text-left group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-berry-500 group-hover:text-white transition-colors">
                                            <Hash className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-space-900">Sí, tengo un código</p>
                                            <p className="text-xs text-space-500">Únete a una iglesia existente</p>
                                        </div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => {
                                        setInviteCode('')
                                        setStep('register-details')
                                    }}
                                    className="p-4 bg-eggshell-100 border border-eggshell-300 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-lg shadow-sm group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                            <Home className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-space-900">No tengo un código</p>
                                            <p className="text-xs text-space-500">Registra tu iglesia y sé el admin</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                            <button onClick={() => setStep('login')} className="text-sm text-space-500 hover:text-space-800 underline">Volver al login</button>
                        </motion.div>
                    )}

                    {step === 'enter-code' && (
                        <motion.div
                            key="enter-code"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-space-700 ml-1">Código de la Iglesia</label>
                                <input
                                    type="text"
                                    placeholder="Ej: 12345"
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                                    className="w-full bg-eggshell-100 border border-eggshell-300 rounded-xl py-4 text-center text-3xl font-mono tracking-widest text-space-900 focus:outline-none focus:ring-2 focus:ring-berry-500 transition-all"
                                />
                                <p className="text-[10px] text-space-400 text-center uppercase tracking-widest">Pide el código al administrador de tu iglesia</p>
                            </div>
                            <button
                                disabled={inviteCode.length < 5}
                                onClick={() => setStep('register-details')}
                                className="w-full bg-berry-500 hover:bg-berry-600 disabled:opacity-50 disabled:grayscale text-white font-bold py-3 rounded-xl transition-all shadow-lg"
                            >
                                Enviar Código
                            </button>
                            <button onClick={() => setStep('has-code-query')} className="w-full text-sm text-space-500 py-2">Atrás</button>
                        </motion.div>
                    )}

                    {step === 'register-details' && (
                        <motion.form
                            key="details"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleAuth}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-space-400 uppercase tracking-wider ml-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        placeholder="Tu nombre"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-eggshell-100 border border-eggshell-300 rounded-xl py-2 px-4 text-space-900 focus:outline-none focus:ring-2 focus:ring-berry-500 transition-all"
                                        required
                                    />
                                </div>

                                {inviteCode === '' && (
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-space-400 uppercase tracking-wider ml-1">Nombre de tu Iglesia</label>
                                        <input
                                            type="text"
                                            placeholder="Ej: Iglesia Central"
                                            value={churchName}
                                            onChange={(e) => setChurchName(e.target.value)}
                                            className="w-full bg-eggshell-100 border border-eggshell-300 rounded-xl py-2 px-4 text-space-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-space-400 uppercase tracking-wider ml-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-eggshell-100 border border-eggshell-300 rounded-xl py-2 px-4 text-space-900 focus:outline-none focus:ring-2 focus:ring-berry-500 transition-all"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-space-400 uppercase tracking-wider ml-1">Contraseña</label>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-eggshell-100 border border-eggshell-300 rounded-xl py-2 px-4 text-space-900 focus:outline-none focus:ring-2 focus:ring-berry-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#d90368] hover:bg-[#ae0253] text-white font-medium py-3 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Registrarme <ArrowRight className="h-4 w-4" /></>}
                            </button>
                            <button onClick={() => setStep('has-code-query')} className="w-full text-sm text-space-500 py-px">Atrás</button>
                        </motion.form>
                    )}

                    {step === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6"
                        >
                            <div className="flex justify-center">
                                <div className="bg-green-100 p-4 rounded-full">
                                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-space-900">¡Bienvenido a la comunidad!</h3>
                                {churchName ? (
                                    <p className="text-space-600 mt-2">
                                        Has registrado la iglesia <strong>{churchName}</strong>. Ahora eres el administrador y puedes empezar a configurar el mercado.
                                    </p>
                                ) : (
                                    <p className="text-space-600 mt-2">
                                        Te has unido correctamente a tu iglesia.
                                    </p>
                                )}
                            </div>
                            <p className="text-sm text-space-400 italic">Revisa tu correo para confirmar tu cuenta y poder iniciar sesión.</p>
                            <button
                                onClick={() => setStep('login')}
                                className="w-full bg-space-900 text-white font-bold py-3 rounded-xl shadow-lg"
                            >
                                Ir a Iniciar Sesión
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}

