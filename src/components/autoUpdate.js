const log = require('./logger');
const axios = require('axios');
const fs = require('fs');
const extract = require('extract-zip');
const path = require('path');
const { exec } = require('child_process');

async function downloadAndApplyUpdate(latestVersion) {
    if (!latestVersion || typeof latestVersion !== 'string' || lastestVersion === undefined || latestVersion === null || latestVersion === '') {
        log('No version provided for update, trying to fetch version.', null, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
        const { fetchLatestVersion } = require('./CheckVersion');
        latestVersion = await fetchLatestVersion();
        if (!latestVersion) {
            log('Failed to fetch latest version for update.', null, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
            return;
        }
    }
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

    log('Update applied successfully. Now updating npm packages...', null, { name: 'AUTO-UPDATE', type: 'info', msgColor: 'green' });

    try {
        // Try updating npm packages using bun
        await updatePackagesWithBun();
    } catch (error) {
        log('Failed to update packages with bun. Trying with npm...', null, { name: 'AUTO-UPDATE', type: 'warn', msgColor: 'yellow' });
        // Fallback to npm if bun fails
        await updatePackagesWithNpm();
    }

    log('Npm packages updated successfully. Please restart the application.', null, { name: 'AUTO-UPDATE', type: 'info', msgColor: 'green' });
}

function updateFiles(currentDir, updateDir) {
    const currentFiles = fs.readdirSync(currentDir);
    const updateFiles = fs.readdirSync(updateDir);

    currentFiles.forEach(file => {
        if (!updateFiles.includes(file)) {
            fs.unlinkSync(path.join(currentDir, file));
        }
    });

    updateFiles.forEach(file => {
        const currentFilePath = path.join(currentDir, file);
        const updateFilePath = path.join(updateDir, file);

        if (fs.statSync(updateFilePath).isDirectory()) {
            if (!fs.existsSync(currentFilePath)) {
                fs.mkdirSync(currentFilePath);
            }
            updateFiles(currentFilePath, updateFilePath);
        } else {
            if (!currentFiles.includes(file)) {
                fs.copyFileSync(updateFilePath, currentFilePath);
            } else {
                fs.renameSync(currentFilePath, path.join(currentDir, `${file}.bak`));
                fs.copyFileSync(updateFilePath, currentFilePath);
            }
        }
    });
}

async function updatePackagesWithBun() {
    return new Promise((resolve, reject) => {
        exec('bun install', (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            if (stderr) {
                reject(stderr);
            }
            log(`Bun update output: ${stdout}`, null, { name: 'AUTO-UPDATE', type: 'info', msgColor: 'cyan' });
            resolve();
        });
    });
}

async function updatePackagesWithNpm() {
    return new Promise((resolve, reject) => {
        exec('npm install', (error, stdout, stderr) => {
            if (error) {
                log(`Error updating npm packages: ${error.message}`, null, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
                reject(error);
            }
            if (stderr) {
                log(`Error output from npm update: ${stderr}`, null, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
                reject(stderr);
            }
            log(`Npm update output: ${stdout}`, null, { name: 'AUTO-UPDATE', type: 'info', msgColor: 'cyan' });
            resolve();
        });
    });
}