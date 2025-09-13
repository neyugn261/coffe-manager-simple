'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/(dashboard)/Header'
import CartDrawer from '@/components/(dashboard)/order/CartDrawer'
import MenuCard from '@/components/(dashboard)/order/MenuCard'
import SearchFilter from '@/components/(dashboard)/order/SearchFilter'
import { useMenu, useOrders } from '@/store'
import { saveOrderToApi } from '@/lib/utils'
import type { Category, MenuItem } from '@/lib/types'
import { Button } from '@/components/ui/button'

export default function TableDetailPage() {
    const { table_id } = useParams<{ table_id: string }>()
    const { state: menuState, actions: menuActions } = useMenu()
    const { state: orderState, actions: orderActions } = useOrders()
    const { items: menu } = menuState
    const { orders } = orderState
    const { fetchItems } = menuActions
    const { createOrder, addLine, attachServer } = orderActions

    const [orderId, setOrderId] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState<Category>('all')

    // Load menu on component mount
    useEffect(() => {
        fetchItems()
    }, [fetchItems])

    // Create eat-in order for this table
    useEffect(() => {
        if (!table_id || orderId) return

        const createEatInOrder = async () => {
            console.log('🍽️ Table ID ready:', table_id)
            // Don't create empty order - will create when user adds first item
            const tempId = 'temp-' + table_id + '-' + Date.now()
            console.log('✅ Ready to take orders for table with temp ID:', tempId)
            setOrderId(tempId)
        }
        createEatInOrder()
    }, [table_id, orderId])

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
        console.log('➕ Adding item to order:', item.name)

        try {
            // Check if this is the first item
            const currentOrder = orders.find((o) => o.id === orderId)
            if (!currentOrder || !currentOrder.lines || currentOrder.lines.length === 0) {
                console.log('🍽️ Creating new order with first item')
                await createOrder({
                    type: 'eat-in',
                    tableId: String(table_id),
                    lines: [{ item, qty: 1 }],
                })
            } else {
                // Add to existing order
                console.log('➕ Adding to existing order')
                const orderLine = {
                    item: item,
                    qty: 1,
                }
                await addLine(orderId, orderLine)
            }
        } catch (error) {
            console.error('❌ Failed to add item:', error)
        }
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

    if (!orderId) return null

    return (
        <div>
            <Header backLink="/order" title={`Bàn ${table_id}`} />
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <SearchFilter
                        search={search}
                        setSearch={setSearch}
                        category={category}
                        setCategory={setCategory}
                    />
                    <div className="flex flex-row gap-2">
                        <Button
                            variant="secondary"
                            className="bg-secondary border-border text-foreground rounded-md border px-4 py-2"
                            onClick={handleSaveOrder}
                        >
                            Lưu đơn
                        </Button>
                        <CartDrawer orderId={orderId} />
                    </div>
                </div>
            </div>
            <div className="mx-auto flex max-w-7xl flex-row flex-wrap gap-6">
                {filtered.map((item) => (
                    <MenuCard key={item.id} item={item} onAdd={handleAddLine} />
                ))}
            </div>
            <div className="mx-auto max-w-7xl p-5"></div>
        </div>
    )
}
