const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    filename: {
      type: String,
      required: [true, "Filename is required"],
    },
    filepath: {
      type: String,
      required: [true, "File path is required"],
    },
    filesize: {
      type: Number,
      required: [true, "File size is required"],
    },
    mimetype: {
      type: String,
      required: [true, "MIME type is required"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Uploader ID is required"],
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant ID is required"],
    },
    status: {
      type: String,
      enum: ["uploaded", "processing", "safe", "flagged", "failed"],
      default: "uploaded",
    },
    processingProgress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    sensitivityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    processedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for efficient queries
videoSchema.index({ tenantId: 1, status: 1 });
videoSchema.index({ uploadedBy: 1 });
videoSchema.index({ createdAt: -1 });

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
