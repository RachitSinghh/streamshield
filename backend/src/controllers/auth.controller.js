const User = require("../models/user.model");
const Tenant = require("../models/tenant.model");
const { generateToken } = require("../utils/generateToken");

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
const register = async (req, res) => {
  try {
    const { email, password, role, organizationName } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Create or find tenant
    let tenant;
    const orgName = organizationName || `${email.split("@")[0]}-org`;

    // Check if tenant exists
    tenant = await Tenant.findOne({ organizationId: orgName });

    if (!tenant) {
      // Create new tenant
      tenant = await Tenant.create({
        name: orgName,
        organizationId: orgName,
      });
    }

    // Create user
    const user = await User.create({
      email,
      password, // Will be hashed by pre-save hook
      role: role || "viewer",
      tenantId: tenant._id,
    });

    // Generate token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

/**
 * Login user
 * @route POST /api/auth/login
 * @access Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user (include password for comparison)
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
