const express = require("express");
const { testConnection } = require("../config/database");
const { protectSensitive } = require("../middlewares/protectSensitive");

const router = express.Router();

// Áp dụng middleware bảo vệ cho tất cả routes
router.use(protectSensitive);

// Health check endpoint - minimal info
router.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
    });
});

// Test database connection - không tiết lộ DB name
router.get("/test-db", async (req, res) => {
    try {
        const isConnected = await testConnection();

        if (isConnected) {
            res.json({
                success: true,
                message: "Database connected"
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Database connection failed"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

module.exports = router;
