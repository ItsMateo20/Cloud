const logger = require("./logger.js");
const fetch = require('node-fetch');
const fs = require('fs');

function getCurrentVersion() {
    try {
        const packageJsonContent = fs.readFileSync('package.json', 'utf8');
        const packageJson = JSON.parse(packageJsonContent);
        return packageJson.version;
    } catch (error) {
        logger.log(`Error reading package.json: ${error}`, null, { name: 'VERSION', type: 'error', msgColor: 'red' });
        return null;
    }
}

async function fetchLatestVersion() {
    try {
        const releasesUrl = `https://api.github.com/repos/ItsMateo20/Cloud/releases/latest`;
        const response = await fetch(releasesUrl);
        const data = await response.json();

        if (response.ok && data.tag_name) {
            return data.tag_name;
        } else {
            logger.log('Invalid response or missing version information.', null, { name: 'VERSION', type: 'error', msgColor: 'red' });
            return null;
        }
    } catch (error) {
        logger.log(`Error fetching latest version: ${error}`, null, { name: 'VERSION', type: 'error', msgColor: 'red' });
        return null;
    }
}

function isOutdated(currentVersion, latestVersion) {
    const current = currentVersion.split(".").map(Number);
    const latest = latestVersion.split(".").map(Number);

    for (let i = 0; i < current.length; i++) {
        if (current[i] < latest[i]) {
            return true;
        } else if (current[i] > latest[i]) {
            return false;
        }
    }

    return false;
}

async function checkForUpdates() {
    const currentVersion = getCurrentVersion();
    if (!currentVersion) {
        return logger.log('Unable to retrieve current version. Check the package.json file.', null, { name: 'VERSION', type: 'error', msgColor: 'red' });
    }

    const latestVersion = await fetchLatestVersion();
    if (latestVersion && isOutdated(currentVersion, latestVersion)) {
        const releaseUrl = `https://github.com/ItsMateo20/Cloud/archive/refs/tags/${latestVersion}.zip`;
        logger.log(`You are using an outdated version. {gray (}{red ${currentVersion}} {gray ->} {green ${latestVersion}}{gray )}`, null, { name: 'VERSION', msgColor: 'red' });
        if (process.env.AUTO_UPDATE === "true") {
            logger.log('Starting auto-update...', null, { name: 'VERSION' });
            try {
                await require("./autoUpdate.js").downloadAndApplyUpdate(latestVersion);
            } catch (error) {
                logger.log(`Error applying update: ${error}\nPlease download the update manually at ${releaseUrl} and follow the instructions on our gitbook guide https://itsmateo20.gitbook.io/cloud/guides/server/migrating`, null, { name: 'VERSION', type: 'error', msgColor: 'red' });
            } finally {
                return process.exit(0);
            }
        } else {
            logger.log(`To automatically update, set the AUTOUPDATE environment variable to 'true' else just download the update manually at {gray ${releaseUrl}} and follow the instructions on our gitbook guide {gray https://itsmateo20.gitbook.io/cloud/guides/server/migrating}`, null, { name: 'VERSION', msgColor: 'red' });
        }
    } else {
        return logger.log(`You are using the latest version. {gray (}{green ${currentVersion}}{gray )}`, null, { name: 'VERSION' });
    }
}

let functions = {
    getCurrentVersion: getCurrentVersion,
    fetchLatestVersion: fetchLatestVersion,
    isOutdated: isOutdated,
    checkForUpdates: checkForUpdates
}

module.exports = functions;