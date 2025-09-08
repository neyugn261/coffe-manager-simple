const express = require("express");
const menuController = require("../controllers/menuController");

const router = express.Router();

// GET /api/menu - Lấy tất cả menu items
router.get("/", menuController.getAllMenuItems);

// GET /api/menu/:id - Lấy menu item theo ID
router.get("/:id", menuController.getMenuItemById);

// POST /api/menu - Tạo menu item mới
router.post("/", menuController.createMenuItem);

// PUT /api/menu/:id - Cập nhật menu item
router.put("/:id", menuController.updateMenuItem);

// DELETE /api/menu/:id - Xóa menu item
router.delete("/:id", menuController.deleteMenuItem);

module.exports = router;
