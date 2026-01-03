import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create a safe client that won't crash if env vars are missing
let supabaseInstance: SupabaseClient | null = null

try {
    if (supabaseUrl && supabaseAnonKey) {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    } else {
        console.warn('[Supabase] Missing environment variables - auth features disabled')
    }
} catch (error) {
    console.error('[Supabase] Failed to initialize client:', error)
}

// Export a proxy that won't crash when used without config
export const supabase = supabaseInstance || createClient('https://placeholder.supabase.co', 'placeholder-key')

export const isSupabaseConfigured = () => {
    return !!supabaseUrl && !!supabaseAnonKey && supabaseInstance !== null
}
