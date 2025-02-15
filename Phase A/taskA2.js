const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

// Define the file path for the Markdown file
const filePath = path.join(__dirname, 'data', 'format.md');

// Function to format the file using prettier
async function formatFile() {
    try {
        // Read the content of the Markdown file
        const fileContent = fs.readFileSync(filePath, 'utf8');

        // Format the content using prettier
        const formattedContent = prettier.format(fileContent, {
            parser: 'markdown', // Specify the parser for markdown files
            plugins: ['prettier-plugin-markdown'], // Ensure markdown plugin is used
        });

        // Write the formatted content back to the file
        fs.writeFileSync(filePath, formattedContent, 'utf8');

        console.log('File formatted successfully and updated in place!');
    } catch (error) {
        console.error('Error formatting the file:', error);
    }
}

// Run the function to format the file
formatFile();
