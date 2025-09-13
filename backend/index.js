const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testConnection } = require("./config/database");
const apiRoutes = require("./routes");
const basicRoutes = require("./routes/basicRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
    cors({
        origin: [
            process.env.FRONTEND_URL || "http://localhost:5173",
            process.env.FRONTEND_NEXT_URL || "http://localhost:3000",
        ],
        credentials: true,
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", apiRoutes);

// Basic Routes
app.use("/", basicRoutes);

// Root endpoint - minimal info
app.get("/", (req, res) => {
    res.json({
        message: "API Server",
        version: "1.0.0"
    });
});

// Error handling middleware - xử lý tất cả lỗi kể cả 404
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server đang chạy trên port ${PORT}`);
    console.log(`📝 API Docs: http://localhost:${PORT}`);

    // Test kết nối database khi start server
    console.log("\n🔍 Đang test kết nối database...");
    await testConnection();
});
