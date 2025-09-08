const express = require("express");
const orderController = require("../controllers/orderController");

const router = express.Router();

// GET /api/orders/statistics - Lấy thống kê đơn hàng (phải đặt trước route /:id)
router.get("/statistics", orderController.getOrderStatistics);

// GET /api/orders/by-status/:status - Lấy đơn hàng theo trạng thái
router.get("/by-status/:status", orderController.getOrdersByStatus);

// GET /api/orders/by-payment/:payment_status - Lấy đơn hàng theo trạng thái thanh toán
router.get(
    "/by-payment/:payment_status",
    orderController.getOrdersByPaymentStatus
);

// GET /api/orders - Lấy tất cả đơn hàng
router.get("/", orderController.getAllOrders);

// GET /api/orders/:id - Lấy đơn hàng theo ID
router.get("/:id", orderController.getOrderById);

// POST /api/orders - Tạo đơn hàng mới
router.post("/", orderController.createOrder);

// PUT /api/orders/:id/status - Cập nhật trạng thái đơn hàng
router.put("/:id/status", orderController.updateOrderStatus);

// PUT /api/orders/:id/payment - Cập nhật trạng thái thanh toán
router.put("/:id/payment", orderController.updatePaymentStatus);

// DELETE /api/orders/:id - Xóa đơn hàng
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
