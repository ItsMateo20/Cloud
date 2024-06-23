const fs = require('fs');
const crypto = require('crypto');

function generateSecret(length) {
    return crypto.randomBytes(length).toString('hex');
}

function setup() {
    if (process.env.DISCORD_ACTIVITY === "true") {
        const { updateState } = require("./src/conponents/DiscordActivity.js");
        updateState("Setting up Cloud Server...");
    }
    return new Promise((resolve, reject) => {
        fs.readFile('./.env.example', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            const newContent = data.replace(/({32bit secret}|{64bit secret}|{number of rounds})/g, function (match) {
                if (match === "{32bit secret}") {
                    return generateSecret(16);
                } else if (match === "{64bit secret}") {
                    return generateSecret(32);
                } else if (match === "{number of rounds}") {
                    return Math.floor(Math.random() * (100 - 10 + 1) + 10).toString();
                }
            });

            fs.mkdir('./Users', (err) => {
                if (err && err.code !== 'EEXIST') {
                    console.error(err);
                    reject(err);
                    return;
                }

                fs.writeFile('./.env', newContent, (err) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                        return;
                    }

                    fs.unlink('./.env.example', (err) => {
                        if (err) {
                            console.error(err);
                            reject(err);
                            return;
                        }
                        resolve(true);
                    });
                });
            });
        });
    });
}

module.exports = setup;
