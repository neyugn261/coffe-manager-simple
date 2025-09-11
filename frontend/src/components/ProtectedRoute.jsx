import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../utils/auth'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth()

    // Hiển thị loading trong khi kiểm tra xác thực
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang kiểm tra xác thực...</p>
            </div>
        )
    }

    // Chuyển đến trang login nếu chưa xác thực
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Render component con nếu đã xác thực
    return children
}

export default ProtectedRoute
