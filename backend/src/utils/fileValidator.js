/**
 * Validate file type
 * @param {String} mimetype - File MIME type
 * @returns {Boolean} True if valid
 */
const validateFileType = (mimetype) => {
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(",") || [
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
  ];

  return allowedTypes.includes(mimetype);
};

/**
 * Validate file size
 * @param {Number} size - File size in bytes
 * @returns {Boolean} True if valid
 */
const validateFileSize = (size) => {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 104857600; // 100MB default
  return size <= maxSize;
};

/**
 * Get human-readable file size
 * @param {Number} bytes - File size in bytes
 * @returns {String} Formatted size
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

module.exports = {
  validateFileType,
  validateFileSize,
  formatFileSize,
};
