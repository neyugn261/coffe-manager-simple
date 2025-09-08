const { pool } = require("../config/database");

class OrderRepository {
    async findAll() {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(`
        SELECT o.*, 
               GROUP_CONCAT(
                 CONCAT(od.quantity, 'x ', mi.name, ' (', FORMAT(od.price, 0), '₫)')
                 SEPARATOR ', '
               ) as items_summary
        FROM orders o
        LEFT JOIN order_details od ON o.id = od.order_id
        LEFT JOIN menu_items mi ON od.menu_item_id = mi.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `);
            return rows;
        } finally {
            connection.release();
        }
    }

    async findById(id) {
        const connection = await pool.getConnection();
        try {
            const [orderRows] = await connection.execute(
                "SELECT * FROM orders WHERE id = ?",
                [id]
            );
            if (orderRows.length === 0) return null;

            const [detailRows] = await connection.execute(
                `
        SELECT od.*, mi.name as menu_item_name
        FROM order_details od
        JOIN menu_items mi ON od.menu_item_id = mi.id
        WHERE od.order_id = ?
      `,
                [id]
            );

            return {
                ...orderRows[0],
                items: detailRows,
            };
        } finally {
            connection.release();
        }
    }

    async create(orderData) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Tạo order
            const [orderResult] = await connection.execute(
                `INSERT INTO orders (customer_name, order_type, table_number, notes, total) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    orderData.customer_name,
                    orderData.order_type,
                    orderData.table_number,
                    orderData.notes,
                    orderData.total,
                ]
            );
            const orderId = orderResult.insertId;

            // Tạo order details
            for (const item of orderData.items) {
                await connection.execute(
                    "INSERT INTO order_details (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)",
                    [orderId, item.menu_item_id, item.quantity, item.price]
                );
            }

            await connection.commit();
            return { id: orderId, ...orderData };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async delete(id) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            await connection.execute(
                "DELETE FROM order_details WHERE order_id = ?",
                [id]
            );
            await connection.execute("DELETE FROM orders WHERE id = ?", [id]);

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    // Cập nhật trạng thái đơn hàng
    async updateStatus(id, status) {
        const connection = await pool.getConnection();
        try {
            const [result] = await connection.execute(
                "UPDATE orders SET status = ? WHERE id = ?",
                [status, id]
            );
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    // Cập nhật trạng thái thanh toán
    async updatePaymentStatus(id, payment_status) {
        const connection = await pool.getConnection();
        try {
            const paid_at = payment_status === "paid" ? new Date() : null;
            const [result] = await connection.execute(
                "UPDATE orders SET payment_status = ?, paid_at = ? WHERE id = ?",
                [payment_status, paid_at, id]
            );
            return result.affectedRows > 0;
        } finally {
            connection.release();
        }
    }

    // Lấy đơn hàng theo trạng thái
    async findByStatus(status) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                `
                SELECT o.*, 
                       GROUP_CONCAT(
                         CONCAT(od.quantity, 'x ', mi.name, ' (', FORMAT(od.price, 0), '₫)')
                         SEPARATOR ', '
                       ) as items_summary
                FROM orders o
                LEFT JOIN order_details od ON o.id = od.order_id
                LEFT JOIN menu_items mi ON od.menu_item_id = mi.id
                WHERE o.status = ?
                GROUP BY o.id
                ORDER BY o.created_at DESC
            `,
                [status]
            );
            return rows;
        } finally {
            connection.release();
        }
    }

    // Lấy đơn hàng theo trạng thái thanh toán
    async findByPaymentStatus(payment_status) {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                `
                SELECT o.*, 
                       GROUP_CONCAT(
                         CONCAT(od.quantity, 'x ', mi.name, ' (', FORMAT(od.price, 0), '₫)')
                         SEPARATOR ', '
                       ) as items_summary
                FROM orders o
                LEFT JOIN order_details od ON o.id = od.order_id
                LEFT JOIN menu_items mi ON od.menu_item_id = mi.id
                WHERE o.payment_status = ?
                GROUP BY o.id
                ORDER BY o.created_at DESC
            `,
                [payment_status]
            );
            return rows;
        } finally {
            connection.release();
        }
    }
}

module.exports = new OrderRepository();
