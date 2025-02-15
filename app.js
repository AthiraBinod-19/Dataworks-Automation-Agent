const express = require('express');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Helper function to interact with LLM (this could be an OpenAI API or similar service)
async function executeTaskWithLLM(taskDescription) {
    try {
        // Send the task description to the LLM API (replace with your actual LLM call)
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: 'text-davinci-003',  // Replace with your model
            prompt: taskDescription,
            max_tokens: 100,
        }, {
            headers: {
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`
            }
        });

        return response.data.choices[0].text.trim();
    } catch (err) {
        console.error('Error interacting with LLM:', err.message);
        throw new Error('LLM interaction failed');
    }
}

// POST /run?task=<task description> - Executes a plain-English task
app.post('/run', async (req, res) => {
    const taskDescription = req.query.task;
    
    if (!taskDescription) {
        return res.status(400).json({ message: 'Task description is required' });
    }

    try {
        // Execute task using LLM or custom logic
        const result = await executeTaskWithLLM(taskDescription);

        // Optionally, log result or perform other internal steps
        console.log('Task completed successfully:', result);

        res.status(200).json({ message: 'Task executed successfully', result });
    } catch (err) {
        console.error('Error executing task:', err.message);
        res.status(500).json({ message: 'Internal server error', error: err.message });
    }
});

// GET /read?path=<file path> - Returns the content of the specified file
app.get('/read', (req, res) => {
    const filePath = req.query.path;
    
    if (!filePath) {
        return res.status(400).json({ message: 'File path is required' });
    }

    const fullFilePath = path.join(__dirname, filePath);

    // Check if the file exists
    fs.readFile(fullFilePath, 'utf8', (err, data) => {
        if (err) {
            // If file doesn't exist, return 404
            if (err.code === 'ENOENT') {
                return res.status(404).send('');
            }

            // If another error occurs, return 500
            console.error('Error reading file:', err.message);
            return res.status(500).json({ message: 'Internal server error', error: err.message });
        }

        // If file is found, return its content
        res.status(200).send(data);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
