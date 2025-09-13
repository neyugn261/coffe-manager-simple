import type { Status } from './types'

// Status configuration - centralized management
export const STATUS_LABELS = {
    pending: {
        label: '⏳ Chờ xử lý',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
    },
    serving: {
        label: '🍽️ Đang phục vụ',
        color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300',
    },
    paid: {
        label: '✅ Đã thanh toán',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    },
} as const

// Helper function to get status info safely
export const getStatusInfo = (status: Status) => {
    return (
        STATUS_LABELS[status] || {
            label: `📄 ${status}`,
            color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
        }
    )
}

// Get all statuses for forms/selects
export const getAllStatuses = () => {
    return Object.entries(STATUS_LABELS)
}

// Get status stats config for display
export const getStatusStatsConfig = () => {
    return {
        pending: { label: 'Chờ', color: STATUS_LABELS.pending.color },
        serving: { label: 'Phục vụ', color: STATUS_LABELS.serving.color },
        paid: { label: 'Hoàn thành', color: STATUS_LABELS.paid.color },
    }
}
