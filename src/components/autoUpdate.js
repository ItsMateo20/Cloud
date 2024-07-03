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

function calculateHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('sha256');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

function getFiles(dir, ignorePaths, files = []) {
    const dirEntries = fs.readdirSync(dir);
    for (const entry of dirEntries) {
        const entryPath = path.join(dir, entry);
        if (dir.includes("updateTemp")) {
            if (ignorePaths.some((ignorePath, index) => index !== 0 && entryPath.startsWith(ignorePath))) {
                continue;
            }
            if (fs.statSync(entryPath).isDirectory()) {
                getFiles(entryPath, ignorePaths, files);
            } else {
                files.push(entryPath);
            }
        } else {
            if (ignorePaths.some(ignorePath => entryPath.startsWith(ignorePath))) {
                continue;
            }
            if (fs.statSync(entryPath).isDirectory()) {
                getFiles(entryPath, ignorePaths, files);
            } else {
                files.push(entryPath);
            }
        }
    }
    return files;
}

function loadIgnorePaths() {
    const ignorePaths = [updateTempDir, autoUpdatePath];
    if (fs.existsSync(gitignorePath)) {
        const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
        const gitignoreEntries = gitignoreContent.split('\n').map(entry => entry.trim()).filter(entry => entry && !entry.startsWith('#'));
        ignorePaths.push(...gitignoreEntries.map(entry => path.join(__dirname, '../../', entry)));
    }
    ignorePaths.push(path.join(__dirname, '../../.env.example'));
    ignorePaths.push(path.join(__dirname, '../../docs'));
    ignorePaths.push(path.join(__dirname, '../assets/README'));
    return ignorePaths;
}

function compareAndUpdateFiles(currentDir, updateDir, ignorePaths) {
    const currentFiles = getFiles(currentDir, ignorePaths);
    const updateFiles = getFiles(updateDir, ignorePaths);

    const filesToUpdate = [];

    for (const updateFile of updateFiles) {
        const relativePath = path.relative(updateDir, updateFile);
        const currentFile = path.join(currentDir, relativePath);
        if (ignorePaths.some(ignorePath => currentFile.startsWith(ignorePath))) {
            continue;
        }

        if (!fs.existsSync(currentFile) || calculateHash(currentFile) !== calculateHash(updateFile)) {
            filesToUpdate.push({ currentFile, updateFile });
        }
    }

    for (const { currentFile, updateFile } of filesToUpdate) {
        const currentFileDir = path.dirname(currentFile);
        if (ignorePaths.some(ignorePath => currentFileDir.startsWith(ignorePath))) {
            continue;
        }

        if (!fs.existsSync(currentFileDir)) {
            fs.mkdirSync(currentFileDir, { recursive: true });
        }

        fs.copyFileSync(updateFile, currentFile);
    }
}

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
                logger.log(`Error updating npm packages:`, error.message, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
                reject(error);
            }
            if (stderr) {
                logger.log(`Error output from bun update:`, stderr, { name: 'AUTO-UPDATE', type: 'info', msgColor: 'cyan' });
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
                logger.log(`Error updating npm packages:`, error.message, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
                reject(error);
            }
            if (stderr) {
                logger.log(`Error output from npm update:`, stderr, { name: 'AUTO-UPDATE', type: 'info', msgColor: 'cyan' });
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
            const { fetchLatestVersion } = require('./checkVersion.js');
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

        const response = await axios.get(releaseUrl, { responseType: 'arraybuffer' });
        const zipPath = path.join(updateTempDir, 'update.zip');
        fs.writeFileSync(zipPath, response.data);

        function removeTempFiles() {
            fs.unlinkSync(zipPath);
            fs.rmdirSync(updateTempDir, { recursive: true });
        }

        await extract(zipPath, { dir: updateTempDir });

        const updateDir = path.join(updateTempDir, `Cloud-${latestVersion}`);

        if (isAutoUpdateFileOutOfDate(updateDir)) {
            logger.log('The autoUpdate.js file is out of date. Please manually update the application.', null, { name: 'AUTO-UPDATE', type: 'error', msgColor: 'red' });
            removeTempFiles();
            return;
        }

        const ignorePaths = loadIgnorePaths();

        compareAndUpdateFiles(path.join(__dirname, '../../'), updateDir, ignorePaths);

        removeTempFiles();

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

module.exports = { downloadAndApplyUpdate };
