const { pool } = require("../config/database");

class MenuRepository {
    async findAll() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                "SELECT * FROM menu_items ORDER BY id"
            );
            return rows;
        } finally {
            connection.release();
        }
    }

    async findById(id) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                "SELECT * FROM menu_items WHERE id = ?",
                [id]
            );
            return rows[0] || null;
        } finally {
            connection.release();
        }
    }

    async create(menuItem) {
        const connection = await pool.getConnection();
        try {
            const { name, price, category, image_url } = menuItem;
            const [result] = await connection.execute(
                "INSERT INTO menu_items (name, price, category, image_url) VALUES (?, ?, ?, ?)",
                [name, price, category, image_url]
            );
            return { id: result.insertId, ...menuItem };
        } finally {
            connection.release();
        }
    }

    async update(id, updateData) {
        const connection = await pool.getConnection();
        try {
            // Tạo dynamic SQL dựa trên các trường cần update
            const fields = Object.keys(updateData);
            const values = Object.values(updateData);
            if (fields.length === 0) {
                throw new Error("No fields to update");
            }
            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const sql = `UPDATE menu_items SET ${setClause} WHERE id = ?`;
            const [result] = await connection.execute(sql, [...values, id]);
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    async delete(id) {
        const connection = await pool.getConnection();
        try {
            await connection.execute("DELETE FROM menu_items WHERE id = ?", [
                id,
            ]);
            return true;
        } finally {
            connection.release();
        }
    }
}

module.exports = new MenuRepository();
