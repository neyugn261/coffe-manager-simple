const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./config/database");
const {
    createTables,
    insertSampleData,
    dropAllTables,
} = require("./migrations/createTables");
const apiRoutes = require("./routes");
const { errorHandler, notFoundHandler } = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", apiRoutes);

// Routes cơ bản
app.get("/", (req, res) => {
    res.json({
        message: "Cafe Manager API đang hoạt động!",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            test_db: "/test-db",
            migrate: "/migrate",
            migrate_reset: "/migrate/reset",
            api: "/api",
        },
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// Test database connection endpoint
app.get("/test-db", async (req, res) => {
    try {
        const isConnected = await testConnection();

        if (isConnected) {
            res.json({
                status: "success",
                message: "Kết nối database thành công!",
                database: process.env.DB_NAME,
            });
        } else {
            res.status(500).json({
                status: "error",
                message: "Không thể kết nối database",
            });
        }
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Lỗi server",
            error: error.message,
        });
    }
});

// Migration endpoints
app.post("/migrate", async (req, res) => {
    try {
        console.log("🔄 Bắt đầu migration từ API...");

        await createTables();
        await insertSampleData();

        res.json({
            status: "success",
            message: "Migration hoàn thành thành công!",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ Migration lỗi:", error.message);
        res.status(500).json({
            status: "error",
            message: "Migration thất bại",
            error: error.message,
        });
    }
});

app.post("/migrate/reset", async (req, res) => {
    try {
        console.log("🗑️ Reset database từ API...");

        await dropAllTables();
        await createTables();
        await insertSampleData();

        res.json({
            status: "success",
            message: "Reset database thành công!",
            warning: "Tất cả dữ liệu cũ đã bị xóa",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ Reset lỗi:", error.message);
        res.status(500).json({
            status: "error",
            message: "Reset database thất bại",
            error: error.message,
        });
    }
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use(notFoundHandler);

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server đang chạy trên port ${PORT}`);
    console.log(`📝 API Docs: http://localhost:${PORT}`);

    // Test kết nối database khi start server
    console.log("\n🔍 Đang test kết nối database...");
    await testConnection();
});
