// src/components/order/SearchFilter.tsx
'use client'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { Category } from '@/lib/types'

export default function SearchFilter({
    search,
    setSearch,
    category,
    setCategory,
}: {
    search: string
    setSearch: (v: string) => void
    category: Category
    setCategory: (v: Category) => void
}) {
    return (
        <div className="xs:flex-wrap flex w-full gap-3 px-5 pb-3">
            <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm món"
                className="flex-10"
            />
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="drink">Đồ uống</SelectItem>
                    <SelectItem value="food">Đồ ăn</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
