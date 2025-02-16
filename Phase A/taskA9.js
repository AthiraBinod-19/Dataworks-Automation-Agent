const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cosineSimilarity = require('cosine-similarity');

// Define the file paths
const inputFilePath = path.join(__dirname, 'data', 'comments.txt');
const outputFilePath = path.join(__dirname, 'data', 'comments-similar.txt');

// OpenAI API setup (replace with your actual OpenAI API key)
const OPENAI_API_KEY = 'your-API-key-here';
const openaiUrl = 'https://api.openai.com/v1/embeddings';

// Function to fetch embeddings from OpenAI
async function getEmbeddings(text) {
    try {
        const response = await axios.post(openaiUrl, {
            model: 'text-embedding-ada-002',  // OpenAI model for text embeddings
            input: text,
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data.data[0].embedding;
    } catch (err) {
        console.error("Error fetching embedding for text:", text);
        console.error(err);
        return null;
    }
}

// Function to compute similarity between two embeddings
function computeSimilarity(embedding1, embedding2) {
    return cosineSimilarity(embedding1, embedding2);
}

// Read the comments from the file
fs.readFile(inputFilePath, 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading comments file:', err);
        return;
    }

    const comments = data.split('\n').map((line) => line.trim()).filter(Boolean);

    console.log(`Total number of comments: ${comments.length}`);

    // Fetch embeddings for all comments concurrently
    const embeddingPromises = comments.map((comment) => getEmbeddings(comment));
    const embeddings = await Promise.all(embeddingPromises);

    console.log('Embeddings successfully fetched.');

    let mostSimilarPair = [];
    let maxSimilarity = -1;

    // Compare all pairs of comments to find the most similar pair
    for (let i = 0; i < embeddings.length; i++) {
        for (let j = i + 1; j < embeddings.length; j++) {
            if (embeddings[i] && embeddings[j]) {  // Check if both embeddings are valid
                const similarity = computeSimilarity(embeddings[i], embeddings[j]);

                // Log the similarity score for debugging
                console.log(`Similarity between comment ${i + 1} and ${j + 1}: ${similarity}`);

                if (similarity > maxSimilarity) {
                    maxSimilarity = similarity;
                    mostSimilarPair = [comments[i], comments[j]];
                }
            }
        }
    }

    // Write the most similar pair to the output file
    if (mostSimilarPair.length > 0) {
        const output = mostSimilarPair.join('\n');
        fs.writeFile(outputFilePath, output, 'utf8', (err) => {
            if (err) {
                console.error('Error writing similar comments to file:', err);
            } else {
                console.log('Most similar pair of comments written to comments-similar.txt');
            }
        });
    } else {
        console.error('No similar comments found.');
    }
});
