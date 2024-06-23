require('dotenv').config();
const log = require('./logger');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve =>
        rl.question(query, ans => {
            rl.close();
            resolve(ans);
        })
    );
}

async function updateSettings() {
    const key = (await askQuestion('Enter the environment variable key: ')).toUpperCase();
    const value = await askQuestion(`Enter value for ${key}: `);
    updateEnvironmentVariable(key, value);
}


function updateEnvironmentVariable(key, value) {
    const envPath = path.join(__dirname, '.././.env');
    let envFile = fs.readFileSync(envPath, 'utf8');

    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (envFile.match(regex)) {
        envFile = envFile.replace(regex, `${key}="${value}"`);
        process.env[key] = value;
        fs.writeFileSync(envPath, envFile);
        log(`Environment variable ${key} set to ${value}`, null, { type: "info", name: "SETTINGS", msgColor: "green" });
    } else {
        return log(`Environment variable ${key} does not exist`, null, { type: "error", name: "SETTINGS", msgColor: "red" });
    }
}

(async function () {
    await updateSettings();
})();