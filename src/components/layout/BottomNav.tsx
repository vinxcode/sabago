
"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
    const pathname = usePathname()

    const links = [
        { href: '/', label: 'Inicio', icon: Home },
        { href: '/market', label: 'Mercado', icon: ShoppingBag },
        { href: '/profile', label: 'Perfil', icon: User },
    ]

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-rosewood-500 border-t border-granite-100 pb-safe z-50">
            <div className="flex justify-around items-center h-16">
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive ? "text-granite-600" : "text-granite-400 hover:text-granite-500"
                            )}
                        >
                            <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{link.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
