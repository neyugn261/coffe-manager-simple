'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [hasRedirected, setHasRedirected] = useState(false)

    useEffect(() => {
        console.log(
            '🛡️ AuthGuard - loading:',
            isLoading,
            'isAuthenticated:',
            isAuthenticated,
            'pathname:',
            pathname,
        )

        if (!isLoading && !isAuthenticated && !hasRedirected) {
            // Avoid redirect loop - only redirect if not already on login page
            if (pathname !== '/login') {
                console.log('🔒 Not authenticated, redirecting to login from:', pathname)
                setHasRedirected(true)
                router.replace('/login')
            }
        } else if (!isLoading && isAuthenticated) {
            console.log('✅ AuthGuard - User is authenticated, allowing access')
        }
    }, [isAuthenticated, isLoading, router, pathname, hasRedirected])

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-stone-50">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-purple-500"></div>
                    <p className="text-stone-600">Đang kiểm tra xác thực...</p>
                </div>
            </div>
        )
    }

    // Don't render children if not authenticated (will redirect or is redirecting)
    if (!isAuthenticated) {
        return null // Sẽ redirect tới login
    }

    return <>{children}</>
}
