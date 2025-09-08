const {
    createTables,
    insertSampleData,
    dropAllTables,
} = require("./migrations/createTables");
const { testConnection } = require("./config/database");

async function runMigration() {
    try {
        console.log("🚀 Bắt đầu Migration Database cho Cafe Manager");
        console.log("================================================\n");

        // Test kết nối trước
        console.log("🔍 Kiểm tra kết nối database...");
        const isConnected = await testConnection();

        if (!isConnected) {
            throw new Error("Không thể kết nối database");
        }

        console.log("\n📋 Tạo các bảng...");
        await createTables();

        console.log("\n📊 Thêm dữ liệu mẫu...");
        await insertSampleData();

        console.log("\n🎉 Migration hoàn thành thành công!");
        console.log("================================================");
        console.log("✅ Database đã sẵn sàng sử dụng");
        console.log("🔗 Test API: http://localhost:5000/test-db");
    } catch (error) {
        console.error("\n❌ Migration thất bại:", error.message);
        process.exit(1);
    }
}

async function resetDatabase() {
    try {
        console.log("🗑️ Reset Database - XÓA TẤT CẢ DỮ LIỆU");
        console.log("================================================\n");

        console.log("⚠️  CẢNH BÁO: Bạn sắp xóa tất cả dữ liệu!");

        // Test kết nối trước
        const isConnected = await testConnection();
        if (!isConnected) {
            throw new Error("Không thể kết nối database");
        }

        await dropAllTables();
        await createTables();
        await insertSampleData();

        console.log("\n🎉 Reset database thành công!");
    } catch (error) {
        console.error("\n❌ Reset thất bại:", error.message);
        process.exit(1);
    }
}

// Kiểm tra argument từ command line
const command = process.argv[2];

switch (command) {
    case "--reset":
        resetDatabase();
        break;
    case "--create":
    default:
        runMigration();
        break;
}

module.exports = {
    runMigration,
    resetDatabase,
};
