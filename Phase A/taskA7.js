const fs = require('fs');
const path = require('path');

// Define the file paths
const inputFile = path.join(__dirname, 'data', 'email.txt');  // Path to the email.txt file
const outputFile = path.join(__dirname, 'data', 'email-sender.txt');  // Path to the output file

// Function to extract email address using a more flexible regex
function extractEmail(content) {
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
    const match = content.match(emailRegex);
    return match ? match[1] : null;
}

// Read the email file
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the email file:", err);
        return;
    }

    // Log the email content for debugging purposes
    console.log("Email content read from file:\n", data);

    // Extract the sender's email address
    const email = extractEmail(data);

    if (email) {
        // Write the extracted email address to the output file
        fs.writeFile(outputFile, email, (err) => {
            if (err) {
                console.error("Error writing the email address to the file:", err);
            } else {
                console.log("Sender's email address has been written to email-sender.txt");
            }
        });
    } else {
        console.error("No email address found in the email content.");
    }
});
