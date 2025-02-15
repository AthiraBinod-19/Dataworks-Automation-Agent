const axios = require('axios');
const fs = require('fs');
const path = require('path');

// B3: Fetch data from an API and save it to a file within /data directory
async function fetchDataAndSave(apiUrl, fileName) {
    try {
        // Fetch data from the API
        const response = await axios.get(apiUrl);

        // Get the response data
        const data = response.data;

        // Define the file path within /data directory
        const filePath = path.resolve('/data', fileName);

        // Write the fetched data to the file in JSON format
        fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error('Error writing data to file:', err.message);
                return;
            }

            console.log(`Data successfully saved to ${filePath}`);
        });
    } catch (err) {
        console.error('Error fetching data from API:', err.message);
    }
}

// Example usage: fetch data from a public API and save it
const apiUrl = 'https://api.example.com/data';  // Replace with actual API URL
const fileName = 'fetched-data.json';  // Name of the file to save the data

// Fetch data from API and save it to file
fetchDataAndSave(apiUrl, fileName);

module.exports = { fetchDataAndSave };
