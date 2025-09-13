'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
    isAuthenticated: boolean
    login: (apiKey: string, expiresAt: string) => void
    logout: () => void
    loading: boolean
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check for stored API key on mount
        const checkAuth = () => {
            console.log('🔍 AuthProvider: Checking authentication...')
            const apiKey = localStorage.getItem('apiKey')
            const apiKeyExpires = localStorage.getItem('apiKeyExpires')

            console.log('🔍 AuthProvider: API Key found:', !!apiKey)
            console.log('🔍 AuthProvider: API Key expires:', apiKeyExpires)

            if (apiKey && apiKeyExpires) {
                const expiresDate = new Date(apiKeyExpires)
                const now = new Date()

                console.log('🔍 AuthProvider: Expiry check - expires:', expiresDate, 'now:', now)

                if (expiresDate > now) {
                    console.log('✅ AuthProvider: API key valid, setting authenticated = true')
                    setIsAuthenticated(true)
                } else {
                    console.log('❌ AuthProvider: API key expired, removing from storage')
                    // API key expired, remove it
                    localStorage.removeItem('apiKey')
                    localStorage.removeItem('apiKeyExpires')
                    setIsAuthenticated(false)
                }
            } else {
                console.log(
                    '❌ AuthProvider: No valid API key found, setting authenticated = false',
                )
                setIsAuthenticated(false)
            }

            setLoading(false)
        }

        checkAuth()
    }, [])

    const login = (apiKey: string, expiresAt: string) => {
        localStorage.setItem('apiKey', apiKey)
        localStorage.setItem('apiKeyExpires', expiresAt)
        setIsAuthenticated(true)
    }

    const logout = () => {
        localStorage.removeItem('apiKey')
        localStorage.removeItem('apiKeyExpires')
        setIsAuthenticated(false)
        router.push('/login')
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
