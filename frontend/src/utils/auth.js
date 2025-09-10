import { useEffect, useState } from 'react'

// Utility functions for authentication
export const authUtils = {
    // Lấy API key từ localStorage
    getApiKey: () => {
        return localStorage.getItem('apiKey')
    },

    // Lấy thời gian hết hạn
    getApiKeyExpires: () => {
        return localStorage.getItem('apiKeyExpires')
    },

    // Kiểm tra API key có hợp lệ không
    isApiKeyValid: () => {
        const apiKey = authUtils.getApiKey()
        const expires = authUtils.getApiKeyExpires()

        if (!apiKey || !expires) {
            return false
        }

        // Kiểm tra hết hạn
        const expiresDate = new Date(expires)
        const now = new Date()

        if (expiresDate <= now) {
            // Xóa key hết hạn
            authUtils.removeApiKey()
            return false
        }

        return true
    },

    // Xóa API key
    removeApiKey: () => {
        localStorage.removeItem('apiKey')
        localStorage.removeItem('apiKeyExpires')
    },

    // Lưu API key
    setApiKey: (apiKey, expiresAt) => {
        localStorage.setItem('apiKey', apiKey)
        localStorage.setItem('apiKeyExpires', expiresAt)
    },

    // Tạo headers cho request
    getAuthHeaders: () => {
        const apiKey = authUtils.getApiKey()
        if (!apiKey) return {}

        return {
            Authorization: `Bearer ${apiKey}`,
        }
    },
}

// Hook để kiểm tra trạng thái xác thực
export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            const isValid = authUtils.isApiKeyValid()
            setIsAuthenticated(isValid)
            setIsLoading(false)
        }

        checkAuth()

        // Kiểm tra định kỳ mỗi phút
        const interval = setInterval(checkAuth, 60000)

        return () => clearInterval(interval)
    }, [])

    const login = (apiKey, expiresAt) => {
        authUtils.setApiKey(apiKey, expiresAt)
        setIsAuthenticated(true)
    }

    const logout = () => {
        authUtils.removeApiKey()
        setIsAuthenticated(false)
    }

    return {
        isAuthenticated,
        isLoading,
        login,
        logout,
    }
}

export default authUtils
