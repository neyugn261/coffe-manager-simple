'use client'
/**
 * Centralized Store Provider
 * Combines all context providers for state management
 */

import { ReactNode } from 'react'
import { MenuProvider } from './slices/menuStore'
import { TablesProvider } from './slices/tablesStore'
import { OrdersProvider } from './slices/ordersStore'

interface StoreProviderProps {
    children: ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
    return (
        <MenuProvider>
            <TablesProvider>
                <OrdersProvider>{children}</OrdersProvider>
            </TablesProvider>
        </MenuProvider>
    )
}

// Export hooks for easy access
export { useMenu } from './slices/menuStore'
export { useTables } from './slices/tablesStore'
export { useOrders } from './slices/ordersStore'

// Export providers individually if needed
export { MenuProvider } from './slices/menuStore'
export { TablesProvider } from './slices/tablesStore'
export { OrdersProvider } from './slices/ordersStore'
