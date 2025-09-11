import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home/Home'
import Menu from './pages/Menu/Menu'
import Order from './pages/Order/Order'
import LoginPage from './pages/LoginPage/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'

const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
    },
    {
        path: '/menu',
        element: (
            <ProtectedRoute>
                <Menu />
            </ProtectedRoute>
        ),
    },
    {
        path: '/order',
        element: (
            <ProtectedRoute>
                <Order />
            </ProtectedRoute>
        ),
    },
])

const AppRouter = () => {
    return <RouterProvider router={router} />
}

export default AppRouter
