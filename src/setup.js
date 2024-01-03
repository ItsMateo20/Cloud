const fs = require('fs');
const crypto = require('crypto');

function generateSecret(value) {
    return crypto.randomBytes(value).toString('hex');
}

function setup() {
    return new Promise((resolve, reject) => {
        fs.rename('./.env.example', './.env', (err) => {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }

            const content = `

USERS_DIR="./Users/"
CHECKVERSION="true"

PORT="3000"
FTP_PORT="3001"

COOKIE_SECRET="${generateSecret(16)}"
SESSION_SECRET="${generateSecret(16)}"
CSRF_SECRET="${generateSecret(16)}"

JWTALGORITHM="HS256"
JWTSECRET="${generateSecret(32)}"
JWTEXPIRESIN="1d"
`;

            fs.mkdir('./Users', (err) => {
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
