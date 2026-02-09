const Video = require("../models/video.model");
const { saveFile, deleteFile } = require("../services/storage.service");
const { getIO } = require("../config/socket");
const { processVideo } = require("../services/videoProcessing.service");
const { streamVideo } = require("../services/streaming.service");

/**
 * Upload video
 * @route POST /api/videos/upload
 * @access Private (Editor, Admin)
 */
const uploadVideo = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video file provided",
      });
    }

    const { title, description } = req.body;

    // Validation
    if (!title) {
      // Delete uploaded file if validation fails
      await deleteFile(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Video title is required",
      });
    }

    // Save file info
    const fileInfo = await saveFile(req.file);

    // Create video document
    const video = await Video.create({
      title,
      description: description || "",
      filename: fileInfo.filename,
      filepath: fileInfo.filepath,
      filesize: fileInfo.filesize,
      mimetype: fileInfo.mimetype,
      uploadedBy: req.user.id,
      tenantId: req.user.tenantId,
      status: "uploaded",
    });

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      data: video,
    });

    // Trigger processing asynchronously (don't wait for completion)
    const io = getIO();
    processVideo(video._id.toString(), io, req.user.id).catch((error) => {
      console.error("Background processing error:", error);
    });
  } catch (error) {
    console.error("Upload error:", error);

    // Clean up file if database operation failed
    if (req.file) {
      await deleteFile(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: "Error uploading video",
      error: error.message,
    });
  }
};

/**
 * Get all videos
 * @route GET /api/videos
 * @access Private
 */
const getVideos = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build filter
    const filter = { tenantId: req.user.tenantId };
    if (status) {
      filter.status = status;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get videos
    const videos = await Video.find(filter)
      .populate("uploadedBy", "email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await Video.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        videos,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error("Get videos error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching videos",
      error: error.message,
    });
  }
};

/**
 * Get video by ID
 * @route GET /api/videos/:id
 * @access Private
 */
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findOne({
      _id: id,
      tenantId: req.user.tenantId,
    }).populate("uploadedBy", "email role");

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    res.status(200).json({
      success: true,
      data: video,
    });
  } catch (error) {
    console.error("Get video error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching video",
      error: error.message,
    });
  }
};

/**
 * Update video
 * @route PATCH /api/videos/:id
 * @access Private (Owner, Admin)
 */
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Find video
    const video = await Video.findOne({
      _id: id,
      tenantId: req.user.tenantId,
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Check ownership (unless admin)
    if (
      video.uploadedBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own videos",
      });
    }

    // Update fields
    if (title) video.title = title;
    if (description !== undefined) video.description = description;

    await video.save();

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      data: video,
    });
  } catch (error) {
    console.error("Update video error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating video",
      error: error.message,
    });
  }
};

/**
 * Delete video
 * @route DELETE /api/videos/:id
 * @access Private (Owner, Admin)
 */
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    // Find video
    const video = await Video.findOne({
      _id: id,
      tenantId: req.user.tenantId,
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Check ownership (unless admin)
    if (
      video.uploadedBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own videos",
      });
    }

    // Delete file from storage
    await deleteFile(video.filepath);

    // Delete video document
    await Video.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    console.error("Delete video error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting video",
      error: error.message,
    });
  }
};

/**
 * Stream video
 * @route GET /api/videos/:id/stream
 * @access Private
 */
const streamVideoController = async (req, res) => {
  try {
    const { id } = req.params;

    // Find video
    const video = await Video.findOne({
      _id: id,
      tenantId: req.user.tenantId,
    });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Only allow streaming of processed (safe) videos
    if (video.status !== "safe") {
      return res.status(403).json({
        success: false,
        message: `Video cannot be streamed. Status: ${video.status}`,
        currentStatus: video.status,
      });
    }

    // Get range header
    const range = req.headers.range;

    // Stream video
    const { stream, headers, statusCode } = await streamVideo(
      video.filepath,
      range,
    );

    // Set response headers
    res.writeHead(statusCode, headers);

    // Pipe stream to response
    stream.pipe(res);

    // Handle stream errors
    stream.on("error", (error) => {
      console.error("Stream error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error streaming video",
        });
      }
    });
  } catch (error) {
    console.error("Stream video error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error streaming video",
        error: error.message,
      });
    }
  }
};

module.exports = {
  uploadVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  streamVideoController,
};
