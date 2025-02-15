const duckdb = require('duckdb');
const path = require('path');

// DuckDB database file path
const dbFilePath = path.resolve('/data/ticket-sales.duckdb'); // Adjust path as needed

// SQL query to run
const sqlQuery = "SELECT type, SUM(units * price) AS total_sales FROM tickets WHERE type = 'Gold' GROUP BY type;";

// Function to execute SQL query on DuckDB database
function runDuckDBQuery() {
    const db = new duckdb.Database(dbFilePath);

    // Run the SQL query
    db.all(sqlQuery, (err, rows) => {
        if (err) {
            console.error('Error executing SQL query:', err.message);
            return;
        }

        if (rows.length > 0) {
            console.log('Total Sales for Gold Tickets:', rows[0].total_sales);
            // Save the result to a file
            const fs = require('fs');
            fs.writeFile('/data/ticket-sales-gold.txt', rows[0].total_sales.toString(), (err) => {
                if (err) {
                    console.error('Error writing to file:', err.message);
                } else {
                    console.log('Total sales written to /data/ticket-sales-gold.txt');
                }
            });
        } else {
            console.log('No data found for Gold tickets.');
        }
    });
}

// Execute the function
runDuckDBQuery();

module.exports = { runDuckDBQuery };
