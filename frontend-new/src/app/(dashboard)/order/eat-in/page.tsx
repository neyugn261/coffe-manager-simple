'use client'

import Link from 'next/link'
import { useEffect, useMemo } from 'react'
import Header from '@/components/(dashboard)/Header'
import StatusBadge from '@/components/(dashboard)/order/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTables } from '@/store'
import { getStatusInfo } from '@/lib/statuses'
import type { Status } from '@/lib/types'

export default function EatInIndex() {
    const { state, actions } = useTables()
    const { tables, loading, error } = state
    const { fetchTables } = actions

    // Memoized values for optimization
    const tableCount = useMemo(() => tables.length, [tables.length])

    const statusStats = useMemo(() => {
        const stats = tables.reduce(
            (acc, table) => {
                acc[table.status as Status] = (acc[table.status as Status] || 0) + 1
                return acc
            },
            {} as Record<Status, number>,
        )
        return stats
    }, [tables])

    // Load tables on component mount
    useEffect(() => {
        if (tables.length === 0) {
            fetchTables()
        }
    }, [fetchTables, tables.length])

    if (loading && tables.length === 0) {
        return (
            <div className="flex h-screen flex-col">
                <Header backLink="/order" title="Danh sách bàn" />
                <div className="flex flex-1 items-center justify-center p-8">
                    <div className="flex items-center gap-2">
                        <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                        <span className="text-muted-foreground text-sm">
                            Đang tải danh sách bàn...
                        </span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen flex-col">
            <Header backLink="/order" title="Danh sách bàn" />

            {error && (
                <div className="bg-destructive/10 text-destructive border-destructive/20 mx-4 mt-4 rounded-lg border p-4 text-sm">
                    <div className="flex items-start gap-3">
                        <div className="text-lg">⚠️</div>
                        <div>
                            <div className="font-medium">Có lỗi xảy ra</div>
                            <div className="mt-1">{error}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Header */}
            <div className="bg-background flex-shrink-0 border-b p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold">📊 Thống kê bàn</h2>
                    <div className="flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                            Tổng: {tableCount} bàn
                        </span>
                        {Object.entries(statusStats).map(([status, count]) => (
                            <span
                                key={status}
                                className={`rounded-full px-2 py-1 ${getStatusInfo(status as Status).color}`}
                            >
                                {getStatusInfo(status as Status).label}: {count}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tables Grid */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    {tables.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="mb-4 text-6xl">🪑</div>
                            <div className="text-muted-foreground mb-2 text-lg font-medium">
                                Chưa có bàn nào
                            </div>
                            <div className="text-muted-foreground text-sm">
                                Vui lòng thêm bàn trong phần quản lý để bắt đầu
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                            {tables.map((table) => (
                                <Link key={table.id} href={`/order/eat-in/${table.id}`}>
                                    <Card className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="flex items-center gap-2 text-base">
                                                    <span className="text-lg">🪑</span>
                                                    <span className="truncate">{table.name}</span>
                                                </CardTitle>
                                                <StatusBadge status={table.status} />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="text-muted-foreground text-xs">
                                                Nhấn để mở order
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
