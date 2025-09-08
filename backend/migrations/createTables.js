const { pool } = require("../config/database");

// SQL tạo các bảng đơn giản cho quán cafe nhỏ
const createTablesSQL = {
    // Bảng menu items (sản phẩm)
    menu_items: `
    CREATE TABLE IF NOT EXISTS menu_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      category ENUM('coffee', 'tea', 'juice', 'food', 'other') DEFAULT 'other',
      image_url VARCHAR(255)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,

    // Bảng orders (đơn hàng)
    orders: `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      customer_name VARCHAR(255),
      order_type ENUM('takeaway', 'dine_in') DEFAULT 'takeaway',
      table_number INT NULL,
      status ENUM('pending', 'preparing', 'ready', 'completed', 'cancelled') DEFAULT 'pending',
      payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
      notes TEXT,
      total DECIMAL(10,2) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      paid_at DATETIME NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,

    // Bảng order_details (chi tiết đơn hàng)
    order_details: `
    CREATE TABLE IF NOT EXISTS order_details (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      menu_item_id INT,
      quantity INT,
      price DECIMAL(10,2),
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `,
};

// Dữ liệu mẫu đơn giản
const sampleData = {
    menu_items: `
    INSERT INTO menu_items (id, name, price, category, image_url) VALUES
    (1, 'Cà phê đen', 15000, 'coffee', 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=300&fit=crop&crop=center'),
    (2, 'Cà phê sữa', 20000, 'coffee', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center'),
    (3, 'Cappuccino', 35000, 'coffee', 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=300&fit=crop&crop=center'),
    (4, 'Latte', 35000, 'coffee', 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400&h=300&fit=crop&crop=center'),
    (5, 'Trà đào', 25000, 'tea', 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop&crop=center'),
    (6, 'Trà sữa', 30000, 'tea', 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=300&fit=crop&crop=center'),
    (7, 'Sinh tố bơ', 35000, 'juice', 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=300&fit=crop&crop=center'),
    (8, 'Nước ép cam', 25000, 'juice', 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop&crop=center'),
    (9, 'Bánh croissant', 25000, 'food', 'https://images.unsplash.com/photo-1555507036-ab794f4807ed?w=400&h=300&fit=crop&crop=center'),
    (10, 'Bánh mì sandwich', 45000, 'food', 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400&h=300&fit=crop&crop=center')
    ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    price = VALUES(price),
    category = VALUES(category),
    image_url = VALUES(image_url);
  `,
};

async function createTables() {
    const connection = await pool.getConnection();

    try {
        console.log("🔨 Bắt đầu tạo bảng database đơn giản...");

        // Tạo từng bảng theo thứ tự (quan trọng vì có foreign key)
        const tableOrder = ["menu_items", "orders", "order_details"];

        for (const tableName of tableOrder) {
            console.log(`📋 Tạo bảng: ${tableName}`);
            await connection.execute(createTablesSQL[tableName]);
            console.log(`✅ Bảng ${tableName} đã tạo thành công`);
        }

        console.log("🎯 Tất cả bảng đã được tạo thành công!");
        return true;
    } catch (error) {
        console.error("❌ Lỗi khi tạo bảng:", error.message);
        throw error;
    } finally {
        connection.release();
    }
}

async function insertSampleData() {
    const connection = await pool.getConnection();

    try {
        console.log("📝 Bắt đầu thêm dữ liệu mẫu...");

        console.log(`📊 Thêm dữ liệu menu items`);
        await connection.execute(sampleData.menu_items);
        console.log(`✅ Dữ liệu menu items đã thêm thành công`);

        console.log("🎉 Tất cả dữ liệu mẫu đã được thêm!");
        return true;
    } catch (error) {
        console.error("❌ Lỗi khi thêm dữ liệu mẫu:", error.message);
        throw error;
    } finally {
        connection.release();
    }
}

async function dropAllTables() {
    const connection = await pool.getConnection();

    try {
        console.log("🗑️ Xóa tất cả bảng...");

        // Tắt foreign key checks để có thể xóa bảng
        await connection.execute("SET FOREIGN_KEY_CHECKS = 0");

        const tables = ["order_details", "orders", "menu_items"];

        for (const table of tables) {
            await connection.execute(`DROP TABLE IF EXISTS ${table}`);
            console.log(`✅ Đã xóa bảng: ${table}`);
        }

        // Bật lại foreign key checks
        await connection.execute("SET FOREIGN_KEY_CHECKS = 1");

        console.log("🎯 Đã xóa tất cả bảng!");
        return true;
    } catch (error) {
        console.error("❌ Lỗi khi xóa bảng:", error.message);
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = {
    createTables,
    insertSampleData,
    dropAllTables,
};
