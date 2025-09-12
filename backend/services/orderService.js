const orderRepository = require("../repositories/orderRepository");
const menuRepository = require("../repositories/menuRepository");
const createError = require("../utils/createError");

class OrderService {
    async getAllOrders() {
        try {   
            return await orderRepository.findAll();
        } catch (error) {
            throw createError(`Error retrieving orders: ${error.message}`, 500);
        }
    }

    async getOrderById(id) {
        if (!id || isNaN(id)) {
            throw createError("Invalid order ID", 400);
        }
        try {            
            const order = await orderRepository.findById(id);
            if (!order) {
                throw createError("Order not found", 404);
            }

            return order;
        } catch (error) {
            if (error.status === 404) {
                throw error; // Rethrow lỗi không tìm thấy
            }
            throw createError(`Error retrieving order ${id}: ${error.message}`, 500);
        }
    }

    async createOrder(orderData) {
        const {
            items,
            customer_name,
            order_type = "takeaway",
            table_id,
            notes,
        } = orderData;

        // Validate dữ liệu
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw createError("Order must contain at least 1 item", 400);
        }

        // Validate order_type
        if (!["takeaway", "dine_in"].includes(order_type)) {
            throw createError("Invalid order type", 400);
        }

        // Nếu là dine_in thì phải có table_id
        if (order_type === "dine_in" && !table_id) {
            throw createError("Dine-in orders must have a table_id", 400);
        }

        let total = 0;
        const validatedItems = [];

        // Validate từng item và tính tổng tiền
        for (const item of items) {
            const { menu_item_id, quantity } = item;

            if (!menu_item_id || !quantity || quantity <= 0) {
                throw createError("Invalid item data", 400);
            }

            // Kiểm tra món ăn có tồn tại không
            const menuItem = await menuRepository.findById(menu_item_id);
            if (!menuItem) {
                throw createError(`Menu item not found: ${menu_item_id}`, 404);
            }

            const itemTotal = menuItem.price * quantity;
            total += itemTotal;

            validatedItems.push({
                menu_item_id,
                quantity: parseInt(quantity),
                price: menuItem.price,
            });
        }
        try {
            return await orderRepository.create({
                items: validatedItems,
                total: parseFloat(total.toFixed(2)),
                customer_name: customer_name || null,
                order_type,
                table_id: order_type === "dine_in" ? table_id : null,
                notes: notes || null,
            });
        } catch (error) {
            throw createError(`Error creating order: ${error.message}`, 500);
        }
    }

    async deleteOrder(id) {
        if (!id || isNaN(id)) {
            throw createError("Invalid order ID", 400);
        }
        try {
            // Kiểm tra đơn hàng có tồn tại không
            await this.getOrderById(id);
            return await orderRepository.delete(id);
        } catch (error) {
            throw createError(`Error deleting order ${id}: ${error.message}`, 500);
        }
    }

    async getOrderStatistics() {
        try {
            const orders = await orderRepository.findAll();

            const totalOrders = orders.length;
            const totalRevenue = orders.reduce(
                (sum, order) => sum + parseFloat(order.total),
                0
            );
            const averageOrderValue =
                totalOrders > 0 ? totalRevenue / totalOrders : 0;

            return {
                totalOrders,
                totalRevenue: parseFloat(totalRevenue.toFixed(2)),
                averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
            };
        } catch (error) {
            throw createError(`Error retrieving order statistics: ${error.message}`, 500);
        }
    }

    // Cập nhật trạng thái thanh toán
    async updatePaymentStatus(id, payment_status) {
        if (!id || isNaN(id)) {
            throw createError("Invalid order ID", 400);
        }

        const validPaymentStatuses = ["unpaid", "paid"];
        if (!validPaymentStatuses.includes(payment_status)) {
            throw createError("Invalid payment status", 400);
        }
        try {
            // Kiểm tra đơn hàng có tồn tại không
            await this.getOrderById(id);

            return await orderRepository.updatePaymentStatus(id, payment_status);
        } catch (error) {
            throw createError(`Error updating payment status: ${error.message}`, 500);
        }
    }

    // Lấy đơn hàng theo trạng thái thanh toán
    async getOrdersByPaymentStatus(payment_status) {
        const validPaymentStatuses = ["unpaid", "paid"];
        if (!validPaymentStatuses.includes(payment_status)) {
            throw createError("Invalid payment status", 400);
        }
        try {
            return await orderRepository.findByPaymentStatus(payment_status);
        } catch (error) {
            throw createError(`Error retrieving orders by payment status: ${error.message}`, 500);
        }
    }

    // Lấy order của bàn
    async getOrdersByTable(tableId) {
        if (!tableId || isNaN(tableId)) {
            throw createError("Invalid table ID", 400);
        }
        try {
            return await orderRepository.findByTableId(tableId);
        } catch (error) {
            throw createError(`Error retrieving orders by table ID: ${error.message}`, 500);
        }
    }

    // Lấy order mang đi
    async getTakeawayOrders() {
        try {
            return await orderRepository.findByOrderType('takeaway');
        } catch (error) {
            throw createError(`Error retrieving takeaway orders: ${error.message}`, 500);
        }
    }
}

module.exports = new OrderService();
