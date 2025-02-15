const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// The input image path and output path
const inputImagePath = '/data/credit-card.png';  // Modify to the correct image path
const outputImagePath = '/data/credit-card-resized.png';  // Output image path after resizing/compressing

// Function to resize and compress the image
async function resizeAndCompressImage() {
    try {
        // Check if the image exists
        if (!fs.existsSync(inputImagePath)) {
            console.error(`Input image not found: ${inputImagePath}`);
            return;
        }

        // Read the input image
        const inputImage = sharp(inputImagePath);

        // Resize and compress the image (e.g., 50% of the original size, with 80% quality)
        await inputImage
            .resize({ width: 500 })  // Resize to a width of 500px, maintain aspect ratio
            .jpeg({ quality: 80 })  // Compress as JPEG with 80% quality
            .toFile(outputImagePath);  // Save the output image

        console.log(`Image successfully resized and compressed: ${outputImagePath}`);
    } catch (error) {
        console.error('Error resizing and compressing image:', error.message);
    }
}

// Run the image resizing/compressing function
resizeAndCompressImage();
