const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tenant name is required"],
      trim: true,
    },
    organizationId: {
      type: String,
      required: [true, "Organization ID is required"],
      unique: true,
      trim: true,
    },
    settings: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
tenantSchema.index({ organizationId: 1 });

const Tenant = mongoose.model("Tenant", tenantSchema);

module.exports = Tenant;
