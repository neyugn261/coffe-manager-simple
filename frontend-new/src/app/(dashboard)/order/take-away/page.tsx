'use client'

import CartDrawer from '@/components/(dashboard)/order/CartDrawer'
import Header from '@/components/(dashboard)/Header'
import MenuCard from '@/components/(dashboard)/order/MenuCard'
import SearchFilter from '@/components/(dashboard)/order/SearchFilter'
import { Button } from '@/components/ui/button'
import { useMenu, useOrders } from '@/store'
import { saveOrderToApi } from '@/lib/utils'
import { useEffect, useMemo, useState } from 'react'
import type { Category, MenuItem } from '@/lib/types'

export default function TakeAwayPage() {
    const { state: menuState, actions: menuActions } = useMenu()
    const { state: orderState, actions: orderActions } = useOrders()
    const { items: menu } = menuState
    const { orders } = orderState
    const { fetchItems } = menuActions
    const { createOrder, addLine, attachServer } = orderActions

    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<Category>('all')
    const [orderId, setOrderId] = useState<string | null>(null)

    // Load menu on component mount
    useEffect(() => {
        fetchItems()
    }, [fetchItems])

    // Create order when component mounts
    useEffect(() => {
        if (!orderId) {
            const createTakeAwayOrder = async () => {
                await createOrder({
                    type: 'take-away',
                    lines: [],
                })
                // For now, we'll use a temporary ID until API integration is complete
                const tempId = 'temp-' + Date.now()
                setOrderId(tempId)
            }
            createTakeAwayOrder()
        }
    }, [orderId, createOrder])

    const filtered = useMemo(
        () =>
            menu.filter(
                (i) =>
                    i.name.toLowerCase().includes(search.toLowerCase()) &&
                    (category === 'all' || i.category === category),
            ),
        [menu, search, category],
    )

    const handleAddLine = async (item: MenuItem) => {
        if (!orderId) return
        const orderLine = {
            item: item,
            qty: 1,
        }
        await addLine(orderId, orderLine)
    }

    const handleSaveOrder = async () => {
        if (!orderId) return
        const order = orders.find((o) => o.id === orderId)
        if (!order) return

        try {
            const saved = await saveOrderToApi(order)
            if (saved?.id) {
                await attachServer(orderId, saved.id)
            }
        } catch (error) {
            console.error('Failed to save order:', error)
        }
    }

    return (
        <div>
            <Header
                title="Đơn mang về"
                action={orderId ? <CartDrawer orderId={orderId} /> : undefined}
            />
            <SearchFilter
                search={search}
                setSearch={setSearch}
                category={category}
                setCategory={setCategory}
            />
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
                {filtered.map((item) => (
                    <MenuCard key={item.id} item={item} onAdd={handleAddLine} />
                ))}
            </div>
            <div className="px-5 pb-6">
                <Button variant="secondary" onClick={handleSaveOrder}>
                    Lưu đơn
                </Button>
            </div>
        </div>
    )
}
