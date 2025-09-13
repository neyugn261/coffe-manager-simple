'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import Header from '@/components/(dashboard)/Header'
import StatusBadge from '@/components/(dashboard)/order/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTables } from '@/store'

export default function EatInIndex() {
    const { state, actions } = useTables()
    const { tables, loading } = state
    const { fetchTables } = actions

    // Load tables on component mount
    useEffect(() => {
        fetchTables()
    }, [fetchTables])

    if (loading && tables.length === 0) {
        return (
            <div>
                <Header backLink="/order" title="Danh sách bàn" />
                <div className="flex items-center justify-center p-8">
                    <div className="text-muted-foreground text-sm">Đang tải...</div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Header backLink="/order" title="Danh sách bàn" />
            <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-4">
                {tables.map((t) => (
                    <Link key={t.id} href={`/order/eat-in/${t.id}`}>
                        <Card className="bg-card text-foreground border-border border p-3 duration-300 hover:-translate-y-1 hover:bg-[var(--secondary-hover)] hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between p-0 pb-2">
                                <CardTitle className="text-xl">{t.name}</CardTitle>
                                <StatusBadge status={t.status} />
                            </CardHeader>
                            <CardContent className="p-0 text-xs opacity-70">
                                Nhấn để mở order
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
