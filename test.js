const axios = require('axios');

test('POST /run returns 200 status', async () => {
  const response = await axios.post('http://localhost:8000/run?task=TestTask');
  expect(response.status).toBe(200);
  expect(response.data).toBe('Task executed successfully');
});

test('GET /read returns 404 for non-existing file', async () => {
  try {
    await axios.get('http://localhost:8000/read?path=/data/non-existing-file.txt');
  } catch (error) {
    expect(error.response.status).toBe(404);
  }
});
const path = require('path');
const fetch = require('node-fetch'); // For making HTTP requests
const prettier = require('prettier'); // For formatting the file content

// Step 1: Define the path for format.md file in Data folder
const filePath = path.join(__dirname, 'Data', 'format.md');
const sampleContent = '# Sample Markdown File\nThis is a sample Markdown content.';

// Step 2: Create 'format.md' file in the Data directory if it doesn't exist
if (!fs.existsSync(filePath)) {
  fs.mkdirSync(path.join(__dirname, 'Data'), { recursive: true });  // Create the Data folder if it doesn't exist
  fs.writeFileSync(filePath, sampleContent);
  console.log("Created 'format.md' with sample content.");
}

// Step 3: Define the function to trigger Task A2 (formatting the file)
async function runTaskA2() {
  const url = "http://localhost:3000/run?task=Format+the+contents+of+Data/format.md+using+prettier@3.4.2";

  try {
    // Send a POST request to the API to execute the task
    const response = await fetch(url, { method: 'POST' });
    const responseBody = await response.json();

    console.log("Response from API:", responseBody.message);

    // Check if the task was successful
    if (response.status === 200) {
      console.log("Task A2 completed successfully.");
    } else {
      console.log("Error executing Task A2.");
    }

    // Step 4: Read the formatted content from 'format.md' and log it
    const formattedContent = fs.readFileSync(filePath, 'utf-8');
    console.log("Formatted content of format.md:\n", formattedContent);

  } catch (error) {
    console.error("Error executing Task A2:", error);
  }
}

// Run Task A2
runTaskA2();

