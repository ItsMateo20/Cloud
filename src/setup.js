const fs = require('fs');
const crypto = require('crypto');


function generateSecret(value) {
    return crypto.randomBytes(value).toString('hex');
}

function setup() {
    if (process.env.DISCORD_ACTIVITY === "true") {
        const { updateState } = require("./src/DiscordActivity.js")
        updateState("Setting up Cloud Server...")
    }
    return new Promise((resolve, reject) => {
        fs.rename('./.env.example', './.env', (err) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            const content = `

USERS_DIR=".././Users/"
CHECKVERSION="true"
DISCORD_ACTIVITY="false"
FTP_SERVER="false"
LOGGED_IN_TIMEOUT_MS="86400000"

PORT="3000"
FTP_PORT="3001"

COOKIE_SECRET="${generateSecret(16)}"
SESSION_SECRET="${generateSecret(16)}"
CSRF_SECRET="${generateSecret(16)}"

JWTALGORITHM="HS256"
JWTSECRET="${generateSecret(32)}"
JWTEXPIRESIN="1d"
`;

            fs.mkdir('../Users', (err) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }
            })

            fs.writeFile('./.env', content, (err) => {
                if (err) {
                    console.error(err);
                    reject(err);
                    return;
                }

                resolve(true);
            });
        });
    });
}

module.exports = setup;
