const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

// Login Page
router.get("/login", authController.loginPage);

// Login API
router.post("/login", authController.login);

// Dashboard
router.get(
    "/dashboard",
    auth,
    authController.dashboard
);

// Logout
router.get(
    "/logout",
    auth,
    authController.logout
);

module.exports = router;