const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Define the file paths
const dbFilePath = path.join(__dirname, 'data', 'ticket-sales.db');
const outputFilePath = path.join(__dirname, 'data', 'ticket-sales-gold.txt');

// Create a database connection
const db = new sqlite3.Database(dbFilePath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    }
});

// Function to calculate total sales for "Gold" ticket type
function calculateGoldTicketSales() {
    // Query to select all rows for the "Gold" ticket type
    const query = "SELECT units, price FROM tickets WHERE type = 'Gold'";

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Error querying database:", err.message);
            return;
        }

        // Calculate total sales
        let totalSales = 0;
        rows.forEach((row) => {
            totalSales += row.units * row.price;
        });

        // Write the result to the output file
        fs.writeFile(outputFilePath, totalSales.toFixed(2), 'utf8', (err) => {
            if (err) {
                console.error('Error writing total sales to file:', err);
            } else {
                console.log('Total sales for "Gold" tickets written to ticket-sales-gold.txt');
            }
        });
    });
}

// Run the calculation
calculateGoldTicketSales();

// Close the database connection
db.close((err) => {
    if (err) {
        console.error("Error closing database:", err.message);
    }
});
