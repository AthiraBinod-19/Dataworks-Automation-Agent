const fs = require('fs');
const path = require('path');

// Define file paths
const inputFile = path.join(__dirname, 'data', 'dates.txt');  // Path to your dates.txt
const outputFile = path.join(__dirname, 'data', 'dates-wednesdays.txt');  // Path to output file

// Read the input file
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    // Split the data into lines (one date per line)
    const dates = data.split('\n');

    // Initialize counter for Wednesdays
    let wednesdayCount = 0;

    // Loop through each line, parse the date, and check if it's a Wednesday
    dates.forEach(dateStr => {
        dateStr = dateStr.trim();  // Remove any leading/trailing whitespace
        if (dateStr) {  // Skip empty lines
            const date = new Date(dateStr);
            if (date.getDay() === 3) {  // getDay() returns 3 for Wednesday
                wednesdayCount++;
            }
        }
    });

    // Write the result (number of Wednesdays) to the output file
    fs.writeFile(outputFile, wednesdayCount.toString(), (err) => {
        if (err) {
            console.error("Error writing to the file:", err);
        } else {
            console.log(`Number of Wednesdays: ${wednesdayCount}`);
        }
    });
});
