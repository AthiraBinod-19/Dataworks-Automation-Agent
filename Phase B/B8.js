const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { SpeechClient } = require('@google-cloud/speech');

// Initialize the Google Cloud Speech client
const client = new SpeechClient();

// Define the input and output file paths
const inputAudioPath = '/data/audio.mp3';  // Input MP3 file
const tempWavPath = '/data/temp_audio.wav'; // Temporary WAV file for transcription
const outputTextPath = '/data/transcribed_text.txt';  // Output transcribed text file

// Convert MP3 to WAV using ffmpeg
async function convertMp3ToWav() {
    return new Promise((resolve, reject) => {
        ffmpeg(inputAudioPath)
            .inputFormat('mp3')
            .audioCodec('pcm_s16le')
            .audioChannels(1)
            .audioFrequency(16000)  // Set audio sample rate to 16000 Hz
            .save(tempWavPath)
            .on('end', () => {
                console.log('MP3 file converted to WAV successfully');
                resolve();
            })
            .on('error', (err) => {
                console.error('Error converting MP3 to WAV:', err);
                reject(err);
            });
    });
}

// Transcribe the WAV file using Google Cloud Speech-to-Text API
async function transcribeAudio() {
    try {
        const audio = {
            content: fs.readFileSync(tempWavPath).toString('base64'), // Read the WAV file as base64
        };

        const config = {
            encoding: 'LINEAR16',  // WAV format encoding
            sampleRateHertz: 16000,  // Sample rate
            languageCode: 'en-US',  // Language code for English
        };

        const request = {
            audio: audio,
            config: config,
        };

        // Perform the transcription request
        const [response] = await client.recognize(request);

        // Extract the transcription results
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');

        // Write the transcribed text to a file
        fs.writeFileSync(outputTextPath, transcription);

        console.log('Audio transcription successful. Transcribed text written to:', outputTextPath);
    } catch (error) {
        console.error('Error during transcription:', error.message);
    } finally {
        // Clean up the temporary WAV file
        if (fs.existsSync(tempWavPath)) {
            fs.unlinkSync(tempWavPath);
        }
    }
}

// Main function to convert and transcribe the audio
async function processAudio() {
    try {
        // Convert MP3 to WAV
        await convertMp3ToWav();

        // Transcribe the audio file
        await transcribeAudio();
    } catch (err) {
        console.error('Error processing audio:', err.message);
    }
}

// Run the process
processAudio();
