// Format currency (VND)
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

// Format date
export const formatDate = (date, format = "dd/MM/yyyy") => {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    switch (format) {
        case "dd/MM/yyyy":
            return `${day}/${month}/${year}`;
        case "dd/MM/yyyy HH:mm":
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        case "HH:mm":
            return `${hours}:${minutes}`;
        default:
            return d.toLocaleDateString("vi-VN");
    }
};

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number (Vietnam format)
export const isValidPhone = (phone) => {
    const phoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ""));
};

// Generate random ID
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Order status helpers
export const ORDER_STATUS = {
    PENDING: "pending",
    PREPARING: "preparing",
    READY: "ready",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
};

export const getOrderStatusText = (status) => {
    const statusMap = {
        [ORDER_STATUS.PENDING]: "Chờ xử lý",
        [ORDER_STATUS.PREPARING]: "Đang pha chế",
        [ORDER_STATUS.READY]: "Sẵn sàng",
        [ORDER_STATUS.DELIVERED]: "Đã giao",
        [ORDER_STATUS.CANCELLED]: "Đã hủy",
    };
    return statusMap[status] || status;
};

export const getOrderStatusColor = (status) => {
    const colorMap = {
        [ORDER_STATUS.PENDING]: "#f59e0b",
        [ORDER_STATUS.PREPARING]: "#3b82f6",
        [ORDER_STATUS.READY]: "#10b981",
        [ORDER_STATUS.DELIVERED]: "#6b7280",
        [ORDER_STATUS.CANCELLED]: "#ef4444",
    };
    return colorMap[status] || "#6b7280";
};

export default {
    formatCurrency,
    formatDate,
    isValidEmail,
    isValidPhone,
    generateId,
    debounce,
    ORDER_STATUS,
    getOrderStatusText,
    getOrderStatusColor,
};
