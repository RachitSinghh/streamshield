const User = require("../models/user.model");

/**
 * Get all users in tenant
 * @route GET /api/users
 * @access Private (Admin only)
 */
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ tenantId: req.user.tenantId })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

/**
 * Update user role
 * @route PATCH /api/users/:id/role
 * @access Private (Admin only)
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validation
    if (!role || !["viewer", "editor", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be viewer, editor, or admin",
      });
    }

    // Find user in same tenant
    const user = await User.findOne({
      _id: id,
      tenantId: req.user.tenantId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update role
    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update user role error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user role",
      error: error.message,
    });
  }
};

module.exports = {
  getUsers,
  updateUserRole,
};
