import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

const LoginPage = () => {
    const navigate = useNavigate()
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!code.trim()) {
            setError('Vui lòng nhập mã xác thực')
            return
        }

        setLoading(true)
        setError('')

        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
            const response = await fetch(`${API_BASE_URL}/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: code.trim() }),
            })

            const data = await response.json()

            if (response.ok && data.status === 'success') {
                // Lưu API key vào localStorage
                localStorage.setItem('apiKey', data.data.apiKey)
                localStorage.setItem('apiKeyExpires', data.data.expiresAt)

                // Chuyển về trang chủ
                navigate('/')
            } else {
                setError(data.message || 'Mã xác thực không đúng')
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
                        <i className="fas fa-coffee"></i>
                        <h1 className="page-title">
                            <i className="fas fa-coffee"></i>
                            Cafe Manager
                        </h1>
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
                                <i className="fas fa-exclamation-triangle"></i>
                                {error}
                                <button
                                    type="button"
                                    onClick={() => setError('')}
                                    className="close-error"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        )}

                        <button type="submit" className="btn-primary login-btn" disabled={loading}>
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i>
                                    Đang xác thực...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-sign-in-alt"></i>
                                    Đăng nhập
                                </>
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <p>
                            <i className="fas fa-info-circle"></i>
                            Liên hệ quản trị viên để được cấp mã truy cập
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
