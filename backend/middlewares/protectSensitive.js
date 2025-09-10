// Middleware để bảo vệ sensitive endpoints
const protectSensitive = (req, res, next) => {
    // Danh sách các endpoints nhạy cảm
    const sensitiveEndpoints = ['/test-db'];
    
    // Kiểm tra nếu request đến sensitive endpoint
    if (sensitiveEndpoints.some(endpoint => req.path.startsWith(endpoint))) {
        // Chỉ cho phép từ localhost trong development
        const clientIp = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
        const isLocalhost = clientIp === '::1' || clientIp === '127.0.0.1' || clientIp === '::ffff:127.0.0.1';
        
        // Trong production, chặn hoàn toàn
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });
        }
        
        // Trong development, chỉ cho phép localhost
        if (!isLocalhost) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
    }
    
    next();
};

module.exports = {
    protectSensitive
};
