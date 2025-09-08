import { api } from "./api.js";

const apiService = {
    // Menu APIs
    menu: {
        // GET /api/menu - Lấy tất cả menu items
        getAll: async () => {
            const response = await api.get("/menu");
            return response.data || []; // Backend trả về {status, data, count}
        },

        // GET /api/menu/:id - Lấy menu item theo ID
        getById: async (id) => {
            const response = await api.get(`/menu/${id}`);
            return response.data;
        },

        // POST /api/menu - Tạo menu item mới
        create: async (data) => {
            const response = await api.post("/menu", data);
            return response.data;
        },

        // PUT /api/menu/:id - Cập nhật menu item
        update: async (id, data) => {
            const response = await api.put(`/menu/${id}`, data);
            return response.data;
        },

        // DELETE /api/menu/:id - Xóa menu item
        delete: async (id) => {
            const response = await api.delete(`/menu/${id}`);
            return response;
        },
    },

    // Order APIs
    order: {
        // GET /api/orders - Lấy tất cả đơn hàng
        getAll: async () => {
            const response = await api.get("/orders");
            return response.data || [];
        },

        // GET /api/orders/:id - Lấy đơn hàng theo ID
        getById: async (id) => {
            const response = await api.get(`/orders/${id}`);
            return response.data;
        },

        // POST /api/orders - Tạo đơn hàng mới
        create: async (data) => {
            const response = await api.post("/orders", data);
            return response.data;
        },

        // PUT /api/orders/:id/status - Cập nhật trạng thái đơn hàng
        updateStatus: async (id, status) => {
            const response = await api.put(`/orders/${id}/status`, { status });
            return response;
        },

        // PUT /api/orders/:id/payment - Cập nhật trạng thái thanh toán
        updatePayment: async (id, payment_status) => {
            const response = await api.put(`/orders/${id}/payment`, {
                payment_status,
            });
            return response;
        },

        // GET /api/orders/by-status/:status - Lấy đơn hàng theo trạng thái
        getByStatus: async (status) => {
            const response = await api.get(`/orders/by-status/${status}`);
            return response.data || [];
        },

        // GET /api/orders/by-payment/:payment_status - Lấy đơn hàng theo trạng thái thanh toán
        getByPaymentStatus: async (payment_status) => {
            const response = await api.get(
                `/orders/by-payment/${payment_status}`
            );
            return response.data || [];
        },

        // GET /api/orders/statistics - Lấy thống kê đơn hàng
        getStatistics: async () => {
            const response = await api.get("/orders/statistics");
            return response.data;
        },

        // DELETE /api/orders/:id - Xóa đơn hàng
        delete: async (id) => {
            const response = await api.delete(`/orders/${id}`);
            return response;
        },
    },
};

export default apiService;
