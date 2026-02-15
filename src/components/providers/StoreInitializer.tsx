
"use client"

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'

export function StoreInitializer() {
    const setUser = useStore((state) => state.setUser)
    const setTransactions = useStore((state) => state.setTransactions)

    useEffect(() => {
        // Simulate fetching user data
        // In a real app, this would check Supabase auth
        const mockUser = {
            id: "user-123",
            username: "alexrivera",
            full_name: "Alex Rivera",
            avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
            balance: 2150,
            role: "user" as const
        }

        const mockTransactions = [
            {
                id: "tx-1",
                created_at: new Date().toISOString(), // Today
                amount: 150,
                description: "Participación en campamento",
                type: "reward" as const
            },
            {
                id: "tx-2",
                created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
                amount: 50,
                description: "Puntos enviados a María",
                type: "transfer" as const,
                receiver_id: "maria-123"
            },
            {
                id: "tx-3",
                created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                amount: 200,
                description: "Canje de premio: Taza",
                type: "redemption" as const
            },
            {
                id: "tx-4",
                created_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
                amount: 25,
                description: "Clase de liderazgo",
                type: "reward" as const
            }
        ]

        const mockItems = [
            {
                id: "item-1",
                title: "Sudadera del Grupo",
                description: "Sudadera oficial de los Jóvenes Adventistas",
                price: 800,
                image_url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=500",
                category: "physical"
            },
            {
                id: "item-2",
                title: "Campamento de Verano",
                description: "Entrada completa para el campamento anual",
                price: 1500,
                image_url: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=500",
                category: "event"
            },
            {
                id: "item-3",
                title: "Taza con Logo",
                description: "Taza de cerámica con el logo JA",
                price: 200,
                image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=500",
                category: "physical"
            },
            {
                id: "item-4",
                title: "Pulsera Oficial",
                description: "Pulsera tejida con los colores JA",
                price: 150,
                image_url: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=500",
                category: "physical"
            },
            {
                id: "item-5",
                title: "Elige la Música",
                description: "Elige una canción para el próximo social",
                price: 50,
                image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=500",
                category: "privilege"
            },
            {
                id: "item-6",
                title: "Donación Misión",
                description: "Dona tus puntos a la ofrenda misionera",
                price: 100,
                image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=500",
                category: "privilege"
            }
        ]

        setUser(mockUser)
        setTransactions(mockTransactions)
        useStore.getState().setMarketItems(mockItems)
    }, [setUser, setTransactions])

    return null
}
