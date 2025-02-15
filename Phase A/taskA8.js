const fs = require('fs');
const path = require('path');
const Tesseract = require('tesseract.js');

// Define the file paths with the correct file name
const imageFilePath = path.join(__dirname, 'data', 'credit_card.png');  // Corrected file name
const outputFilePath = path.join(__dirname, 'data', 'credit-card.txt');  // Path to the output file

// Function to clean and extract credit card number from the OCR text
function extractCardNumber(text) {
    const cardNumberRegex = /\b(?:\d[ -]*?){13,16}\b/;
    const match = text.match(cardNumberRegex);
    return match ? match[0].replace(/\s+/g, '') : null;  // Remove spaces and return the number
}

// Use Tesseract.js to extract text from the image
Tesseract.recognize(
    imageFilePath,
    'eng',  // Language: English
    {
        logger: (m) => console.log(m)  // Log the progress of the OCR
    }
).then(({ data: { text } }) => {
    // Extract the card number from the OCR text
    const cardNumber = extractCardNumber(text);

    if (cardNumber) {
        // Write the extracted card number to the output file
        fs.writeFile(outputFilePath, cardNumber, (err) => {
            if (err) {
                console.error("Error writing the card number to the file:", err);
            } else {
                console.log("Credit card number has been written to credit-card.txt");
            }
        });
    } else {
        console.error("No credit card number found in the image.");
    }
}).catch((err) => {
    console.error("Error during OCR processing:", err);
});
