const fs = require("fs").promises;
const path = require("path");

/**
 * Save file locally
 * @param {Object} file - Multer file object
 * @returns {Object} File information
 */
const saveFile = async (file) => {
  try {
    return {
      filename: file.filename,
      filepath: file.path,
      filesize: file.size,
      mimetype: file.mimetype,
      originalname: file.originalname,
    };
  } catch (error) {
    throw new Error(`Error saving file: ${error.message}`);
  }
};

/**
 * Delete file from storage
 * @param {String} filepath - Path to file
 * @returns {Boolean} Success status
 */
const deleteFile = async (filepath) => {
  try {
    await fs.unlink(filepath);
    return true;
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
    return false;
  }
};

/**
 * Check if file exists
 * @param {String} filepath - Path to file
 * @returns {Boolean} Exists status
 */
const fileExists = async (filepath) => {
  try {
    await fs.access(filepath);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get file stats
 * @param {String} filepath - Path to file
 * @returns {Object} File stats
 */
const getFileStats = async (filepath) => {
  try {
    const stats = await fs.stat(filepath);
    return stats;
  } catch (error) {
    throw new Error(`Error getting file stats: ${error.message}`);
  }
};

module.exports = {
  saveFile,
  deleteFile,
  fileExists,
  getFileStats,
};
