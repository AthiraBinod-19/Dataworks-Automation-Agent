const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

// The URL of the website to scrape
const websiteURL = 'https://example.com';  // Change to the actual URL you want to scrape

// Function to scrape data from a website
async function scrapeWebsiteData() {
    try {
        // Fetch the HTML of the page
        const response = await axios.get(websiteURL);

        // Load the HTML into Cheerio for parsing
        const $ = cheerio.load(response.data);

        // Example: Extract all headings (h1, h2, h3, etc.) from the page
        const headings = [];
        $('h1, h2, h3, h4, h5, h6').each((index, element) => {
            const headingText = $(element).text().trim();
            if (headingText) {
                headings.push(headingText);
            }
        });

        // Log the extracted headings to the console (for verification)
        console.log('Extracted Headings:', headings);

        // Optionally, save the extracted data to a file (headings.json in this case)
        const outputFilePath = '/data/website-headings.json';  // Modify path if needed
        fs.writeFile(outputFilePath, JSON.stringify(headings, null, 2), (err) => {
            if (err) {
                console.error('Error writing to file:', err.message);
            } else {
                console.log(`Data successfully written to ${outputFilePath}`);
            }
        });
        
    } catch (error) {
        console.error('Error scraping website:', error.message);
    }
}

// Execute the scraping function
scrapeWebsiteData();

module.exports = { scrapeWebsiteData };
