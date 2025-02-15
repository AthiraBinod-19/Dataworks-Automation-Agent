const fs = require('fs');
const path = require('path');

// Path to the logs directory and the output file
const logsDir = path.join(__dirname, 'data', 'logs');
const outputFile = path.join(__dirname, 'data', 'logs-recent.txt');

// Function to get the most recent .log files
fs.readdir(logsDir, (err, files) => {
    if (err) {
        console.error("Error reading the directory:", err);
        return;
    }

    // Filter out non-log files
    const logFiles = files.filter(file => file.endsWith('.log'));

    // Get the stats (modification time) of each file
    const fileStats = logFiles.map(file => {
        const filePath = path.join(logsDir, file);
        return {
            file,
            stats: fs.statSync(filePath)
        };
    });

    // Sort files by modification time, most recent first
    fileStats.sort((a, b) => b.stats.mtime - a.stats.mtime);

    // Get the first line of the 10 most recent .log files
    const recentLines = [];
    for (let i = 0; i < Math.min(10, fileStats.length); i++) {
        const filePath = path.join(logsDir, fileStats[i].file);
        const firstLine = getFirstLine(filePath);
        recentLines.push(firstLine);
    }

    // Write the first lines to the output file
    fs.writeFile(outputFile, recentLines.join('\n'), (err) => {
        if (err) {
            console.error("Error writing to the file:", err);
        } else {
            console.log("First lines of the 10 most recent .log files written to logs-recent.txt");
        }
    });
});

// Function to get the first line of a file
function getFirstLine(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    return lines[0]; // Return the first line
}
