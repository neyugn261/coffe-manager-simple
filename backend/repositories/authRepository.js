const { pool } = require("../config/database");

class AuthRepository {
    // Tạo API key mới
    async createApiKey(apiKey, expiresAt) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                "INSERT INTO api_keys (api_key, expires_at) VALUES (?, ?)",
                [apiKey, expiresAt]
            );
            return result.insertId;
        } finally {
            connection.release();
        }
    }

    // Tìm API key
    async findApiKey(apiKey) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                "SELECT * FROM api_keys WHERE api_key = ?",
                [apiKey]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    // Lấy API key hiện tại
    async getCurrentApiKey() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                "SELECT * FROM api_keys ORDER BY created_at DESC LIMIT 1"
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    // Xóa API key
    async deleteApiKey(apiKey) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                "DELETE FROM api_keys WHERE api_key = ?",
                [apiKey]
            );
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    // Xóa tất cả API keys
    async deleteAllApiKeys() {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute("DELETE FROM api_keys");
            return result.affectedRows;
        } finally {
            connection.release();
        }
    }
}

module.exports = new AuthRepository();
