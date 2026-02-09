const fs = require("fs");
const { getFileStats } = require("./storage.service");

/**
 * Stream video with HTTP Range support
 * @param {String} filepath - Path to video file
 * @param {String} range - HTTP Range header value
 * @returns {Object} Stream and headers
 */
const streamVideo = async (filepath, range) => {
  try {
    // Get file stats
    const stats = await getFileStats(filepath);
    const fileSize = stats.size;

    if (range) {
      // Parse range header
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      // Create read stream with range
      const stream = fs.createReadStream(filepath, { start, end });

      // Return stream and headers for partial content
      return {
        stream,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": "video/mp4",
        },
        statusCode: 206, // Partial Content
      };
    } else {
      // No range header - stream entire file
      const stream = fs.createReadStream(filepath);

      return {
        stream,
        headers: {
          "Content-Length": fileSize,
          "Content-Type": "video/mp4",
          "Accept-Ranges": "bytes",
        },
        statusCode: 200,
      };
    }
  } catch (error) {
    throw new Error(`Streaming error: ${error.message}`);
  }
};

module.exports = {
  streamVideo,
};
