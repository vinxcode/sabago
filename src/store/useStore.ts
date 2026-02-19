
import { create } from 'zustand'

interface UserProfile {
    id: string
    username: string
    full_name: string
    avatar_url: string
    balance: number
    role: 'user' | 'admin'
    church_id: string | null
}


interface Item {
    id: string
    title: string
    description: string
    price: number
    image_url: string
    category: string
    church_id: string | null
}


interface Transaction {
    id: string
    created_at: string
    amount: number
    description: string
    type: 'transfer' | 'reward' | 'redemption'
    sender_id?: string
    receiver_id?: string
}

interface AppState {
    user: UserProfile | null
    isLoading: boolean
    transactions: Transaction[]
    marketItems: Item[]
    setUser: (user: UserProfile | null) => void
    setLoading: (loading: boolean) => void
    setTransactions: (transactions: Transaction[]) => void
    setMarketItems: (items: Item[]) => void
    updateBalance: (amount: number) => void
    logout: () => void
}

export const useStore = create<AppState>((set) => ({
    user: null, // Initial state could be mock data for development
    isLoading: false,
    transactions: [],
    marketItems: [],
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ isLoading: loading }),
    setTransactions: (transactions) => set({ transactions }),
    setMarketItems: (items) => set({ marketItems: items }),
    updateBalance: (amount) => set((state) => ({
        user: state.user ? { ...state.user, balance: state.user.balance + amount } : null
    })),
    logout: () => set({ user: null, transactions: [] }), // Reset state on logout
}))
