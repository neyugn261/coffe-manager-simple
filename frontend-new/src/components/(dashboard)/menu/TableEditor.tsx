'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTables } from '@/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Table as UTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface FormData {
    name: string
}

const INITIAL_FORM: FormData = { name: '' }

export default function TableEditor() {
    const { state, actions } = useTables()
    const { tables, loading, error } = state
    const { fetchTables, createTable, deleteTable, clearError } = actions

    const [form, setForm] = useState<FormData>(INITIAL_FORM)

    // Memoized values
    const isFormValid = useMemo(() => form.name.trim().length > 0, [form.name])

    const tableCount = useMemo(() => tables.length, [tables.length])

    // Load tables data on component mount
    useEffect(() => {
        if (tables.length === 0) {
            fetchTables()
        }
    }, [fetchTables, tables.length])

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => clearError(), 5000)
            return () => clearTimeout(timer)
        }
    }, [error, clearError])

    // Callbacks
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, name: e.target.value }))
    }, [])

    const submit = useCallback(async () => {
        if (!isFormValid) return

        try {
            await createTable({ name: form.name.trim() })
            setForm(INITIAL_FORM)
        } catch (err) {
            console.error('Submit error:', err)
        }
    }, [form, isFormValid, createTable])

    const handleDelete = useCallback(
        async (id: string) => {
            if (window.confirm('Bạn có chắc muốn xoá bàn này?')) {
                await deleteTable(id)
            }
        },
        [deleteTable],
    )

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' && isFormValid) {
                e.preventDefault()
                submit()
            }
        },
        [submit, isFormValid],
    )

    if (loading && tables.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="flex items-center gap-2">
                    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                    <span className="text-muted-foreground text-sm">Đang tải danh sách bàn...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-[calc(100vh-180px)] min-h-[600px] flex-col gap-4 *:p-6 lg:gap-6 xl:flex-row xl:items-stretch">
            {error && (
                <div className="bg-destructive/10 text-destructive border-destructive/20 relative rounded-lg border p-4 text-sm">
                    <div className="flex items-start gap-3">
                        <div className="text-lg">⚠️</div>
                        <div>
                            <div className="font-medium">Có lỗi xảy ra</div>
                            <div className="mt-1">{error}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Card */}
            <Card className="h-fit xl:w-1/3 xl:flex-shrink-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                        <span className="text-2xl">🪑</span>
                        Thêm bàn mới
                    </CardTitle>
                    <p className="text-muted-foreground text-sm">
                        Quản lý danh sách bàn trong hệ thống
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Input
                            placeholder="Tên bàn (VD: Bàn 9, VIP 1)"
                            value={form.name}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            className="text-base sm:text-sm"
                            maxLength={50}
                        />
                        <div className="text-muted-foreground mt-1 text-xs">
                            {form.name.length}/50 ký tự
                        </div>
                    </div>

                    <Button onClick={submit} className="w-full" disabled={loading || !isFormValid}>
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="border-background h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                                Đang thêm...
                            </div>
                        ) : (
                            '🪑 Thêm bàn'
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* List Card */}
            <Card className="flex h-[400px] flex-1 flex-col xl:w-2/3">
                <CardHeader className="flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            🪑 Danh sách bàn
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                📊 Tổng: {tableCount} bàn
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex min-h-0 flex-1 flex-col p-0">
                    <div className="flex h-fit min-h-0 flex-1 flex-col overflow-hidden rounded-lg border">
                        {/* Fixed Header */}
                        <div className="bg-muted/20 flex-shrink-0 border-b">
                            <UTable>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="h-12 font-semibold">
                                            Tên bàn
                                        </TableHead>
                                        <TableHead className="h-12 w-28 text-center font-semibold">
                                            Thao tác
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                            </UTable>
                        </div>

                        {/* Scrollable Body */}
                        <div className="scrollable-area overflow-y-auto">
                            <UTable>
                                <TableBody>
                                    {tables.map((table) => (
                                        <TableRow
                                            key={table.id}
                                            className="hover:bg-muted/30 group transition-colors"
                                        >
                                            <TableCell className="py-3 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">🪑</span>
                                                    <span>{table.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex justify-center opacity-60 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDelete(table.id)}
                                                        className="h-7 px-2 text-xs"
                                                        disabled={loading}
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </UTable>

                            {tables.length === 0 && (
                                <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
                                    <div className="mb-4 text-6xl">🪑</div>
                                    <div className="mb-2 text-lg font-medium">Chưa có bàn nào</div>
                                    <div className="text-sm">
                                        Thêm bàn đầu tiên để bắt đầu quản lý
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="text-muted-foreground mt-4 flex flex-shrink-0 items-center justify-center gap-4 text-sm">
                        <span className="bg-muted/50 rounded-full px-3 py-1.5 font-medium">
                            📊 Tổng cộng: {tableCount} bàn
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
