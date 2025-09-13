'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../lib/auth'
import apiService from '../../services/apiService.js'

export default function LoginPage() {
    const router = useRouter()
    const { login, isAuthenticated } = useAuth()
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/')
        }
    }, [isAuthenticated, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!code.trim()) {
            setError('Vui lòng nhập mã xác thực')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await apiService.auth.login(code.trim())

            if (response) {
                // Use auth context to login
                login(response.apiKey, response.expiresAt)

                // Redirect to home
                router.push('/')
            } else {
                setError('Mã xác thực không đúng')
            }
        } catch (error) {
            console.error('Lỗi xác thực:', error)
            setError('Có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="page">
            <div className="login-container">
                <div className="login-card glass-effect">
                    <div className="login-header">
                        <h1 className="page-title">☕ Cafe Manager</h1>
                        <p>Nhập mã để truy cập hệ thống</p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="code">Mã xác thực</label>
                            <input
                                type="password"
                                id="code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Nhập mã xác thực..."
                                className="input-field"
                                disabled={loading}
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                                <button
                                    type="button"
                                    onClick={() => setError('')}
                                    className="close-error"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        <button type="submit" className="btn-primary login-btn" disabled={loading}>
                            {loading ? <>🔄 Đang xác thực...</> : <>🔑 Đăng nhập</>}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>ℹ️ Liên hệ quản trị viên để được cấp mã truy cập</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
