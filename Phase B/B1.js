const fs = require('fs');
const path = require('path');

// B1: Check if the file path is within the /data directory (no access outside of it)
function isPathWithinDataDirectory(filePath) {
    const resolvedPath = path.resolve(filePath);  // Resolves to absolute path
    const dataDirectory = path.resolve('/data');  // Base data directory

    if (!resolvedPath.startsWith(dataDirectory)) {
        return false;  // Path is outside of /data
    }
    return true;  // Path is within /data
}

// B1: Sanitize input to prevent path traversal attacks like "../"
function sanitizeInput(input) {
    const unsafePattern = /\.\.(\/|\\)/; // Looks for "../" or "..\" for UNIX/Windows paths

    if (unsafePattern.test(input)) {
        throw new Error('Unsafe path detected, access outside of /data is prohibited');
    }

    return input;  // Return sanitized input
}

// B1: Log security events (e.g., unauthorized access attempts)
function logSecurityEvent(message) {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFile(path.resolve('/data', 'security-log.txt'), logMessage, (err) => {
        if (err) {
            console.error('Failed to log security event:', err);
        }
    });
}

// Utility function to read files only if within /data folder
function safeReadFile(filePath, callback) {
    // Sanitize input and check path validity
    const sanitizedFilePath = sanitizeInput(filePath);

    if (!isPathWithinDataDirectory(sanitizedFilePath)) {
        logSecurityEvent(`Attempt to access file outside /data: ${sanitizedFilePath}`);
        return callback(new Error('Access outside /data is not allowed'), null);
    }

    // Proceed with file reading if it's valid
    fs.readFile(path.resolve('/data', sanitizedFilePath), 'utf8', callback);
}

module.exports = { isPathWithinDataDirectory, sanitizeInput, logSecurityEvent, safeReadFile };
