// Simple rate limiting để chống brute force
const rateLimitStore = new Map();

// Cấu hình
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 phút
const MAX_ATTEMPTS = 5; // Tối đa 5 lần thử

const rateLimitAuth = (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Lấy thông tin từ store
    const clientData = rateLimitStore.get(clientIp) || { attempts: 0, firstAttempt: now };
    
    // Reset nếu đã hết window
    if (now - clientData.firstAttempt > RATE_LIMIT_WINDOW) {
        clientData.attempts = 1;
        clientData.firstAttempt = now;
    } else {
        clientData.attempts++;
    }
    
    // Cập nhật store
    rateLimitStore.set(clientIp, clientData);
    
    // Kiểm tra limit
    if (clientData.attempts > MAX_ATTEMPTS) {
        return res.status(429).json({
            success: false,
            message: "Too many requests"
        });
    }
    
    next();
};

// Cleanup store định kỳ
setInterval(() => {
    const now = Date.now();
    for (const [ip, data] of rateLimitStore.entries()) {
        if (now - data.firstAttempt > RATE_LIMIT_WINDOW) {
            rateLimitStore.delete(ip);
        }
    }
}, RATE_LIMIT_WINDOW);

module.exports = {
    rateLimitAuth
};
