const menuRepository = require("../repositories/menuRepository");

class MenuService {
    async getAllMenuItems() {
        return await menuRepository.findAll();
    }

    async getMenuItemById(id) {
        if (!id || isNaN(id)) {
            throw new Error("ID không hợp lệ");
        }

        const menuItem = await menuRepository.findById(id);
        if (!menuItem) {
            throw new Error("Không tìm thấy món ăn");
        }

        return menuItem;
    }

    async createMenuItem(menuItemData) {
        const { name, price, unit, image_url } = menuItemData;

        // Validate dữ liệu
        if (!name || !price) {
            throw new Error("Tên và giá món ăn là bắt buộc");
        }

        if (price <= 0) {
            throw new Error("Giá phải lớn hơn 0");
        }

        return await menuRepository.create({
            name: name.trim(),
            price: parseFloat(price),
            unit: unit || "ly",
            image_url: image_url || null,
        });
    }

    async updateMenuItem(id, menuItemData) {
        if (!id || isNaN(id)) {
            throw new Error("ID không hợp lệ");
        }

        // Kiểm tra món ăn có tồn tại không
        await this.getMenuItemById(id);

        const { name, price, unit, image_url } = menuItemData;

        // Validate dữ liệu
        if (!name || !price) {
            throw new Error("Tên và giá món ăn là bắt buộc");
        }

        if (price <= 0) {
            throw new Error("Giá phải lớn hơn 0");
        }

        return await menuRepository.update(id, {
            name: name.trim(),
            price: parseFloat(price),
            unit: unit || "ly",
            image_url: image_url || null,
        });
    }

    async deleteMenuItem(id) {
        if (!id || isNaN(id)) {
            throw new Error("ID không hợp lệ");
        }

        // Kiểm tra món ăn có tồn tại không
        await this.getMenuItemById(id);

        return await menuRepository.delete(id);
    }
}

module.exports = new MenuService();
