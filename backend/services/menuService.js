const menuRepository = require("../repositories/menuRepository");
const createError = require("../utils/createError");

class MenuService {
    async getAllMenuItems() {
        try {
            return await menuRepository.findAll();
        } catch (error) {
            throw createError("Error retrieving menu items", 500);
        }
    }

    async getMenuItemById(id) {
        if (!id || isNaN(id)) {
            throw createError("Invalid menu item ID", 400);
        }

        try {
            const menuItem = await menuRepository.findById(id);
            if (!menuItem) {
                throw createError("Menu item not found", 404);
            }
            return menuItem;
        } catch (error) {
            throw createError(`Error retrieving menu item ${id}: ${error.message}`, 500);
        }
    }    

    async createMenuItem(menuItemData) {
        try {
            const { name, price, category, image_url } = menuItemData;

            // Validate dữ liệu
            if (!name) {
                throw new ValidationError("Name is required", "name", name);
            }
            
            if (!price) {
                throw new ValidationError("Price is required", "price", price);
            }

            if (price <= 0) {
                throw new ValidationError("Price must be greater than 0", "price", price);
            }

            return await menuRepository.create({
                name: name.trim(),
                price: parseFloat(price),
                category: category || 'other',
                image_url: image_url || null,
            });
        } catch (error) {
            throw createError(`Error creating menu item: ${error.message}`, 500);
        }
    }

    async updateMenuItem(id, menuItemData) {        
        try {
            if (!id || isNaN(id)) {
                throw new ValidationError("ID món ăn không hợp lệ", "id", id);
            }
            // Kiểm tra món ăn có tồn tại không
            await this.getMenuItemById(id);

            const { name, price, category, image_url } = menuItemData;
            // Validate dữ liệu
            const updateData = {};
            if (name !== undefined && name !== null && name.trim() !== '') {
                updateData.name = name.trim();
            }

            if (price !== undefined && price !== null) {
                updateData.price = parseFloat(price);
            }

            if (category !== undefined && category !== null && category !== '') {
                updateData.category = category;
            }

            if (image_url !== undefined) {
                updateData.image_url = image_url;
            }

            // Nếu không có gì để update
            if (Object.keys(updateData).length === 0) {
               throw createError("No data provided for update", 400);
            }

            return await menuRepository.update(id, updateData);
        } catch (error) {
            throw createError(`Error updating menu item ${id}: ${error.message}`, 500);
        }
    }

    async deleteMenuItem(id) {
        try {
            if (!id || isNaN(id)) {
                throw new createError("Invalid menu item ID", 400);
            }

            // Kiểm tra món ăn có tồn tại không
            await this.getMenuItemById(id);

            return await menuRepository.delete(id);
        } catch (error) {
            throw createError(`Error deleting menu item ${id}: ${error.message}`, 500);
        }
    }
}

module.exports = new MenuService();
