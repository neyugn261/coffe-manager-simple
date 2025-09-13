'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '../lib/auth'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [hasRedirected, setHasRedirected] = useState(false)

    useEffect(() => {
        console.log(
            '🛡️ AuthGuard - loading:',
            loading,
            'isAuthenticated:',
            isAuthenticated,
            'pathname:',
            pathname,
        )

        if (!loading && !isAuthenticated && !hasRedirected) {
            // Avoid redirect loop - only redirect if not already on login page
            if (pathname !== '/login') {
                console.log('🔒 Not authenticated, redirecting to login from:', pathname)
                setHasRedirected(true)
                router.push('/login')
            }
        } else if (!loading && isAuthenticated) {
            console.log('✅ AuthGuard - User is authenticated, allowing access')
        }
    }, [isAuthenticated, loading, router, pathname, hasRedirected])

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                    <div className="relative mx-auto h-16 w-16">
                        <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-4 border-blue-200"></div>
                        <div className="absolute inset-0 h-16 w-16 animate-spin rounded-full border-t-4 border-blue-600"></div>
                    </div>
                    <p className="mt-6 text-lg font-medium text-gray-700">
                        Đang kiểm tra xác thực...
                    </p>
                    <p className="mt-2 text-sm text-gray-500">Vui lòng chờ trong giây lát</p>
                </div>
            </div>
        )
    }

    // Don't render children if not authenticated (will redirect or is redirecting)
    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
                <div className="text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <svg
                            className="h-8 w-8 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-7a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <p className="mt-4 text-lg font-medium text-gray-700">Cần đăng nhập</p>
                    <p className="mt-2 text-sm text-gray-500">
                        Đang chuyển hướng đến trang đăng nhập...
                    </p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
