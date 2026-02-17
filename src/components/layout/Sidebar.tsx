
"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { Home, ShoppingBag, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import { useStore } from '@/store/useStore'

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const logout = useStore((state) => state.logout)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        logout()
        router.push('/auth')
    }

    const links = [
        { href: '/', label: 'Inicio', icon: Home },
        { href: '/market', label: 'Mercado', icon: ShoppingBag },
        { href: '/profile', label: 'Perfil', icon: User },
    ]

    return (
        <aside className="hidden md:flex flex-col w-64 bg-white text-space-900 h-screen fixed left-0 top-0 p-6 z-50 shadow-xl border-r border-eggshell-300">
            <div className="flex items-center px-2">
                <Image
                    src="/logo.png"
                    alt="SABAGO"
                    width={400}
                    height={400}
                    className="h-40 w-auto"
                    priority
                />
            </div>

            <nav className="flex-1 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                isActive
                                    ? "text-berry-600"
                                    : "text-space-600 hover:bg-eggshell-200 hover:text-space-900"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
                            <span>{link.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 text-berry-600 hover:text-berry-700 hover:bg-berry-50 rounded-xl transition-colors mt-auto w-full text-left"
            >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
            </button>
        </aside>
    )
}
