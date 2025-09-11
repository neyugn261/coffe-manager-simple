// Helper function để tạo error với statusCode - cách các web hay dùng
const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

module.exports = createError;
