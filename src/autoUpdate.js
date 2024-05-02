const axios = require('axios');
const fs = require('fs');
const extract = require('extract-zip');
const path = require('path');

async function downloadAndApplyUpdate(latestVersion) {
    const releaseUrl = `https://github.com/ItsMateo20/Cloud/archive/refs/tags/${latestVersion}.zip`;
    const tempDir = path.join(__dirname, 'temp');

    // Download the latest release
    const response = await axios.get(releaseUrl, { responseType: 'arraybuffer' });
    const zipPath = path.join(tempDir, 'update.zip');
    fs.writeFileSync(zipPath, response.data);

    // Extract the downloaded archive
    await extract(zipPath, { dir: tempDir });

    // Replace the current files with the updated ones
    const updateDir = path.join(tempDir, `Cloud-${latestVersion}`);
    updateFiles(__dirname, updateDir);

    // Clean up temporary files
    fs.unlinkSync(zipPath);
    fs.rmdirSync(updateDir, { recursive: true });

    console.log('Update applied successfully. Please restart the application.');
}

function updateFiles(currentDir, updateDir) {
    const currentFiles = fs.readdirSync(currentDir);
    const updateFiles = fs.readdirSync(updateDir);

    // Remove or rename files that are not in the new version
    currentFiles.forEach(file => {
        if (!updateFiles.includes(file)) {
            fs.unlinkSync(path.join(currentDir, file)); // Remove the file
        }
    });

    // Update or create files that are in the new version
    updateFiles.forEach(file => {
        const currentFilePath = path.join(currentDir, file);
        const updateFilePath = path.join(updateDir, file);

        if (fs.statSync(updateFilePath).isDirectory()) {
            // Recursively update subdirectories
            if (!fs.existsSync(currentFilePath)) {
                fs.mkdirSync(currentFilePath); // Create the directory if it doesn't exist
            }
            updateFiles(currentFilePath, updateFilePath);
        } else {
            if (!currentFiles.includes(file)) {
                // File doesn't exist in the current version, copy it from the update
                fs.copyFileSync(updateFilePath, currentFilePath);
            } else {
                // File exists but may have been renamed, so rename it
                fs.renameSync(currentFilePath, path.join(currentDir, `${file}.bak`)); // Backup the current file
                fs.copyFileSync(updateFilePath, currentFilePath); // Copy the new file
            }
        }
    });
}
