const express = require("express");
const authController = require("../controllers/authController");
const { rateLimitAuth } = require("../middlewares/rateLimitAuth");

const router = express.Router();

// POST /api/auth/login - Đăng nhập bằng code (có rate limiting)
router.post("/login", rateLimitAuth, authController.login);

module.exports = router;
