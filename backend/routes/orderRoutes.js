const express = require("express");
const orderController = require("../controllers/orderController");
const { authenticateApiKey } = require("../middlewares/authMiddleware");

const router = express.Router();

// Áp dụng middleware xác thực cho tất cả routes  
router.use(authenticateApiKey);

// GET /api/orders/statistics - Lấy thống kê đơn hàng (phải đặt trước route /:id)
router.get("/statistics", orderController.getOrderStatistics);

// GET /api/orders/by-payment/:payment_status - Lấy đơn hàng theo trạng thái thanh toán
router.get(
    "/by-payment/:payment_status",
    orderController.getOrdersByPaymentStatus
);

// GET /api/orders/takeaway - Lấy đơn hàng mang đi
router.get("/takeaway", orderController.getTakeawayOrders);

// GET /api/orders/table/:tableId - Lấy đơn hàng của bàn
router.get("/table/:tableId", orderController.getOrdersByTable);

// GET /api/orders - Lấy tất cả đơn hàng
router.get("/", orderController.getAllOrders);

// GET /api/orders/:id - Lấy đơn hàng theo ID
router.get("/:id", orderController.getOrderById);

// POST /api/orders/takeaway - Tạo đơn hàng mang đi
router.post("/takeaway", orderController.createTakeawayOrder);

// POST /api/orders/table/:tableId - Tạo đơn hàng cho bàn
router.post("/table/:tableId", orderController.createTableOrder);

// PUT /api/orders/:id/payment - Cập nhật trạng thái thanh toán
router.put("/:id/payment", orderController.updatePaymentStatus);

// DELETE /api/orders/:id - Xóa đơn hàng
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
