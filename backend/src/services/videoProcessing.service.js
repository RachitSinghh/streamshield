const Video = require("../models/video.model");

/**
 * Simulate video processing with progress updates
 * @param {String} videoId - Video ID to process
 * @param {Object} io - Socket.io instance
 * @param {String} userId - User ID for socket room
 */
const processVideo = async (videoId, io, userId) => {
  try {
    console.log(`Starting processing for video: ${videoId}`);

    // Update status to processing
    await Video.findByIdAndUpdate(videoId, {
      status: "processing",
      processingProgress: 0,
    });

    // Emit initial progress
    io.to(userId).emit("processing:progress", {
      videoId,
      progress: 0,
      status: "processing",
      message: "Processing started...",
    });

    // Simulate processing with progress updates
    for (let progress = 10; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

      // Update progress in database
      await Video.findByIdAndUpdate(videoId, {
        processingProgress: progress,
      });

      // Emit progress update
      io.to(userId).emit("processing:progress", {
        videoId,
        progress,
        status: "processing",
        message: `Processing... ${progress}%`,
      });

      console.log(`Video ${videoId}: ${progress}% complete`);
    }

    // Perform sensitivity analysis (simulated)
    const sensitivityScore = Math.floor(Math.random() * 100);
    const classification = sensitivityScore < 50 ? "safe" : "flagged";

    console.log(
      `Video ${videoId}: Sensitivity score = ${sensitivityScore}, Classification = ${classification}`,
    );

    // Update video with final status
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        status: classification,
        processingProgress: 100,
        sensitivityScore: sensitivityScore,
        processedDate: new Date(),
      },
      { new: true },
    );

    // Emit completion event
    io.to(userId).emit("processing:complete", {
      videoId,
      status: classification,
      sensitivityScore,
      message: `Processing complete! Video classified as ${classification.toUpperCase()}`,
    });

    console.log(`Video ${videoId}: Processing complete`);

    return video;
  } catch (error) {
    console.error(`Processing error for video ${videoId}:`, error);

    // Update video status to failed
    await Video.findByIdAndUpdate(videoId, {
      status: "failed",
      processingProgress: 0,
    });

    // Emit error event
    io.to(userId).emit("processing:error", {
      videoId,
      message: "Processing failed",
      error: error.message,
    });

    throw error;
  }
};

/**
 * Alternative rule-based sensitivity analysis
 * @param {String} title - Video title
 * @param {String} description - Video description
 * @returns {Object} Analysis result
 */
const analyzeSensitivity = (title, description) => {
  const flaggedKeywords = ["explicit", "violent", "inappropriate", "nsfw"];
  const content = `${title} ${description}`.toLowerCase();

  let score = 0;
  flaggedKeywords.forEach((keyword) => {
    if (content.includes(keyword)) {
      score += 25;
    }
  });

  return {
    score: Math.min(score, 100),
    classification: score >= 50 ? "flagged" : "safe",
  };
};

module.exports = {
  processVideo,
  analyzeSensitivity,
};
