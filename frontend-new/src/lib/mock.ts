import { MenuItem, Table, Order } from './types'

export const MENU: MenuItem[] = [
    { id: 'm1', name: 'Americano', price: 30000, category: 'drink' },
    { id: 'm2', name: 'Bánh mì', price: 25000, category: 'food' },
]

export const TABLES: Table[] = Array.from({ length: 8 }).map((_, i) => ({
    id: `t${i + 1}`,
    name: `Bàn ${i + 1}`,
    status: 'pending',
}))

export const seedOrders: Order[] = []
