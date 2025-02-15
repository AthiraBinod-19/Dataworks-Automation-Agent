const fs = require('fs');
const path = require('path');

// B2: Check if the file path is within the /data directory (no delete access outside of it)
function isPathWithinDataDirectory(filePath) {
    const resolvedPath = path.resolve(filePath);  // Resolves to absolute path
    const dataDirectory = path.resolve('/data');  // Base data directory

    if (!resolvedPath.startsWith(dataDirectory)) {
        return false;  // Path is outside of /data
    }
    return true;  // Path is within /data
}

// B2: Sanitize input to prevent path traversal attacks like "../"
function sanitizeInput(input) {
    const unsafePattern = /\.\.(\/|\\)/; // Looks for "../" or "..\" for UNIX/Windows paths

    if (unsafePattern.test(input)) {
        throw new Error('Unsafe path detected, access outside of /data is prohibited');
    }

    return input;  // Return sanitized input
}

// B2: Log security events (e.g., delete attempts on files outside /data)
function logSecurityEvent(message) {
    const logMessage = `[${new Date().toISOString()}] ${message}\n`;
    fs.appendFile(path.resolve('/data', 'security-log.txt'), logMessage, (err) => {
        if (err) {
            console.error('Failed to log security event:', err);
        }
    });
}

// B2: Prevent delete operations on files (instead of deleting, log it)
function preventDeleteOperation(filePath) {
    // Sanitize input and check path validity
    const sanitizedFilePath = sanitizeInput(filePath);

    if (!isPathWithinDataDirectory(sanitizedFilePath)) {
        logSecurityEvent(`Attempt to delete file outside /data: ${sanitizedFilePath}`);
        console.error(`Delete operation on file outside of /data is not allowed: ${sanitizedFilePath}`);
        return;
    }

    // Proceed with "deletion prevention" (log it instead of deleting)
    logSecurityEvent(`Attempt to delete file within /data: ${sanitizedFilePath}`);
    console.error(`Attempted to delete file within /data: ${sanitizedFilePath}, but the delete operation is prevented.`);
}

// B2: Replace fs.unlink (deletion) with our custom prevention function
const originalUnlink = fs.unlink;
fs.unlink = (filePath, callback) => {
    // Prevent any delete operation
    preventDeleteOperation(filePath);
    callback(new Error('Delete operation prevented'));
};

// B2: Replace fs.unlinkSync (synchronous deletion) with our custom prevention function
const originalUnlinkSync = fs.unlinkSync;
fs.unlinkSync = (filePath) => {
    // Prevent any delete operation
    preventDeleteOperation(filePath);
    throw new Error('Delete operation prevented');
};

module.exports = { preventDeleteOperation, logSecurityEvent };
