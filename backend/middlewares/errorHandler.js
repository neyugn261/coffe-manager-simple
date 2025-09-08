// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);
    console.error("Stack:", err.stack);

    // Default error
    let error = {
        status: "error",
        message: err.message || "Có lỗi xảy ra trên server",
    };

    // MySQL errors
    if (err.code === "ER_DUP_ENTRY") {
        error.message = "Dữ liệu đã tồn tại";
        return res.status(409).json(error);
    }

    if (err.code === "ER_NO_REFERENCED_ROW_2") {
        error.message = "Dữ liệu tham chiếu không tồn tại";
        return res.status(400).json(error);
    }

    // Validation errors
    if (
        err.message.includes("không hợp lệ") ||
        err.message.includes("bắt buộc") ||
        err.message.includes("phải lớn hơn")
    ) {
        return res.status(400).json(error);
    }

    // Not found errors
    if (err.message.includes("Không tìm thấy")) {
        return res.status(404).json(error);
    }

    // Server errors
    return res.status(500).json(error);
};

// 404 handler
const notFoundHandler = (req, res) => {
    res.status(404).json({
        status: "error",
        message: `Endpoint ${req.method} ${req.path} không tồn tại`,
    });
};

module.exports = {
    errorHandler,
    notFoundHandler,
};
