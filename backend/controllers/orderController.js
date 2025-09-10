

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

    // DELETE /api/orders/:id
    async deleteOrder(req, res, next) {
        try {
            const { id } = req.params;
            await orderService.deleteOrder(id);
            res.json({
                status: "success",
                message: "Delete order successfully",
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



    // PUT /api/orders/:id/payment
    async updatePaymentStatus(req, res, next) {
        try {
            const { id } = req.params;
            const { payment_status } = req.body;
            await orderService.updatePaymentStatus(id, payment_status);
            res.json({
                status: "success",
                message: "Update payment status successfully",
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

    // GET /api/orders/table/:tableId - Lấy order của bàn
    async getOrdersByTable(req, res, next) {
        try {
            const { tableId } = req.params;
            const orders = await orderService.getOrdersByTable(tableId);
            res.json({
                status: "success",
                data: orders,
                count: orders.length,
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/orders/table/:tableId - Tạo order cho bàn
    async createTableOrder(req, res, next) {
        try {
            const { tableId } = req.params;
            const orderData = {
                ...req.body,
                table_id: parseInt(tableId),
                order_type: 'dine_in'
            };
            
            const order = await orderService.createOrder(orderData);
            res.status(201).json({
                status: "success",
                message: "Create table order successfully",
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/orders/takeaway - Tạo order mang đi
    async createTakeawayOrder(req, res, next) {
        try {
            const orderData = {
                ...req.body,
                table_id: null,
                order_type: 'takeaway'
            };
            
            const order = await orderService.createOrder(orderData);
            res.status(201).json({
                status: "success",
                message: "Create takeaway order successfully",
                data: order,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/orders/takeaway - Lấy danh sách order mang đi
    async getTakeawayOrders(req, res, next) {
        try {
            const orders = await orderService.getTakeawayOrders();
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
