/**
 * NOTE: Useful methods for reuse throughout code base.
 */

/**
 * Logs an error to the console.
 * @param {String} message The error message.
 * @param {Object} error The error object
 */
const logError = (message, error) => console.log(`ERROR! ${message}:`, error);

/**
 * Logs an informative message to the console.
 * @param {String} message The informative message.
 * @param {Object} obj Any object to join the log.
 */
const logInfo = (message, obj) => {
	if (!obj) return console.log(`INFO! ${message}`);
	console.log(`INFO! ${message}:`, obj);
}

/**
 * The utils to be utilized.
 * @type {Object}
 */
const utils = {
	logError,
	logInfo
}

/**
 * Export the utils to be used.
 */
export default utils;
