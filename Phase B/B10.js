const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');  // Import the csv-parser library

const app = express();
const port = 3000;

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Function to filter the CSV data based on a condition
function filterCsvData(filePath, filterCallback) {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Apply the filter callback on each row
                if (filterCallback(row)) {
                    results.push(row);
                }
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (err) => {
                reject(err);
            });
    });
}

// API Endpoint to filter a CSV file and return the filtered JSON data
app.post('/filter-csv', async (req, res) => {
    const { filePath, filterCondition } = req.body;

    if (!filePath) {
        return res.status(400).json({ message: 'File path is required' });
    }

    const resolvedFilePath = path.join(__dirname, filePath);

    try {
        // Filter the CSV data by applying the condition
        const filteredData = await filterCsvData(resolvedFilePath, (row) => {
            // Convert filterCondition to a function and apply it to each row
            // Example: filterCondition could be a simple string or a function
            try {
                return eval(filterCondition);
            } catch (e) {
                return false;
            }
        });

        // Return the filtered data as JSON
        res.status(200).json(filteredData);
    } catch (err) {
        console.error('Error processing CSV file:', err.message);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
