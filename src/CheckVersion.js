const { cyan, gray, green, red } = require('chalk');
const fs = require('fs');

function getCurrentVersion() {
    try {
        const packageJsonContent = fs.readFileSync('package.json', 'utf8');
        const packageJson = JSON.parse(packageJsonContent);
        return packageJson.version;
    } catch (error) {
        console.error(gray("[VERSION]: ") + red(`Error reading package.json: ${error}`));
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
            console.error(gray("[VERSION]: ") + red("Invalid response or missing version information."));
            return null;
        }
    } catch (error) {
        console.error(gray("[VERSION]: ") + red(`Error fetching latest version: ${error}`));
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
        return console.error(gray("[VERSION]: ") + red("Unable to retrieve current version. Check the package.json file."));
    }

    const latestVersion = await fetchLatestVersion();
    if (latestVersion && isOutdated(currentVersion, latestVersion)) {
        const releaseUrl = `https://github.com/ItsMateo20/Cloud/archive/refs/tags/${latestVersion}.zip`;
        return console.log(gray("[VERSION]: ") + red("You are using an outdated version. ") + gray(`(${red(currentVersion)} -> ${green(latestVersion)})`) + gray("\n[VERSION]: ") + red(`Please download the update at ${gray(releaseUrl)}`));
    } else {
        return console.log(gray("[VERSION]: ") + cyan(`You are using the latest version. ${gray(`(${green(currentVersion)})`)}`));
    }
}

let functions = {
    getCurrentVersion: getCurrentVersion,
    fetchLatestVersion: fetchLatestVersion,
    isOutdated: isOutdated,
    checkForUpdates: checkForUpdates
}

module.exports = functions;