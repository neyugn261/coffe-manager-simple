const authService = require("../services/authService");

// Middleware xác thực API key
const authenticateApiKey = async (req, res, next) => {
    return authService.authenticateApiKey(req, res, next);
};

module.exports = {
    authenticateApiKey
};
