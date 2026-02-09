const express = require("express");
const {
  uploadVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  streamVideoController,
} = require("../controllers/video.controller");
const authenticate = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const enforceTenant = require("../middlewares/tenant.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

// All routes require authentication and tenant enforcement
router.use(authenticate);
router.use(enforceTenant);

// @route   POST /api/videos/upload
// @desc    Upload a video
// @access  Private (Editor, Admin)
router.post(
  "/upload",
  authorize("editor", "admin"),
  upload.single("video"),
  uploadVideo,
);

// @route   GET /api/videos
// @desc    Get all videos (filtered by tenant)
// @access  Private
router.get("/", getVideos);

// @route   GET /api/videos/:id/stream
// @desc    Stream video
// @access  Private
router.get("/:id/stream", streamVideoController);

// @route   GET /api/videos/:id
// @desc    Get video by ID
// @access  Private
router.get("/:id", getVideoById);

// @route   PATCH /api/videos/:id
// @desc    Update video
// @access  Private (Owner, Admin)
router.patch("/:id", authorize("editor", "admin"), updateVideo);

// @route   DELETE /api/videos/:id
// @desc    Delete video
// @access  Private (Owner, Admin)
router.delete("/:id", authorize("editor", "admin"), deleteVideo);

module.exports = router;
