import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

type AuthContextType = {
    user: User | null
    session: Session | null
    loading: boolean
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
    openLoginModal: () => void
    closeLoginModal: () => void
    isLoginModalOpen: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    useEffect(() => {
        // Skip auth initialization if Supabase is not configured
        if (!isSupabaseConfigured()) {
            console.warn('[Auth] Supabase not configured - skipping auth initialization')
            setLoading(false)
            return
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        }).catch((error) => {
            console.error('[Auth] Error getting session:', error)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signInWithGoogle = async () => {
        if (!isSupabaseConfigured()) {
            console.warn('[Auth] Cannot sign in - Supabase not configured')
            return
        }
        await supabase.auth.signInWithOAuth({
            provider: 'google',
        })
    }

    const signOut = async () => {
        if (!isSupabaseConfigured()) return
        await supabase.auth.signOut()
    }

    const openLoginModal = () => setIsLoginModalOpen(true)
    const closeLoginModal = () => setIsLoginModalOpen(false)

    return (
        <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut, openLoginModal, closeLoginModal, isLoginModalOpen }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
