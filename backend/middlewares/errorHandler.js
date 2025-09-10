// Cách xử lý lỗi đơn giản nhất - chỉ cần 1 middleware
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);

    // Lấy statusCode từ error object hoặc mặc định 500
    const statusCode = err.statusCode || err.status || 500;
    const message =  "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        message: message
    });
};

module.exports = errorHandler;
