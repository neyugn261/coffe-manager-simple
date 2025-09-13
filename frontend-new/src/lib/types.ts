export type Status = 'pending' | 'serving' | 'paid'

export type OrderLine = { item: MenuItem; qty: number }

export type Order = {
    id: string
    serverId?: number
    type: 'eat-in' | 'take-away'
    tableId?: string
    status: Status
    lines: OrderLine[]
    notes?: string
    createdAt: number
}

export type Table = {
    id: string
    name: string
    status: Status
    orderId?: string
}

export type Category = 'drink' | 'food' | 'all'

export type MenuItem = {
    id: string
    name: string
    price: number
    category: Category
    image?: string
}
