/**
 * Simple logger utility
 */

const info = (message, ...args) => {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
};

const error = (message, ...args) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, ...args);
};

const warn = (message, ...args) => {
  console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
};

const debug = (message, ...args) => {
  if (process.env.NODE_ENV === "development") {
    console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
  }
};

module.exports = {
  info,
  error,
  warn,
  debug,
};
