const logger = require('./logger');
const axios = require('axios');
const fs = require('fs');
const extract = require('extract-zip');
const path = require('path');
const { exec } = require('child_process');
const crypto = require('crypto');

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

        const tempDir = path.join(__dirname, '../../updateTemp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        const releaseUrl = `https://github.com/ItsMateo20/Cloud/archive/refs/tags/${latestVersion}.zip`;
        const response = await axios.get(releaseUrl, { responseType: 'arraybuffer' });
        const zipPath = path.join(tempDir, 'update.zip');
        fs.writeFileSync(zipPath, response.data);

        await extract(zipPath, { dir: tempDir });

        const updateDir = path.join(tempDir, `Cloud-${latestVersion}`);
        const autoUpdateFile = path.join(updateDir, 'src/components/autoUpdate.js');

        const autoUpdateOutdated = await isFileOutdated(autoUpdateFile, path.join(__dirname, 'autoUpdate.js'));
        if (autoUpdateOutdated) {
            logger.log('autoUpdate.js is outdated. Please update manually and restart the application.', null, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
            cleanupTempFiles(tempDir);
            return;
        }

        await updateFiles(path.join(__dirname, '../../'), updateDir);

        cleanupTempFiles(tempDir);

        logger.log('Update applied successfully. Now updating npm packages...', null, { name: 'AUTO-UPDATE', type: 'info', msgColor: 'green' });

        try {
            await updatePackagesWithBun();
        } catch (error) {
            logger.log('Failed to update packages with bun. Trying with npm...', null, { name: 'AUTO-UPDATE', type: 'warn', msgColor: 'yellow' });
            await updatePackagesWithNpm();
        }

        logger.log('Npm packages updated successfully. Please restart the application.', null, { name: 'AUTO-UPDATE', type: 'info', msgColor: 'green' });
    } catch (error) {
        logger.log(`Error during update process: ${error.message}`, null, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
    }
}

async function isFileOutdated(newFile, currentFile) {
    if (!fs.existsSync(newFile) || !fs.existsSync(currentFile)) {
        return true;
    }
    const newFileHash = getFileHash(newFile);
    const currentFileHash = getFileHash(currentFile);
    return newFileHash !== currentFileHash;
}

function getFileHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

async function updateFiles(currentDir, updateDir) {
    const currentFiles = fs.readdirSync(currentDir);
    const updateFiles = fs.readdirSync(updateDir);

    for (const file of currentFiles) {
        if (file === 'updateTemp' || isInGitignore(file)) {
            continue;
        }
        const currentFilePath = path.join(currentDir, file);
        const backupDir = path.join(currentDir, 'backup');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }
        const backupFilePath = path.join(backupDir, file);
        if (fs.statSync(currentFilePath).isFile()) {
            fs.renameSync(currentFilePath, backupFilePath);
        }
    }

    for (const file of updateFiles) {
        if (file === 'updateTemp' || isInGitignore(file)) {
            continue;
        }
        const updateFilePath = path.join(updateDir, file);
        const currentFilePath = path.join(currentDir, file);
        if (fs.statSync(updateFilePath).isDirectory()) {
            if (!fs.existsSync(currentFilePath)) {
                fs.mkdirSync(currentFilePath);
            }
            await updateFiles(currentFilePath, updateFilePath);
        } else {
            fs.copyFileSync(updateFilePath, currentFilePath);
        }
    }
}

function isInGitignore(file) {
    if (!fs.existsSync('.gitignore')) {
        return false;
    }
    const gitignore = fs.readFileSync('.gitignore', 'utf-8').split('\n');
    return gitignore.includes(file);
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

function cleanupTempFiles(tempDir) {
    fs.rmdirSync(tempDir, { recursive: true });
}

module.exports = { downloadAndApplyUpdate };
