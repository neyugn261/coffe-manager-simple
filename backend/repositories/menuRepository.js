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
            const { name, price, unit, image_url } = menuItem;
            const [result] = await connection.execute(
                "INSERT INTO menu_items (name, price, unit, image_url) VALUES (?, ?, ?, ?)",
                [name, price, unit, image_url]
            );
            return { id: result.insertId, ...menuItem };
        } finally {
            connection.release();
        }
    }

    async update(id, menuItem) {
        const connection = await pool.getConnection();
        try {
            const { name, price, unit, image_url } = menuItem;
            await connection.execute(
                "UPDATE menu_items SET name = ?, price = ?, unit = ?, image_url = ? WHERE id = ?",
                [name, price, unit, image_url, id]
            );
            return { id, ...menuItem };
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
