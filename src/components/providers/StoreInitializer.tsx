"use client"

import { useEffect, useRef } from 'react'
import { useStore } from '@/store/useStore'
import { supabase } from '@/lib/supabase'
import { usePathname, useRouter } from 'next/navigation'

export function StoreInitializer() {
    const initialized = useRef(false)
    const router = useRouter()
    const pathname = usePathname()

    // Store setters
    const setUser = useStore((state) => state.setUser)
    const setTransactions = useStore((state) => state.setTransactions)
    const setMarketItems = useStore((state) => state.setMarketItems)
    const setLoading = useStore((state) => state.setLoading)

    useEffect(() => {
        // Function to fetch all initial data
        const fetchData = async (userId: string) => {
            try {
                setLoading(true)

                // Parallel fetching for performance
                const [profileRes, txRes, itemsRes] = await Promise.all([
                    supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', userId)
                        .single(),
                    supabase
                        .from('transactions')
                        .select('*')
                        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
                        .order('created_at', { ascending: false }),
                    supabase
                        .from('items')
                        .select('*')
                        .order('created_at', { ascending: false })
                ])

                if (profileRes.data) {
                    setUser(profileRes.data as any)
                }

                if (txRes.data) {
                    // Type assertion to match internal store types
                    setTransactions(txRes.data as any[])
                }

                if (itemsRes.data) {
                    setMarketItems(itemsRes.data as any[])
                }

            } catch (error) {
                console.error('Error fetching data from Supabase:', error)
            } finally {
                setLoading(false)
            }
        }

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()

            // Handle unauthenticated state
            if (!session) {
                if (pathname !== '/auth') {
                    router.replace('/auth')
                }
                setLoading(false)
                return
            }

            // Handle authenticated state
            if (session) {
                if (pathname === '/auth') {
                    router.replace('/')
                }
                // Always fetch fresh data on mount/check
                await fetchData(session.user.id)
            }
        }

        // Initialize
        if (!initialized.current) {
            initialized.current = true
            checkSession()
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null)
                setTransactions([])
                if (pathname !== '/auth') router.replace('/auth')
            } else if (event === 'SIGNED_IN' && session) {
                if (pathname === '/auth') router.replace('/')
                await fetchData(session.user.id)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [pathname, router, setUser, setTransactions, setMarketItems, setLoading])

    return null
}
