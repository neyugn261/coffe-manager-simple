const express = require("express");
const menuRoutes = require("./menuRoutes");
const orderRoutes = require("./orderRoutes");

const router = express.Router();

// API routes
router.use("/menu", menuRoutes);
router.use("/orders", orderRoutes);

// API info
router.get("/", (req, res) => {
    res.json({
        message: "Cafe Manager API",
        version: "1.0.0",
        endpoints: {
            menu: "/api/menu",
            orders: "/api/orders",
            orderStatistics: "/api/orders/statistics",
        },
    });
});

module.exports = router;
