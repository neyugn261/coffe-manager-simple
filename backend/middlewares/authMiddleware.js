const authService = require("../services/authService");

// Middleware xác thực API key
const authenticateApiKey = async (req, res, next) => {
    try {
        await authService.authenticateApiKey(req, res, next);
    } catch (error) {
        // Pass error đến error handler thay vì throw
        next(error);
    }
};

module.exports = {
    authenticateApiKey
};
