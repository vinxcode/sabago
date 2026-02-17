
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, User, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Sidebar() {
    const pathname = usePathname()

    const links = [
        { href: '/', label: 'Inicio', icon: Home },
        { href: '/market', label: 'Mercado', icon: ShoppingBag },
        { href: '/profile', label: 'Perfil', icon: User },
    ]

    return (
        <aside className="hidden md:flex flex-col w-64 bg-granite-900 text-white h-screen fixed left-0 top-0 p-6 z-50 shadow-xl">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-8 h-8 rounded-full bg-rosewood-500 flex items-center justify-center">
                    <span className="font-bold text-white text-lg">S</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight">SABAGO</h1>
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
                                    ? "bg-rosewood-600 text-white shadow-lg shadow-rosewood-900/20 font-medium"
                                    : "text-granite-300 hover:bg-granite-800 hover:text-white"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive && "fill-current")} />
                            <span>{link.label}</span>
                        </Link>
                    )
                })}
            </nav>

            <button
                onClick={async () => await import('@/lib/supabase').then(m => m.supabase.auth.signOut())}
                className="flex items-center gap-3 px-4 py-3 text-rosewood-400 hover:text-rosewood-300 hover:bg-rosewood-900/20 rounded-xl transition-colors mt-auto w-full text-left"
            >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
            </button>
        </aside>
    )
}
