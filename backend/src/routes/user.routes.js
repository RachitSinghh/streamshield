const express = require("express");
const { getUsers, updateUserRole } = require("../controllers/user.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const enforceTenant = require("../middlewares/tenant.middleware");

const router = express.Router();

// All routes require authentication, tenant enforcement, and admin role
router.use(authenticate);
router.use(enforceTenant);
router.use(authorize("admin"));

// @route   GET /api/users
// @desc    Get all users in tenant
// @access  Private (Admin only)
router.get("/", getUsers);

// @route   PATCH /api/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.patch("/:id/role", updateUserRole);

module.exports = router;
