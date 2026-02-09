/**
 * Tenant isolation middleware
 * Ensures users can only access data from their own tenant
 */
const enforceTenant = (req, res, next) => {
  // Check if user is authenticated
  if (!req.user || !req.user.tenantId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  // Attach tenant filter helper to request
  req.getTenantFilter = () => {
    return { tenantId: req.user.tenantId };
  };

  next();
};

module.exports = enforceTenant;
