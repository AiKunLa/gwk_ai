import { useEffect, useState } from "react"

const AbortControllerDemo = () => {
    const [user, setUser] = useState<{ id: string; name: string } | null>(null)
    useEffect(() => {
        const abort = new AbortController()
        const loadUser = async (url: string) => {
            try {
                const response = await fetch(url, {
                    signal: abort.signal
                })
                if (abort.signal.aborted) throw new DOMException("Abort", "AbortError")
                const data = await response.json()
                setUser(data as { id: string; name: string })
            } catch (error) {
                if ((error as Error).name !== 'AbortError') {
                    console.error('Failed to fetch user:', error);
                }
            }
        }
        loadUser("/api/users/")
        return () => {
            console.log('Cancelling request for user');
            abort.abort()
        }
    }, [])

    return (
        <div>
            <h1>User: {user?.name}</h1>
        </div>
    )
}

export default AbortControllerDemo