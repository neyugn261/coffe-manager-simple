const authService = require("../services/authService");
const createError = require("../utils/createError");

class AuthController {
    // POST /api/auth/login - Đăng nhập bằng code
    async login(req, res, next) {
        try {
            const { code } = req.body;

            if (!code) {
                return next(createError("Code is required", 400));
            }

            const result = await authService.authenticateWithCode(code);
            
            res.json({
                success: true,
                message: "Login successful",
                data: result
            });

        } catch (error) {
            next(error); // Chuyển lỗi cho errorHandler xử lý
        }
    }
}

module.exports = new AuthController();
