const API_BASE_URL = "http://localhost:5000/api";

const apiService = {
    // Cấu hình cơ bản cho fetch
    request: async (endpoint, options = {}) => {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("API request failed:", error);
            throw error;
        }
    },

    // Menu APIs
    menu: {
        // GET /api/menu - Lấy tất cả menu items
        getAll: async () => {
            const response = await apiService.request("/menu");
            return response.data || []; // Backend trả về {status, data, count}
        },

        // GET /api/menu/:id - Lấy menu item theo ID
        getById: async (id) => {
            const response = await apiService.request(`/menu/${id}`);
            return response.data;
        },

        // POST /api/menu - Tạo menu item mới
        create: async (data) => {
            const response = await apiService.request("/menu", {
                method: "POST",
                body: JSON.stringify(data),
            });
            return response.data;
        },

        // PUT /api/menu/:id - Cập nhật menu item
        update: async (id, data) => {
            const response = await apiService.request(`/menu/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            });
            return response.data;
        },

        // DELETE /api/menu/:id - Xóa menu item
        delete: async (id) => {
            const response = await apiService.request(`/menu/${id}`, {
                method: "DELETE",
            });
            return response;
        },
    },

    // Order APIs
    order: {
        // GET /api/orders - Lấy tất cả đơn hàng
        getAll: async () => {
            const response = await apiService.request("/orders");
            return response.data || [];
        },

        // GET /api/orders/:id - Lấy đơn hàng theo ID
        getById: async (id) => {
            const response = await apiService.request(`/orders/${id}`);
            return response.data;
        },

        // POST /api/orders - Tạo đơn hàng mới
        create: async (data) => {
            const response = await apiService.request("/orders", {
                method: "POST",
                body: JSON.stringify(data),
            });
            return response.data;
        },

        // PUT /api/orders/:id/status - Cập nhật trạng thái đơn hàng
        updateStatus: async (id, status) => {
            const response = await apiService.request(`/orders/${id}/status`, {
                method: "PUT",
                body: JSON.stringify({ status }),
            });
            return response;
        },

        // PUT /api/orders/:id/payment - Cập nhật trạng thái thanh toán
        updatePayment: async (id, payment_status) => {
            const response = await apiService.request(`/orders/${id}/payment`, {
                method: "PUT",
                body: JSON.stringify({ payment_status }),
            });
            return response;
        },

        // GET /api/orders/by-status/:status - Lấy đơn hàng theo trạng thái
        getByStatus: async (status) => {
            const response = await apiService.request(
                `/orders/by-status/${status}`
            );
            return response.data || [];
        },

        // GET /api/orders/by-payment/:payment_status - Lấy đơn hàng theo trạng thái thanh toán
        getByPaymentStatus: async (payment_status) => {
            const response = await apiService.request(
                `/orders/by-payment/${payment_status}`
            );
            return response.data || [];
        },

        // GET /api/orders/statistics - Lấy thống kê đơn hàng
        getStatistics: async () => {
            const response = await apiService.request("/orders/statistics");
            return response.data;
        },

        // DELETE /api/orders/:id - Xóa đơn hàng
        delete: async (id) => {
            const response = await apiService.request(`/orders/${id}`, {
                method: "DELETE",
            });
            return response;
        },
    },
};

export default apiService;
