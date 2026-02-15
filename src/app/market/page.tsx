
"use client"

import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { ShoppingBag, Filter, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MarketPage() {
    const items = useStore((state) => state.marketItems)
    const user = useStore((state) => state.user)
    const [filter, setFilter] = useState<'all' | 'physical' | 'event' | 'privilege'>('all')

    const filteredItems = filter === 'all'
        ? items
        : items.filter(item => item.category === filter)

    return (
        <div className="pb-24 pt-6 px-6 space-y-8 md:p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-granite-900 flex items-center gap-3">
                        <div className="bg-rosewood-100 p-2 rounded-xl text-rosewood-600">
                            <ShoppingBag className="w-8 h-8" />
                        </div>
                        Sabamarket
                    </h1>
                    <p className="text-granite-500 mt-1 font-medium">Canjea tus <strong>sabadolares</strong> por recompensas increíbles</p>
                </div>

                <div className="bg-gradient-to-r from-granite-800 to-granite-900 pl-4 pr-6 py-3 rounded-2xl text-white shadow-lg flex items-center gap-3 self-start md:self-auto">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                    </div>
                    <div>
                        <p className="text-xs text-granite-300 font-bold uppercase tracking-wider">Tu Saldo</p>
                        <p className="font-mono font-bold text-xl">{user?.balance.toLocaleString()} sabadolares</p>
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="flex gap-3 overflow-x-auto pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide md:flex-wrap">
                {[
                    { id: 'all', label: 'Todos los items' },
                    { id: 'physical', label: 'Artículos Físicos' },
                    { id: 'event', label: 'Eventos & Tickets' },
                    { id: 'privilege', label: 'Privilegios' }
                ].map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setFilter(cat.id as any)}
                        className={cn(
                            "px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 shadow-sm",
                            filter === cat.id
                                ? "bg-rosewood-100 text-granite-600 shadow-rosewood-200 shadow-lg scale-105"
                                : "bg-rosewood-600 text-granite-600 border border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                        )}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Featured Section (Takes up 1st col on large screens, or full width on mobile) */}
                <div className="lg:col-span-4 space-y-4">
                    <h2 className="text-sm font-black text-granite-400 uppercase tracking-widest flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-rosewood-500">
                        Destacados
                    </h2>
                    {/* Featured Item */}
                    {items.length > 0 && (
                        <div className="bg-gradient-to-br from-almond-silk-100 to-rosy-taupe-50 rounded-[2rem] p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 items-center shadow-xl border border-white/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-white/60 transition-colors duration-500"></div>

                            <div className="w-full md:w-1/3 aspect-square md:aspect-[4/3] rounded-3xl bg-white shadow-lg overflow-hidden shrink-0 relative rotate-1 group-hover:rotate-0 transition-transform duration-500">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={items[0].image_url} alt={items[0].title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 text-center md:text-left relative z-10">
                                <div className="inline-block bg-rosewood-100 text-rosewood-700 px-3 py-1 rounded-full text-xs font-bold mb-3 uppercase tracking-wider">
                                    Más Popular
                                </div>
                                <h3 className="font-black text-granite-900 text-3xl md:text-4xl mb-2 leading-tight">{items[0].title}</h3>
                                <p className="text-granite-600 font-medium mb-6 text-lg max-w-xl">{items[0].description}</p>

                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <span className="text-3xl font-black text-rosewood-600">{items[0].price} <span className="text-lg text-rosewood-400">Pts</span></span>
                                    <button className="w-full md:w-auto bg-rosewood-600 hover:bg-rosewood-700 text-white px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider shadow-lg shadow-rosewood-500/30 transition-all hover:scale-105">
                                        Canjear Ahora
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Grid of Items */}
                <div className="lg:col-span-4">
                    <h2 className="text-sm font-black text-granite-400 uppercase tracking-widest mb-6 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-granite-300">
                        Catálogo
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {filteredItems.map((item) => (
                            <div key={item.id} className="bg-rosewood-500 rounded-3xl p-4 shadow-sm border border-slate-100 flex flex-col h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                                <div className="aspect-square rounded-2xl bg-slate-50 mb-4 overflow-hidden relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-granite-800 shadow-sm">
                                        {item.category}
                                    </div>
                                </div>
                                <h3 className="font-bold text-granite-800 text-base leading-tight mb-2 group-hover:text-rosewood-600 transition-colors">{item.title}</h3>
                                <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{item.description}</p>
                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                                    <span className="font-black text-rosewood-600 text-lg">{item.price} <span className="text-xs">Pts</span></span>
                                    <button className="text-xs bg-granite-900 text-white px-3 py-2 rounded-xl font-bold hover:bg-granite-700 transition-colors">
                                        Ver
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
