import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, X, Loader2, ShieldAlert, LogIn } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface EditProposal {
    id: string
    distro_name: string
    field: string
    new_value: string
    status: string
    created_at: string
    user_email: string
}

const Dashboard = () => {
    const { user, openLoginModal } = useAuth()
    const [edits, setEdits] = useState<EditProposal[]>([])
    const [loading, setLoading] = useState(true)
    const [accessDenied, setAccessDenied] = useState(false)

    const fetchEdits = async () => {
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token
            if (!token) {
                setLoading(false)
                return
            }
            const res = await fetch(`${import.meta.env.VITE_API_URL}/community/admin/edits`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.status === 403) {
                setAccessDenied(true)
                setLoading(false)
                return
            }
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()
            setEdits(data)
        } catch (error) {
            console.error(error)
            toast({ title: "Erro ao carregar dados", variant: "destructive" })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchEdits()
        } else {
            setLoading(false)
        }
    }, [user])

    // Not logged in state
    if (!user && !loading) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <div className="max-w-md mx-auto">
                    <ShieldAlert className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Área Restrita</h1>
                    <p className="text-muted-foreground mb-6">
                        Faça login para acessar o painel de administração.
                    </p>
                    <Button onClick={openLoginModal} className="gap-2">
                        <LogIn className="w-4 h-4" />
                        Fazer Login
                    </Button>
                </div>
            </div>
        )
    }

    // Access denied (not admin)
    if (accessDenied) {
        return (
            <div className="container mx-auto py-20 px-4 text-center">
                <div className="max-w-md mx-auto">
                    <ShieldAlert className="w-16 h-16 mx-auto text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
                    <p className="text-muted-foreground mb-6">
                        Esta área é restrita a administradores do sistema.
                    </p>
                    <Button variant="outline" onClick={() => window.history.back()}>
                        Voltar
                    </Button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="animate-spin w-12 h-12 text-primary" />
                <p className="text-muted-foreground">Carregando contribuições...</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Painel Admin - Contribuições</h1>

            {edits.length === 0 ? (
                <div className="text-center py-20">
                    <div className="max-w-md mx-auto">
                        <Check className="w-16 h-16 mx-auto text-green-500 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Tudo em dia!</h2>
                        <p className="text-muted-foreground">
                            Nenhuma proposta de edição pendente no momento.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {edits.map(edit => (
                        <Card key={edit.id} className="border-l-4 border-l-primary">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-xl">{edit.distro_name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">Proposto por: {edit.user_email || 'Usuário'}</p>
                                    </div>
                                    <Badge>{edit.field}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-muted/30 p-4 rounded-md font-mono text-sm mb-4 whitespace-pre-wrap">
                                    {edit.new_value}
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleReview(edit.id, 'reject')}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                    >
                                        <X className="w-4 h-4 mr-2" /> Rejeitar
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => handleReview(edit.id, 'approve')}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        <Check className="w-4 h-4 mr-2" /> Aprovar
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )

    async function handleReview(id: string, action: 'approve' | 'reject') {
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token
            const res = await fetch(`${import.meta.env.VITE_API_URL}/community/admin/edits/${id}/review`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ action })
            })

            if (!res.ok) throw new Error('Review failed')

            toast({ title: action === 'approve' ? "✓ Aprovado!" : "✗ Rejeitado" })
            setEdits(edits.filter(e => e.id !== id))
        } catch (error) {
            toast({ title: "Erro na revisão", variant: "destructive" })
        }
    }
}

export default Dashboard
