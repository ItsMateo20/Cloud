const fs = require('fs');
const path = require('path');
const axios = require('axios');
const extract = require('extract-zip');
const { exec } = require('child_process');
const crypto = require('crypto');
const logger = require('./logger');

const updateTempDir = path.join(__dirname, '../../updateTemp');
const gitignorePath = path.join(__dirname, '../../.gitignore');
const autoUpdatePath = path.join(__dirname, 'autoUpdate.js');

// Calculate SHA-256 hash of a file
function calculateHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

// Get all files in a directory recursively, ignoring specified paths
function getFiles(dir, ignorePaths, files = []) {
    const dirEntries = fs.readdirSync(dir);
    for (const entry of dirEntries) {
        const entryPath = path.join(dir, entry);
        if (ignorePaths.some(ignorePath => entryPath.startsWith(ignorePath))) {
            continue;
        }
        if (fs.statSync(entryPath).isDirectory()) {
            getFiles(entryPath, ignorePaths, files);
        } else {
            files.push(entryPath);
        }
    }
    return files;
}

// Load .gitignore and updateTemp paths to ignore
function loadIgnorePaths() {
    const ignorePaths = [updateTempDir];
    if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
        const gitignoreEntries = gitignoreContent.split('\n').map(entry => entry.trim()).filter(entry => entry && !entry.startsWith('#'));
        ignorePaths.push(...gitignoreEntries.map(entry => path.join(__dirname, '../../', entry)));
    }
    return ignorePaths;
}

// Compare and update files, avoiding specified paths
function compareAndUpdateFiles(currentDir, updateDir, ignorePaths) {
    console.log('Comparing and updating files...');
    console.log('Current Directory:', currentDir);
    console.log('Update Directory:', updateDir);

    const currentFiles = getFiles(currentDir, ignorePaths);
    const updateFiles = getFiles(updateDir, ignorePaths);

    console.log('Current Files:', currentFiles);
    console.log('Update Files:', updateFiles);

    const filesToUpdate = [];

    for (const updateFile of updateFiles) {
        const relativePath = path.relative(updateDir, updateFile);
        const currentFile = path.join(currentDir, relativePath);

        console.log('Comparing:', currentFile, updateFile);

        if (!fs.existsSync(currentFile) || calculateHash(currentFile) !== calculateHash(updateFile)) {
            filesToUpdate.push({ currentFile, updateFile });
        }
    }

    console.log('Files to Update:', filesToUpdate);

    for (const { currentFile, updateFile } of filesToUpdate) {
        const currentFileDir = path.dirname(currentFile);

        console.log('Updating:', currentFileDir, updateFile, currentFile);

        if (!fs.existsSync(currentFileDir)) {
            fs.mkdirSync(currentFileDir, { recursive: true });
        }

        fs.copyFileSync(updateFile, currentFile);
    }
}



// Check if the autoUpdate.js file is out of date
function isAutoUpdateFileOutOfDate(updateDir) {
    const updateAutoUpdatePath = path.join(updateDir, 'src/components/autoUpdate.js');
    if (!fs.existsSync(updateAutoUpdatePath)) {
        return false;
    }
    return calculateHash(autoUpdatePath) !== calculateHash(updateAutoUpdatePath);
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
            logger.log(`Bun update output: ${stdout}`, null, { name: 'AUTO-UPDATE', type: 'info', msgColor: 'cyan' });
            resolve();
        });
    });
}

async function updatePackagesWithNpm() {
    return new Promise((resolve, reject) => {
        exec('npm install', (error, stdout, stderr) => {
            if (error) {
                logger.log(`Error updating npm packages: ${error.message}`, null, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
                reject(error);
            }
            if (stderr) {
                logger.log(`Error output from npm update: ${stderr}`, null, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
                reject(stderr);
            }
            logger.log(`Npm update output: ${stdout}`, null, { name: 'AUTO-UPDATE', type: 'info', msgColor: 'cyan' });
            resolve();
        });
    });
}

async function downloadAndApplyUpdate(latestVersion) {
    try {
        if (!latestVersion || typeof latestVersion !== 'string' || !latestVersion.trim()) {
            logger.log('No version provided for update, trying to fetch version.', null, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
            const { fetchLatestVersion } = require('./CheckVersion');
            latestVersion = await fetchLatestVersion();
            if (!latestVersion) {
                logger.log('Failed to fetch latest version for update.', null, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
                return;
            }
        }

        if (!fs.existsSync(updateTempDir)) {
            fs.mkdirSync(updateTempDir, { recursive: true });
        }

        const releaseUrl = `https://github.com/ItsMateo20/Cloud/archive/refs/tags/${latestVersion}.zip`;

        // Download the latest release
        const response = await axios.get(releaseUrl, { responseType: 'arraybuffer' });
        const zipPath = path.join(updateTempDir, 'update.zip');
        fs.writeFileSync(zipPath, response.data);

        // Extract the downloaded archive
        await extract(zipPath, { dir: updateTempDir });

        const updateDir = path.join(updateTempDir, `Cloud-${latestVersion}`);

        if (isAutoUpdateFileOutOfDate(updateDir)) {
            logger.log('The autoUpdate.js file is out of date. Please manually update the application.', null, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
            // return;
        }

        const ignorePaths = loadIgnorePaths();

        // Replace the current files with the updated ones
        await compareAndUpdateFiles(path.join(__dirname, '../../'), updateDir, ignorePaths);

        // Clean up temporary files
        fs.unlinkSync(zipPath);
        fs.rmdirSync(updateDir, { recursive: true });

        logger.log('Update applied successfully. Now updating npm packages...', null, { name: 'AUTO-UPDATE', type: 'info', msgColor: 'green' });

        try {
            // Try updating npm packages using bun
            await updatePackagesWithBun();
        } catch (error) {
            logger.log('Failed to update packages with bun. Trying with npm...', null, { name: 'AUTO-UPDATE', type: 'warn', msgColor: 'yellow' });
            // Fallback to npm if bun fails
            await updatePackagesWithNpm();
        }

        logger.log('Npm packages updated successfully. Please restart the application.', null, { name: 'AUTO-UPDATE', type: 'info', msgColor: 'green' });
    } catch (error) {
        logger.log(`Error during update process: ${error.message}`, null, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
    }
}

module.exports = { downloadAndApplyUpdate };
