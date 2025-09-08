const orderRepository = require("../repositories/orderRepository");
const menuRepository = require("../repositories/menuRepository");

class OrderService {
    async getAllOrders() {
        return await orderRepository.findAll();
    }

    async getOrderById(id) {
        if (!id || isNaN(id)) {
            throw new Error("ID đơn hàng không hợp lệ");
        }

        const order = await orderRepository.findById(id);
        if (!order) {
            throw new Error("Không tìm thấy đơn hàng");
        }

        return order;
    }

    async createOrder(orderData) {
        const {
            items,
            customer_name,
            order_type = "takeaway",
            table_number,
            notes,
        } = orderData;

        // Validate dữ liệu
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new Error("Đơn hàng phải có ít nhất 1 món");
        }

        // Validate order_type
        if (!["takeaway", "dine_in"].includes(order_type)) {
            throw new Error("Loại đơn hàng không hợp lệ");
        }

        // Nếu là dine_in thì phải có table_number
        if (order_type === "dine_in" && !table_number) {
            throw new Error("Đơn hàng ngồi uống tại quán phải có số bàn");
        }

        let total = 0;
        const validatedItems = [];

        // Validate từng item và tính tổng tiền
        for (const item of items) {
            const { menu_item_id, quantity } = item;

            if (!menu_item_id || !quantity || quantity <= 0) {
                throw new Error("Thông tin món ăn không hợp lệ");
            }

            // Kiểm tra món ăn có tồn tại không
            const menuItem = await menuRepository.findById(menu_item_id);
            if (!menuItem) {
                throw new Error(`Không tìm thấy món ăn với ID ${menu_item_id}`);
            }

            const itemTotal = menuItem.price * quantity;
            total += itemTotal;

            validatedItems.push({
                menu_item_id,
                quantity: parseInt(quantity),
                price: menuItem.price,
            });
        }

        return await orderRepository.create({
            items: validatedItems,
            total: parseFloat(total.toFixed(2)),
            customer_name: customer_name || null,
            order_type,
            table_number: order_type === "dine_in" ? table_number : null,
            notes: notes || null,
        });
    }

    async deleteOrder(id) {
        if (!id || isNaN(id)) {
            throw new Error("ID đơn hàng không hợp lệ");
        }

        // Kiểm tra đơn hàng có tồn tại không
        await this.getOrderById(id);

        return await orderRepository.delete(id);
    }

    async getOrderStatistics() {
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
    }

    // Cập nhật trạng thái đơn hàng
    async updateOrderStatus(id, status) {
        if (!id || isNaN(id)) {
            throw new Error("ID đơn hàng không hợp lệ");
        }

        const validStatuses = [
            "pending",
            "preparing",
            "ready",
            "completed",
            "cancelled",
        ];
        if (!validStatuses.includes(status)) {
            throw new Error("Trạng thái đơn hàng không hợp lệ");
        }

        // Kiểm tra đơn hàng có tồn tại không
        await this.getOrderById(id);

        return await orderRepository.updateStatus(id, status);
    }

    // Cập nhật trạng thái thanh toán
    async updatePaymentStatus(id, payment_status) {
        if (!id || isNaN(id)) {
            throw new Error("ID đơn hàng không hợp lệ");
        }

        const validPaymentStatuses = ["unpaid", "paid"];
        if (!validPaymentStatuses.includes(payment_status)) {
            throw new Error("Trạng thái thanh toán không hợp lệ");
        }

        // Kiểm tra đơn hàng có tồn tại không
        await this.getOrderById(id);

        return await orderRepository.updatePaymentStatus(id, payment_status);
    }

    // Lấy đơn hàng theo trạng thái
    async getOrdersByStatus(status) {
        const validStatuses = [
            "pending",
            "preparing",
            "ready",
            "completed",
            "cancelled",
        ];
        if (!validStatuses.includes(status)) {
            throw new Error("Trạng thái đơn hàng không hợp lệ");
        }

        return await orderRepository.findByStatus(status);
    }

    // Lấy đơn hàng theo trạng thái thanh toán
    async getOrdersByPaymentStatus(payment_status) {
        const validPaymentStatuses = ["unpaid", "paid"];
        if (!validPaymentStatuses.includes(payment_status)) {
            throw new Error("Trạng thái thanh toán không hợp lệ");
        }

        return await orderRepository.findByPaymentStatus(payment_status);
    }
}

module.exports = new OrderService();
