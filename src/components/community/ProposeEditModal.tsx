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
        { value: 'description', label: t('features.edit.modal.fields.description') },
        { value: 'homepage', label: t('features.edit.modal.fields.homepage') },
        { value: 'logo', label: t('features.edit.modal.fields.logo') },
        { value: 'based_on', label: t('features.edit.modal.fields.based_on') },
        { value: 'category', label: t('features.edit.modal.fields.category') },
        { value: 'origin', label: t('features.edit.modal.fields.origin') },
        { value: 'architecture', label: t('features.edit.modal.fields.architecture') },
        { value: 'desktop', label: t('features.edit.modal.fields.desktop') },
        { value: 'requirements', label: t('features.edit.modal.fields.requirements') },
    ]

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
            const res = await fetch(`${(import.meta.env.VITE_API_URL || '').replace(/\/$/, '')}/community/propose-edit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ distro_name: distroName, field, new_value: newValue })
            })

            if (!res.ok) throw new Error("Failed to submit")

            toast({
                title: t('features.edit.modal.successTitle'),
                description: t('features.edit.modal.successDesc'),
            })
            onClose()
            setField('')
            setNewValue('')
        } catch (error) {
            toast({
                title: t('features.edit.modal.errorTitle'),
                description: t('features.edit.modal.errorDesc'),
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50  -sm z-50 flex items-center justify-center p-4">
            <div className="bg-card w-full max-w-md rounded-none border border-border   animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-xl font-semibold">{t('features.edit.modal.title')}</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>{t('features.edit.modal.field')}</Label>
                        <Select onValueChange={setField} required>
                            <SelectTrigger>
                                <SelectValue placeholder={t('features.edit.modal.selectField')} />
                            </SelectTrigger>
                            <SelectContent>
                                {EDITABLE_FIELDS.map(f => (
                                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>{t('features.edit.modal.newValue')}</Label>
                        <Input
                            value={newValue}
                            onChange={(e) => setNewValue(e.target.value)}
                            placeholder={t('features.edit.modal.placeholder')}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose}>{t('features.edit.modal.cancel')}</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? t('features.edit.modal.submitting') : t('features.edit.modal.submit')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
