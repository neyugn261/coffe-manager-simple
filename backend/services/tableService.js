const tableRepository = require("../repositories/tableRepository");
const createError = require("../utils/createError");

class TableService {
    // Lấy tất cả bàn với thông tin chi tiết
    async getAllTables() {
        try {
            // Repository đã xử lý role rồi, chỉ cần return
            return await tableRepository.getAllTables();
        } catch (error) {
            throw createError(`Error retrieving tables: ${error.message}`, 500);
        }
    }

    // Lấy bàn theo ID
    async getTableById(id) {
        if (!id || isNaN(id)) {
            throw createError('Invalid table ID', 400);
        }
        try {
            const table = await tableRepository.getTableById(id);
            if (!table) {
                throw createError('Table not found', 404);
            }            
            return table;
        } catch (error) {
            if (error.status === 404) {
                throw error; // Rethrow lỗi không tìm thấy
            }
            throw createError(`Error retrieving table ${id}: ${error.message}`, 500);
        }
    }

    // Tạo bàn mới
    async createTable(tableData) {
        if (!tableData.table_name) {
            throw createError('Table name is required', 400);
        }
        try {
            const { table_name } = tableData;

            // Kiểm tra tên bàn đã tồn tại chưa
            const existingTable = await tableRepository.getTableByName(table_name);
            if (existingTable) {
                throw createError('Table name already exists', 409);
            }

            return await tableRepository.createTable(tableData);
        } catch (error) {
            if (error.status === 409) {
                throw error; // Rethrow lỗi trùng tên
            }
            throw createError(`Error creating table: ${error.message}`, 500);
        }
    }

    // Cập nhật trạng thái bàn
    async updateTableStatus(id, status) {
        if (!id || isNaN(id)) {
            throw createError('Invalid table ID', 400);
        }

        const validStatuses = ['empty', 'occupied'];
        if (!validStatuses.includes(status)) {
            throw createError('Invalid table status', 400);
        }
        try {
            const table = await tableRepository.getTableById(id);
            if (!table) {
                throw createError('Table not found', 404);
            }

            return await tableRepository.updateTableStatus(id, status);
        } catch (error) {
            if (error.status === 404) {
                throw error; // Rethrow lỗi không tìm thấy
            }
            throw createError(`Error updating table status: ${error.message}`, 500);
        }
    }

    // Gộp bàn
    async mergeTables(hostId, tableIds) {
        if (!hostId || !tableIds) {
            throw createError('Host ID and table IDs are required', 400);
        }
        // Validate input
        if (!Array.isArray(tableIds) || tableIds.length < 1) {
            throw createError('At least 1 child table is required to merge', 400);
        }

        if (tableIds.includes(hostId)) {
            throw createError('Host table should not be included in child table list', 400);
        }
        try {           
            // Kiểm tra host table
            const hostTable = await tableRepository.getTableById(hostId);
            if (!hostTable) {
                throw createError(`Host table with ID ${hostId} not found`, 404);
            }
            if (hostTable.status === 'occupied') {
                throw createError(`Host table ${hostTable.table_name} is currently occupied`, 400);
            }
            if (hostTable.is_merged || hostTable.host_id) {
                throw createError(`Host table ${hostTable.table_name} has already been merged`, 400);
            }

            // Kiểm tra tất cả bàn con có tồn tại và trống không
            for (const tableId of tableIds) {
                const table = await tableRepository.getTableById(tableId);
                if (!table) {
                    throw createError(`Table with ID ${tableId} not found`, 404);
                }
                if (table.status === 'occupied') {
                    throw createError(`Table ${table.table_name} is currently occupied`, 400);
                }
                if (table.is_merged || table.host_id) {
                    throw createError(`Table ${table.table_name} has already been merged`, 400);
                }
            }

            const result = await tableRepository.mergeTables(hostId, tableIds);
            
            // Log thông tin gộp bàn
            console.log(`✅ Gộp bàn thành công: Host ${hostId} với các bàn con [${tableIds.join(', ')}]`);
            console.log(`📝 Tất cả orders đã được chuyển về bàn host`);
            
            return result;
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }
            throw createError(`Error merging tables: ${error.message}`, 500);
        }
    }

    // Tách bàn
    async splitTables(hostId) {
        if (!hostId) {
            throw createError('Host ID is required', 400);
        }
        try {
            const table = await tableRepository.getTableById(hostId);
            if (!table) {
                throw createError('Table not found', 404);
            }

            if (!table.is_merged) {
                throw createError('Table is not merged', 400);
            }

            const result = await tableRepository.splitTables(hostId);
            
            // Log thông tin tách bàn
            console.log(`✅ Tách bàn thành công: Host ${hostId}`);
            console.log(`📝 Tất cả orders vẫn thuộc về bàn host, các bàn con trở về trạng thái trống`);
            
            return result;
        } catch (error) {
            if (error.statusCode) {
                throw error;
            }
            throw createError(`Error splitting tables: ${error.message}`, 500);
        }
    }

    // Xóa bàn
    async deleteTable(id) {
        if (!id || isNaN(id)) {
            throw createError('Invalid table ID', 400);
        }
        try {
            const table = await tableRepository.getTableById(id);
            if (!table) {
                throw createError('Table not found', 404);
            }
            if (table.status === 'occupied') {
                throw createError('Cannot delete an occupied table', 400);
            }
            if(table.is_merged || table.host_id) {
                throw createError('Cannot delete a merged or child table', 400);
            }
            const success = await tableRepository.deleteTable(id);
            if (!success) {
                throw createError('Unable to delete table', 400);
            }          
        } catch (error) {
            throw createError(`Error deleting table: ${error.message}`, 500);
        }
    }

    // Lấy bàn trống
    async getAvailableTables() {
        try {
            return await tableRepository.getAvailableTables();
        } catch (error) {
            throw createError(`Error retrieving available tables: ${error.message}`, 500);
        }
    }

    // Đặt bàn (chuyển trạng thái sang occupied)
    async occupyTable(id) {
        if (!id || isNaN(id)) {
            throw createError('Invalid table ID', 400);
        }
        try {
            const table = await tableRepository.getTableById(id);
            if (!table) {
                throw createError('Table not found', 404);
            }

            if (table.status === 'occupied') {
                throw createError('Table is already occupied', 400);
            }

            if (table.host_id) {
                throw createError('Cannot occupy child table, please occupy the main table', 400);
            }

            return await tableRepository.updateTableStatus(id, 'occupied');
        } catch (error) {
            if (error.status === 404) {
                throw error; // Rethrow lỗi không tìm thấy
            }
            throw createError(`Error occupying table: ${error.message}`, 500);
        }
    }

    // Checkout bàn (chuyển trạng thái về empty)
    async checkoutTable(id) {
        if (!id || isNaN(id)) {
            throw createError('Invalid table ID', 400);
        }
        try {
            const table = await tableRepository.getTableById(id);
            if (!table) {
                throw createError('Table not found', 404);
            }

            if (table.status === 'empty') {
               throw createError('Table is already empty', 400);
            }

            return await tableRepository.updateTableStatus(id, 'empty');
        } catch (error) {
            if (error.status === 404) {
                throw error; // Rethrow lỗi không tìm thấy
            }
            throw createError(`Error checking out table: ${error.message}`, 500);
        }
    }
}

module.exports = new TableService();
