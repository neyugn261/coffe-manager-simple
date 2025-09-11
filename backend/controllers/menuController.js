const menuService = require("../services/menuService");

class MenuController {
    // GET /api/menu
    async getAllMenuItems(req, res, next) {
        try {
            const menuItems = await menuService.getAllMenuItems();
            res.json({
                status: "success",
                data: menuItems,
                count: menuItems.length,
            });
        } catch (error) {
            next(error);
        }
    }

    // GET /api/menu/:id
    async getMenuItemById(req, res, next) {
        try {
            const { id } = req.params;
            const menuItem = await menuService.getMenuItemById(id);
            res.json({
                status: "success",
                data: menuItem,
            });
        } catch (error) {
            next(error);
        }
    }

    // POST /api/menu
    async createMenuItem(req, res, next) {
        try {
            const menuItem = await menuService.createMenuItem(req.body);
            res.status(201).json({
                status: "success",
                message: "Create item successfully",
                data: menuItem,
            });
        } catch (error) {
            next(error);
        }
    }

    // PATCH /api/menu/:id
    async updateMenuItem(req, res, next) {
        try {
            const { id } = req.params;
            const menuItem = await menuService.updateMenuItem(id, req.body);
            res.json({
                status: "success",
                message: "Update item successfully",
                data: menuItem,
            });
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/menu/:id
    async deleteMenuItem(req, res, next) {
        try {
            const { id } = req.params;
            await menuService.deleteMenuItem(id);
            res.json({
                status: "success",
                message: "Delete item successfully",
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new MenuController();
