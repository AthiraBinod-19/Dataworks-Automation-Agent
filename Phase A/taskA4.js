const fs = require('fs');
const path = require('path');

// Define file paths
const inputFile = path.join(__dirname, 'data', 'contacts.json');  // Path to contacts.json
const outputFile = path.join(__dirname, 'data', 'contacts-sorted.json');  // Path to output file

// Read the input file
fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the file:", err);
        return;
    }

    // Parse the JSON data
    let contacts = [];
    try {
        contacts = JSON.parse(data);
    } catch (parseError) {
        console.error("Error parsing JSON data:", parseError);
        return;
    }

    // Sort the contacts first by last_name, then by first_name
    contacts.sort((a, b) => {
        // Compare last_name first
        if (a.last_name < b.last_name) return -1;
        if (a.last_name > b.last_name) return 1;

        // If last names are equal, compare first_name
        if (a.first_name < b.first_name) return -1;
        if (a.first_name > b.first_name) return 1;

        return 0;  // If both last_name and first_name are equal, return 0
    });

    // Write the sorted contacts to the output file
    fs.writeFile(outputFile, JSON.stringify(contacts, null, 2), (err) => {
        if (err) {
            console.error("Error writing to the file:", err);
        } else {
            console.log("Contacts sorted and saved to contacts-sorted.json");
        }
    });
});
