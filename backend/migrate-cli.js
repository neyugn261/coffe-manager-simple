#!/usr/bin/env node

// Script CLI để migration - an toàn hơn web endpoint
const {
    createTables,
    insertSampleData,
    dropAllTables,
} = require("./migrations/createTables");
require("dotenv").config();

async function runMigration() {
    try {
        console.log("🔄 Bắt đầu Migration Database...");
        
        await createTables();
        await insertSampleData();
        
        console.log("✅ Migration hoàn thành thành công!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Migration thất bại:", error.message);
        process.exit(1);
    }
}

async function resetDatabase() {
    try {
        console.log("🗑️ Reset Database - XÓA TẤT CẢ DỮ LIỆU");
        console.log("⚠️  CẢNH BÁO: Bạn sắp xóa tất cả dữ liệu!");
        
        await dropAllTables();
        await createTables();
        await insertSampleData();
        
        console.log("✅ Reset database thành công!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Reset thất bại:", error.message);
        process.exit(1);
    }
}

// Xử lý command line arguments
const command = process.argv[2];

switch (command) {
    case "reset":
        resetDatabase();
        break;
    case "migrate":
    default:
        runMigration();
        break;
}
