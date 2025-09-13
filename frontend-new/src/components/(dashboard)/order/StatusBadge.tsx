'use client'
import { Badge } from '@/components/ui/badge'
import type { Status } from '@/lib/types'

export default function StatusBadge({ status }: { status: Status }) {
    const map: Record<Status, string> = {
        pending: 'bg-yellow-500/20 text-yellow-500',
        serving: 'bg-blue-500/20 text-blue-500',
        paid: 'bg-green-500/20 text-green-500',
    }
    return <Badge className={map[status]}>{label(status)}</Badge>
}

function label(s: Status) {
    if (s === 'pending') return 'Chưa phục vụ'
    if (s === 'serving') return 'Đang phục vụ'
    return 'Đã thanh toán'
}
