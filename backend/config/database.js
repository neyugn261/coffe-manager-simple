const mysql = require("mysql2/promise");
require("dotenv").config();

// Cấu hình kết nối database
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false, // Cần thiết cho Aiven
    },
    connectTimeout: 60000,
};

// Tạo connection pool
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Test kết nối
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ Kết nối database thành công!");

        // Test query đơn giản
        const [rows] = await connection.execute("SELECT 1 as test");
        console.log("✅ Test query thành công:", rows);

        connection.release();
        return true;
    } catch (error) {
        console.error("❌ Lỗi kết nối database:", error.message);
        return false;
    }
}

module.exports = {
    pool,
    testConnection,
};
