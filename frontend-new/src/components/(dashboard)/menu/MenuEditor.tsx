'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useMenu } from '@/store'
import type { Category, MenuItem } from '@/lib/types'
import { getCategoryInfo, getFormCategories, getStatsCategories } from '@/lib/categories'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table as UTable,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { CirclePlus, List } from 'lucide-react'

interface FormData {
    name: string
    price: number
    category: Category
}

const INITIAL_FORM: FormData = { name: '', price: 0, category: 'drink' }

export default function MenuEditor() {
    const { state, actions } = useMenu()
    const { items: menu, loading, error } = state
    const { fetchItems, createItem, updateItem, deleteItem, clearError } = actions

    const [form, setForm] = useState<FormData>(INITIAL_FORM)
    const [editing, setEditing] = useState<MenuItem | null>(null)

    // Memoized values
    const isFormValid = useMemo(
        () => form.name.trim().length > 0 && form.price > 0,
        [form.name, form.price],
    )

    const menuCount = useMemo(() => menu.length, [menu.length])

    const categoryStats = useMemo(() => {
        const stats = menu.reduce(
            (acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + 1
                return acc
            },
            {} as Record<Category, number>,
        )
        return stats
    }, [menu])

    // Load menu data on component mount
    useEffect(() => {
        if (menu.length === 0) {
            fetchItems()
        }
    }, [fetchItems, menu.length])

    // Clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => clearError(), 5000)
            return () => clearTimeout(timer)
        }
    }, [error, clearError])

    // Callbacks
    const handleInputChange = useCallback(
        (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = field === 'price' ? Number(e.target.value) : e.target.value
            setForm((prev) => ({ ...prev, [field]: value }))
        },
        [],
    )

    const handleCategoryChange = useCallback((value: string) => {
        setForm((prev) => ({ ...prev, category: value as Category }))
    }, [])

    const submit = useCallback(async () => {
        if (!isFormValid) return

        try {
            if (editing) {
                await updateItem(editing.id, form)
                setEditing(null)
            } else {
                await createItem(form)
            }
            setForm(INITIAL_FORM)
        } catch (err) {
            console.error('Submit error:', err)
        }
    }, [editing, form, isFormValid, updateItem, createItem])

    const handleEdit = useCallback((menuItem: MenuItem) => {
        setEditing(menuItem)
        setForm({
            name: menuItem.name,
            price: menuItem.price,
            category: menuItem.category,
        })
    }, [])

    const handleCancel = useCallback(() => {
        setEditing(null)
        setForm(INITIAL_FORM)
    }, [])

    const handleDelete = useCallback(
        async (id: string) => {
            if (window.confirm('Bạn có chắc muốn xoá món này?')) {
                await deleteItem(id)
            }
        },
        [deleteItem],
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

    if (loading && menu.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="flex items-center gap-2">
                    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                    <span className="text-muted-foreground text-sm">Đang tải menu...</span>
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
                        <span className="text-2xl">{editing ? '✏️' : <CirclePlus />}</span>
                        {editing ? 'Sửa món' : 'Thêm món'}
                    </CardTitle>
                    {editing && (
                        <p className="text-muted-foreground text-sm">
                            Đang chỉnh sửa: <span className="font-medium">{editing.name}</span>
                        </p>
                    )}
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Input
                            placeholder="Tên món"
                            value={form.name}
                            onChange={handleInputChange('name')}
                            onKeyDown={handleKeyPress}
                            className="text-base sm:text-sm"
                            maxLength={100}
                        />
                        <div className="text-muted-foreground mt-1 text-xs">
                            {form.name.length}/100 ký tự
                        </div>
                    </div>

                    <div>
                        <Input
                            type="number"
                            placeholder="Giá (VNĐ)"
                            value={form.price || ''}
                            onChange={handleInputChange('price')}
                            onKeyDown={handleKeyPress}
                            className="text-base sm:text-sm"
                            min="0"
                            step="1000"
                        />
                        <div className="text-muted-foreground mt-1 text-xs">
                            {form.price > 0 && `${form.price.toLocaleString()}đ`}
                        </div>
                    </div>

                    <Select value={form.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn loại" />
                        </SelectTrigger>
                        <SelectContent>
                            {getFormCategories().map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                    {config.emoji} {config.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex flex-col gap-2 *:h-10 sm:flex-row">
                        <Button
                            onClick={submit}
                            className="w-full sm:w-auto"
                            disabled={loading || !isFormValid}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="border-background h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                                    Đang xử lý...
                                </div>
                            ) : editing ? (
                                'Cập nhật'
                            ) : (
                                'Thêm món'
                            )}
                        </Button>
                        {editing && (
                            <Button
                                variant="secondary"
                                onClick={handleCancel}
                                className="w-full sm:w-auto"
                                disabled={loading}
                            >
                                Huỷ
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* List Card */}
            <Card className="flex h-[400px] flex-1 flex-col xl:w-2/3">
                <CardHeader className="flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                            <List /> Danh sách món
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 text-xs">
                            {getStatsCategories().map(([key, config]) => (
                                <span
                                    key={key}
                                    className={`rounded-full px-2 py-1 ${config.color}`}
                                >
                                    {config.emoji} {config.label}:{' '}
                                    {categoryStats[key as Category] || 0}
                                </span>
                            ))}
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
                                            Tên món
                                        </TableHead>
                                        <TableHead className="h-12 w-24 font-semibold">
                                            Loại
                                        </TableHead>
                                        <TableHead className="h-12 w-28 text-right font-semibold">
                                            Giá
                                        </TableHead>
                                        <TableHead className="h-12 w-36 text-center font-semibold">
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
                                    {menu.map((item) => (
                                        <TableRow
                                            key={item.id}
                                            className="hover:bg-muted/30 group transition-colors"
                                        >
                                            <TableCell className="py-3 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">
                                                        {getCategoryInfo(item.category).emoji}
                                                    </span>
                                                    <span>{item.name}</span>
                                                    {editing?.id === item.id && (
                                                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                                            Đang sửa
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground py-3 text-sm">
                                                {getCategoryInfo(item.category).label}
                                            </TableCell>
                                            <TableCell className="py-3 text-right font-mono font-medium">
                                                {item.price.toLocaleString()}đ
                                            </TableCell>
                                            <TableCell className="py-3">
                                                <div className="flex justify-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleEdit(item)}
                                                        className="h-7 px-2 text-xs"
                                                        disabled={loading}
                                                    >
                                                        ✏️
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleDelete(item.id)}
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

                            {menu.length === 0 && (
                                <div className="text-muted-foreground flex flex-col items-center justify-center py-16">
                                    <div className="mb-4 text-6xl">🍽️</div>
                                    <div className="mb-2 text-lg font-medium">Menu trống</div>
                                    <div className="text-sm">Thêm món đầu tiên để bắt đầu</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="text-muted-foreground mt-4 flex flex-shrink-0 items-center justify-center gap-4 text-sm">
                        <span className="bg-muted/50 rounded-full px-3 py-1.5 font-medium">
                            📊 Tổng cộng: {menuCount} món
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
