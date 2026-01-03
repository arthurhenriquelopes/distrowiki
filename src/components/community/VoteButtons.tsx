import { ArrowBigUp, ArrowBigDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface VoteButtonsProps {
    distroName: string
    initialScore?: number
    layout?: 'vertical' | 'horizontal' // Allow different layouts
    size?: 'sm' | 'md' | 'lg'
}

export function VoteButtons({
    distroName,
    initialScore = 0,
    layout = 'vertical',
    size = 'md'
}: VoteButtonsProps) {
    const { user, openLoginModal } = useAuth()
    const [score, setScore] = useState(initialScore)
    const [userVote, setUserVote] = useState<1 | -1 | 0>(0)
    const [loading, setLoading] = useState(false)
    const [fetchError, setFetchError] = useState(false)

    const iconSize = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7'
    const fontSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg'

    useEffect(() => {
        const controller = new AbortController()

        const fetchVotes = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL
                if (!apiUrl) {
                    console.warn('VITE_API_URL not set')
                    return
                }

                const res = await fetch(
                    `${apiUrl}/community/votes/${encodeURIComponent(distroName)}`,
                    { signal: controller.signal }
                )

                if (!res.ok) throw new Error('Failed to fetch')

                const data = await res.json()
                if (data.score !== undefined) {
                    setScore(data.score)
                }
                setFetchError(false)
            } catch (err: any) {
                if (err.name !== 'AbortError') {
                    console.error("Failed to fetch votes:", err)
                    setFetchError(true)
                }
            }
        }

        fetchVotes()

        return () => controller.abort()
    }, [distroName])

    const handleVote = async (type: 1 | -1) => {
        if (!user) {
            openLoginModal()
            return
        }

        if (userVote === type) {
            // Already voted this way - ignore
            return
        }

        setLoading(true)
        const previousVote = userVote
        const previousScore = score

        // Optimistic update
        let newScore = score
        if (previousVote === 0) {
            newScore += type
        } else {
            newScore += (type - previousVote)
        }

        setUserVote(type)
        setScore(newScore)

        try {
            const token = (await supabase.auth.getSession()).data.session?.access_token

            if (!token) {
                throw new Error('No auth token')
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/community/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ distro_name: distroName, vote_type: type })
            })

            if (!res.ok) {
                throw new Error('Vote failed')
            }
        } catch (error) {
            // Revert on error
            setUserVote(previousVote)
            setScore(previousScore)
            console.error('Vote error:', error)
        } finally {
            setLoading(false)
        }
    }

    const containerClass = layout === 'horizontal'
        ? 'flex items-center gap-1 bg-card/50 rounded-lg px-2 py-1 border border-border/50'
        : 'flex flex-col items-center bg-card/50 rounded-lg p-2 border border-border/50'

    return (
        <div className={containerClass} onClick={(e) => e.preventDefault()}>
            <button
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleVote(1)
                }}
                className={cn(
                    "p-1 rounded-md transition-all duration-200",
                    "hover:bg-green-500/15 hover:scale-110",
                    userVote === 1
                        ? "text-green-500 bg-green-500/10"
                        : "text-muted-foreground hover:text-green-500"
                )}
                disabled={loading}
                aria-label="Upvote"
            >
                <ArrowBigUp className={cn(iconSize, userVote === 1 && "fill-current")} />
            </button>

            <span className={cn(
                "font-bold tabular-nums transition-colors",
                fontSize,
                layout === 'vertical' ? 'my-0.5' : 'mx-1 min-w-[2ch] text-center',
                score > 0 ? "text-green-500" : score < 0 ? "text-red-500" : "text-muted-foreground"
            )}>
                {score}
            </span>

            <button
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleVote(-1)
                }}
                className={cn(
                    "p-1 rounded-md transition-all duration-200",
                    "hover:bg-red-500/15 hover:scale-110",
                    userVote === -1
                        ? "text-red-500 bg-red-500/10"
                        : "text-muted-foreground hover:text-red-500"
                )}
                disabled={loading}
                aria-label="Downvote"
            >
                <ArrowBigDown className={cn(iconSize, userVote === -1 && "fill-current")} />
            </button>
        </div>
    )
}
