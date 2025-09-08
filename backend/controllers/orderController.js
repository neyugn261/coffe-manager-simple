const orderService = require("../services/orderService");

class OrderController {
    // GET /api/orders
    async getAllOrders(req, res, next) {
        try {
            const orders = await orderService.getAllOrders();
            res.json({
                status: "success",
                data: orders,
                count: orders.length,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/orders/:id
    async getOrderById(req, res, next) {
        try {
            const { id } = req.params;
            const order = await orderService.getOrderById(id);
            res.json({
                status: "success",
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/orders
    async createOrder(req, res, next) {
        try {
            const order = await orderService.createOrder(req.body);
            res.status(201).json({
                status: "success",
                message: "Tạo đơn hàng thành công",
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/orders/:id
    async deleteOrder(req, res, next) {
        try {
            const { id } = req.params;
            await orderService.deleteOrder(id);
            res.json({
                status: "success",
                message: "Xóa đơn hàng thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/orders/statistics
    async getOrderStatistics(req, res, next) {
        try {
            const statistics = await orderService.getOrderStatistics();
            res.json({
                status: "success",
                data: statistics,
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/orders/:id/status
    async updateOrderStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            await orderService.updateOrderStatus(id, status);
            res.json({
                status: "success",
                message: "Cập nhật trạng thái đơn hàng thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/orders/:id/payment
    async updatePaymentStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { payment_status } = req.body;
            await orderService.updatePaymentStatus(id, payment_status);
            res.json({
                status: "success",
                message: "Cập nhật trạng thái thanh toán thành công",
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/orders/by-status/:status
    async getOrdersByStatus(req, res, next) {
        try {
            const { status } = req.params;
            const orders = await orderService.getOrdersByStatus(status);
            res.json({
                status: "success",
                data: orders,
                count: orders.length,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/orders/by-payment/:payment_status
    async getOrdersByPaymentStatus(req, res, next) {
        try {
            const { payment_status } = req.params;
            const orders = await orderService.getOrdersByPaymentStatus(
                payment_status
            );
            res.json({
                status: "success",
                data: orders,
                count: orders.length,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new OrderController();
