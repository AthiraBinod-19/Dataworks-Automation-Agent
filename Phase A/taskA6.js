const fs = require('fs');
const path = require('path');

// Define the directory and output file paths
const docsDir = path.join(__dirname, 'data', 'docs');
const outputFile = path.join(__dirname, 'data', 'docs', 'index.json');

// Function to get the title (first H1) from a markdown file
function getTitleFromFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    
    // Look for the first line that starts with '# ' (H1 in Markdown)
    for (let line of lines) {
        if (line.startsWith('# ')) {
            return line.slice(2).trim(); // Remove the '# ' and trim whitespace
        }
    }

    // If no H1 found, return an empty string (or you can use a default title)
    return '';
}

// Read all files in the docs directory
fs.readdir(docsDir, (err, files) => {
    if (err) {
        console.error("Error reading the directory:", err);
        return;
    }

    // Filter out non-Markdown files
    const mdFiles = files.filter(file => file.endsWith('.md'));

    const index = {};

    // Process each Markdown file
    mdFiles.forEach(file => {
        const filePath = path.join(docsDir, file);
        const title = getTitleFromFile(filePath);
        const fileNameWithoutPrefix = path.relative(docsDir, filePath); // Get the file name without `/data/docs/`

        // Add the file's title to the index
        index[fileNameWithoutPrefix] = title;
    });

    // Write the index to index.json
    fs.writeFile(outputFile, JSON.stringify(index, null, 2), (err) => {
        if (err) {
            console.error("Error writing to the file:", err);
        } else {
            console.log("Index file created: docs/index.json");
        }
    });
});
