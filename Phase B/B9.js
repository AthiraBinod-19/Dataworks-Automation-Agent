const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Define file paths
const inputMarkdownPath = '/data/format.md';  // Input markdown file
const outputHtmlPath = '/data/output.html';   // Output HTML file

// Function to convert Markdown to HTML
function convertMarkdownToHtml(inputPath, outputPath) {
    fs.readFile(inputPath, 'utf8', (err, markdownContent) => {
        if (err) {
            console.error('Error reading Markdown file:', err.message);
            return;
        }

        // Convert Markdown content to HTML using marked
        const htmlContent = marked(markdownContent);

        // Write the HTML content to an output file
        fs.writeFile(outputPath, htmlContent, (err) => {
            if (err) {
                console.error('Error writing HTML file:', err.message);
                return;
            }

            console.log(`Markdown file converted to HTML and saved as ${outputPath}`);
        });
    });
}

// Run the conversion process
convertMarkdownToHtml(inputMarkdownPath, outputHtmlPath);
