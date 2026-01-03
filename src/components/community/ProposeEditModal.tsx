import { X, Save } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface ProposeEditModalProps {
    isOpen: boolean
    onClose: () => void
    distroName: string
    // Optional: fields available?
}

const EDITABLE_FIELDS = [
    { value: 'description', label: 'Descrição' },
    { value: 'homepage', label: 'Website Oficial' },
    { value: 'logo', label: 'URL do Logo' },
    { value: 'based_on', label: 'Baseado em' },
    { value: 'category', label: 'Categoria' },
    { value: 'origin', label: 'Origem' },
    { value: 'architecture', label: 'Arquitetura' },
    { value: 'desktop', label: 'Ambiente Desktop' },
    { value: 'requirements', label: 'Requisitos de Sistema' },
]

export function ProposeEditModal({ isOpen, onClose, distroName }: ProposeEditModalProps) {
    const { user, openLoginModal } = useAuth()
    const [field, setField] = useState('')
    const [newValue, setNewValue] = useState('')
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            onClose()
            openLoginModal()
            return
        }

        setLoading(true)
        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token
            const res = await fetch(`${import.meta.env.VITE_API_URL}/community/propose-edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ distro_name: distroName, field, new_value: newValue })
            })

            if (!res.ok) throw new Error("Failed to submit")

            toast({
                title: "Proposta enviada!",
                description: "Sua sugestão será revisada por um administrador.",
            })
            onClose()
            setField('')
            setNewValue('')
        } catch (error) {
            toast({
                title: "Erro ao enviar",
                description: "Tente novamente mais tarde.",
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">Sugerir Edição</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Campo</Label>
                        <Select onValueChange={setField} required>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o campo para editar" />
                            </SelectTrigger>
                            <SelectContent>
                                {EDITABLE_FIELDS.map(f => (
                                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Novo Valor</Label>
                        <Textarea
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            placeholder="Digite a informação correta..."
                            className="resize-none h-32"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Enviando...' : 'Enviar Sugestão'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
