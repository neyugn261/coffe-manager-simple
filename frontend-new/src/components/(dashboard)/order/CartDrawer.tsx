'use client'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { useOrders } from '@/store'
import { updateOrderStatusOnApi } from '@/lib/utils'

export default function CartDrawer({ orderId }: { orderId: string }) {
    const { state, actions } = useOrders()
    const { orders } = state
    const { updateOrderStatus } = actions

    const order = orders.find((o) => o.id === orderId)
    if (!order) return null

    const total = order.lines.reduce((s, l) => s + l.qty * l.item.price, 0)
    const itemCount = order.lines.reduce((s, l) => s + l.qty, 0)

    const handleStatusUpdate = async (status: 'pending' | 'serving' | 'paid') => {
        await updateOrderStatus(orderId, status)

        // Also update via API if there's a serverId
        if (order.serverId) {
            const apiStatus =
                status === 'serving' ? 'preparing' : status === 'paid' ? 'completed' : 'pending'
            await updateOrderStatusOnApi(order.serverId, apiStatus)
        }
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="secondary"
                    className="bg-secondary border-border text-foreground rounded-md border px-4 py-2"
                >
                    Giỏ hàng ({itemCount})
                </Button>
            </SheetTrigger>
            <SheetContent className="bg-primary">
                <SheetHeader className="bg-primary">
                    <SheetTitle>Đơn #{order.id}</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-2">
                    {order.lines.map((l) => (
                        <div key={l.item.id} className="flex justify-between text-sm">
                            <span>
                                {l.item.name} × {l.qty}
                            </span>
                            <span>{(l.qty * l.item.price).toLocaleString()}đ</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <div className="text-sm opacity-70">Tổng</div>
                    <div className="font-semibold">{total.toLocaleString()}đ</div>
                </div>
                <div className="mt-4 flex gap-2">
                    <Button onClick={() => handleStatusUpdate('pending')}>Chưa phục vụ</Button>
                    <Button onClick={() => handleStatusUpdate('serving')}>Đang phục vụ</Button>
                    <Button onClick={() => handleStatusUpdate('paid')}>Đã thanh toán</Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
