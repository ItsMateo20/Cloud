const { getCurrentVersion } = require('./CheckVersion.js');
const client = require('discord-rich-presence')('1193532736925876384');

let SystemOS

if (process.platform === 'win32') {
    SystemOS = 'Windows💻';
} else if (process.platform === 'darwin') {
    SystemOS = 'MacOS💻';
} else if (process.platform === 'linux') {
    SystemOS = 'Linux🖥';
} else if (process.platform === 'android') {
    SystemOS = 'a Android📱';
} else if (process.platform === 'freebsd') {
    SystemOS = 'FreeBSD🖥';
} else if (process.platform === 'openbsd') {
    SystemOS = 'OpenBSD🖥';
} else if (process.platform === 'sunos') {
    SystemOS = 'SunOS🖥';
} else if (process.platform === 'aix') {
    SystemOS = 'a AIX🖥';
} else if (process.platform === 'cygwin') {
    SystemOS = 'a Cygwin🖥';
} else if (process.platform === 'netbsd') {
    SystemOS = 'NetBSD🖥';
} else if (process.platform === 'haiku') {
    SystemOS = 'Haiku🖥';
} else if (process.platform === 'gnu') {
    SystemOS = 'a GNU🖥';
} else if (process.platform === 'openindiana') {
    SystemOS = 'OpenIndiana🖥';
} else {
    SystemOS = '';
}

if (SystemOS !== '' || SystemOS !== null || SystemOS !== undefined) {
    SystemOS = `on ${SystemOS}`;
}

let version = `${getCurrentVersion()}`;

const Activity = {
    details: `Running Cloud Server (${getCurrentVersion()}) ${SystemOS}`,
    largeImageKey: 'webicon',
    largeImageText: 'ItsMateo20/Cloud',
    startTimestamp: new Date(),
};

function updatePresence(Activity) {
    return client.updatePresence(Activity);
}

function disconnect() {
    return client.disconnect();
}

function deploy() {
    return client.updatePresence(Activity);
}

function updateState(state, timeout, newState) {
    if (timeout == null || timeout == undefined) timeout = 5000;
    if (newState == null || newState == undefined) newState = "";
    Activity.state = state;
    client.updatePresence(Activity);
    setTimeout(() => {
        Activity.state = newState;
        client.updatePresence(Activity);
    }, timeout);
    return client;
}

let functions = {
    updatePresence: updatePresence,
    disconnect: disconnect,
    deploy: deploy,
    updateState: updateState,
    client: client
}

module.exports = functions;