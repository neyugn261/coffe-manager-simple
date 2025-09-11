const authRepository = require("../repositories/authRepository");
const createError = require("../utils/createError");
const crypto = require("crypto");

// Mã mặc định để truy cập
const DEFAULT_CODE = process.env.DEFAULT_CODE || "123456";

// Thời gian hết hạn (7 ngày)
const EXPIRES_IN_DAYS = process.env.EXPIRES_IN_DAYS || 7;

class AuthService {
    // Xác thực bằng code và tạo API key
    async authenticateWithCode(code) {
        // Kiểm tra code
        if (code !== DEFAULT_CODE) {
            throw createError("Code không hợp lệ", 401);
        }

        try {
            // Xóa API key cũ (chỉ giữ 1 key)
            await authRepository.deleteAllApiKeys();

            // Tạo API key mới
            const apiKey = crypto.randomBytes(32).toString("hex");
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + EXPIRES_IN_DAYS);

            // Lưu API key
            await authRepository.createApiKey(apiKey, expiresAt);

            console.log(`✅ Tạo API key mới thành công`);

            return {
                apiKey,
                expiresAt: expiresAt.toISOString()
            };
        } catch (error) {
            throw createError(`Create API key error: ${error.message}`, 500);
        }
    }

    // Kiểm tra API key có hợp lệ không
    async validateApiKey(apiKey) {
        if (!apiKey) {
            throw createError("API key required", 401);
        }

        try {
            // Tìm API key
            const keyData = await authRepository.findApiKey(apiKey);
            if (!keyData) {
                throw createError("Invalid API key", 401);
            }

            const now = new Date();

            // Kiểm tra hết hạn
            if (new Date(keyData.expires_at) < now) {
                // Xóa key hết hạn (không log ra key)
                await authRepository.deleteApiKey(apiKey);                
                throw createError("API key expired", 401);
            }

            return keyData; // Chỉ return data khi thành công
        } catch (error) {
            throw createError(`Error authenticating API key: ${error.message}`, 500);
        }
    }

    // Middleware xác thực API key
    async authenticateApiKey(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                throw createError("Authorization header missing or malformed", 401);
            }

            const apiKey = authHeader.substring(7); // Bỏ "Bearer "
            const keyData = await this.validateApiKey(apiKey);

            // Lưu thông tin key vào request
            req.apiKey = keyData;
            next();

        } catch (error) {
            throw createError(`Error authenticating API key: ${error.message}`, 500);
        }
    }

    // Lấy thông tin API key hiện tại
    async getApiKeyInfo() {
        try {
            const keyData = await authRepository.getCurrentApiKey();
            
            if (!keyData) {
                throw createError("No API key found", 404);
            }

            return {
                hasKey: true,
                expiresAt: keyData.expires_at,
                createdAt: keyData.created_at
            };
        } catch (error) {
            throw createError(`Error retrieving API key information: ${error.message}`, 500);
        }
    }
}

module.exports = new AuthService();
