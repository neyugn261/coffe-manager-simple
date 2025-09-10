const express = require("express");
const menuRoutes = require("./menuRoutes");
const orderRoutes = require("./orderRoutes");
const authRoutes = require("./authRoutes");
const tableRoutes = require("./tableRoutes");

const router = express.Router();

// Authentication routes (không cần xác thực)
router.use("/auth", authRoutes);

// API routes (cần xác thực)
router.use("/menu", menuRoutes);
router.use("/orders", orderRoutes);
router.use("/tables", tableRoutes);

// API info
router.get("/", (req, res) => {
    res.json({
        message: "Cafe Manager API",
        version: "1.0.0",
        endpoints: {
            login: "/api/auth/login",
            menu: "/api/menu",
            orders: "/api/orders",
            tables: "/api/tables",
            orderStatistics: "/api/orders/statistics",
            takeawayOrders: "/api/orders/takeaway",
            tableOrders: "/api/orders/table/:tableId",
        },
    });
});

module.exports = router;
