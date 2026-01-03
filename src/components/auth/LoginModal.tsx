import { X, Loader2, Mail, Lock } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export function LoginModal() {
    const { isLoginModalOpen, closeLoginModal } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    if (!isLoginModalOpen) return null

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                setSuccess('Cadastro realizado! Verifique seu email para confirmar.')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                closeLoginModal()
            }
        } catch (err: any) {
            // Translate common errors to Portuguese
            let message = err.message
            if (message.includes('Invalid login credentials')) {
                message = 'Email ou senha incorretos'
            } else if (message.includes('Email not confirmed')) {
                message = 'Confirme seu email antes de fazer login'
            } else if (message.includes('User already registered')) {
                message = 'Este email já está cadastrado'
            }
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeLoginModal()
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                        {mode === 'signin' ? 'Bem-vindo de volta!' : 'Criar nova conta'}
                    </h2>
                    <button
                        onClick={closeLoginModal}
                        className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleAuth} className="p-6 space-y-4">
                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-500/10 text-red-400 text-sm p-4 rounded-lg border border-red-500/20 flex items-start gap-2">
                            <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Success Alert */}
                    {success && (
                        <div className="bg-green-500/10 text-green-400 text-sm p-4 rounded-lg border border-green-500/20">
                            {success}
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="seu@email.com"
                            autoComplete="email"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                            <Lock className="w-4 h-4 text-muted-foreground" />
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                            minLength={6}
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {mode === 'signin' ? 'Entrando...' : 'Cadastrando...'}
                            </>
                        ) : (
                            mode === 'signin' ? 'Entrar' : 'Criar conta'
                        )}
                    </button>

                    {/* Toggle Mode */}
                    <div className="text-center text-sm text-muted-foreground pt-2">
                        {mode === 'signin' ? 'Novo por aqui? ' : 'Já tem conta? '}
                        <button
                            type="button"
                            onClick={() => {
                                setMode(mode === 'signin' ? 'signup' : 'signin')
                                setError(null)
                                setSuccess(null)
                            }}
                            className="text-primary hover:underline font-medium"
                            disabled={loading}
                        >
                            {mode === 'signin' ? 'Criar conta' : 'Fazer login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
