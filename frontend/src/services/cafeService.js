import { api } from "./api.js";

// Order Management API
export const orderService = {
    // Get all orders
    getAllOrders: () => api.get("/orders"),

    // Get order by ID
    getOrderById: (id) => api.get(`/orders/${id}`),

    // Create new order
    createOrder: (orderData) => api.post("/orders", orderData),

    // Update order
    updateOrder: (id, orderData) => api.put(`/orders/${id}`, orderData),

    // Delete order
    deleteOrder: (id) => api.delete(`/orders/${id}`),

    // Update order status
    updateOrderStatus: (id, status) =>
        api.put(`/orders/${id}/status`, { status }),
};

// Menu Management API
export const menuService = {
    // Get all menu items
    getAllItems: () => api.get("/menu"),

    // Get item by ID
    getItemById: (id) => api.get(`/menu/${id}`),

    // Create new menu item
    createItem: (itemData) => api.post("/menu", itemData),

    // Update menu item
    updateItem: (id, itemData) => api.put(`/menu/${id}`, itemData),

    // Delete menu item
    deleteItem: (id) => api.delete(`/menu/${id}`),

    // Get items by category
    getItemsByCategory: (category) => api.get(`/menu/category/${category}`),
};

// Revenue/Analytics API
export const revenueService = {
    // Get daily revenue
    getDailyRevenue: (date) => api.get(`/revenue/daily?date=${date}`),

    // Get weekly revenue
    getWeeklyRevenue: (week, year) =>
        api.get(`/revenue/weekly?week=${week}&year=${year}`),

    // Get monthly revenue
    getMonthlyRevenue: (month, year) =>
        api.get(`/revenue/monthly?month=${month}&year=${year}`),

    // Get revenue summary
    getRevenueSummary: (startDate, endDate) =>
        api.get(`/revenue/summary?start=${startDate}&end=${endDate}`),

    // Get top selling items
    getTopSellingItems: (period) =>
        api.get(`/analytics/top-items?period=${period}`),
};

export default {
    orderService,
    menuService,
    revenueService,
};
