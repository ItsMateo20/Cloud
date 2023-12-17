require("dotenv").config()
const config = require("./config.json")
const { gray, cyan, red } = require("chalk")
if (config.CheckVersion == true) {
    require("./src/CheckVersion.js")().then(() => {
        console.log(gray("[VERSION]: ") + cyan("Version check complete\n") + gray("<------------------------------------------------------>"))
        StartServer()
    }).catch((err) => {
        console.log(err)
        process.exit(1)
    })
} else {
    StartServer()
}

function StartServer() {
    const express = require('express')
    const app = express()

    const ftpSrv = require("ftp-srv");
    const { networkInterfaces } = require('os');
    const { Netmask } = require('netmask');

    const nets = networkInterfaces();

    function getNetworks() {
        let networks = {};
        for (const name of Object.keys(nets)) {
            for (const net of nets[name]) {
                if (net.family === 'IPv4' && !net.internal) {
                    networks[net.address + "/24"] = net.address;
                }
            }
        }
        return networks;
    }

    const resolverFunction = (address) => {
        const networks = getNetworks();
        for (const network in networks) {
            if (new Netmask(network).contains(address)) {
                return networks[network];
            }
        }
        return "127.0.0.1";
    };

    const ftpServer = new ftpSrv({
        url: `ftp://0.0.0.0:${process.env.FTP_PORT}`,
        pasv_url: resolverFunction,
        pasv_min: 1024,
        pasv_max: 65535,
        greeting: ["Welcome to the FTP server"],
        timeout: 60000,
    });


    const CookieParser = require("cookie-parser")
    const UrlEncodedParser = require("body-parser").urlencoded({ extended: false })
    const nocache = require('nocache');

    const { readdirSync } = require('fs')

    const User = require("./src/models/User.js")
    const Whitelisted = require("./src/models/Whitelisted.js")

    const ffprobe = require('node-ffprobe')
    const ffprobeInstaller = require('@ffprobe-installer/ffprobe');

    ffprobe.FFPROBE_PATH = ffprobeInstaller.path
    ffprobe.SYNC = true

    ftpServer.on('login', async ({ connection, username, password }, resolve, reject) => {
        console.log(connection.socket + " is trying to login with " + username + ":" + password)
        if (username === "anonymous") return
        const UserS = await User.findOne({ where: { email: username, password: password } })
        const WhitelistedS = await Whitelisted.findOne({ where: { email: username } })
        if (!UserS || !WhitelistedS) return
        console.log("Logged in as " + username)
        if (UserS && UserS.admin == true) return resolve({ root: `../` });
        console.log("Not admin logged in as " + username)
        if (UserS) return resolve({ root: `../users/${username}/` });
        console.log("error")
        return
    });

    ftpServer.on('disconnect', ({ connection, id, newConnectionCount }) => { console.log(id, newConnectionCount) });

    require("./database.js").execute().then(() => {
        app.enable("trust proxy")
        app.disable('x-powered-by')
        app.disable('x-content-type-options')
        app.set("etag", false)

        app.use(nocache())
        app.use(CookieParser())
        app.use(UrlEncodedParser)

        app.use(express.json());
        app.set("view engine", "ejs")
        app.set("views", __dirname + "/src/pages")
        app.use(express.static(__dirname + '/src/assets/'))

        let files = readdirSync(__dirname + '/src/routes/')
        console.log(gray("[SITE]: ") + cyan(`Started loading ${files.length} routes`));
        files.forEach(f => {
            const file = require(`./src/routes/${f}`)
            if (file && file.url) {
                app.get(file.url, file.run)
                if (file.run2) app.post(file.url, file.run2)
                console.log(gray("[SITE]: ") + cyan(`Loaded /${file.name.toLowerCase()}`))
            }
        })
        console.log(gray("[SITE]: ") + cyan(`Finished loading ${files.length} routes\n`) + gray("<------------------------------------------------------>"));

        console.log(gray("[SITE]: ") + cyan(`Starting on port ${process.env.PORT}`));
        app.listen(process.env.PORT, () => console.log(gray("[SITE]: ") + cyan(`Webpage listening on port ${process.env.PORT}`)))
        ftpServer.listen(process.env.FTP_PORT).then(() => console.log(gray("[SITE]: ") + cyan(`Ftp server listening on port ${process.env.FTP_PORT}`)))
    }).catch((err) => {
        console.log(err)
        process.exit(1)
    })

    process.on('unhandledRejection', (reason, error) => {
        console.error(gray("[SITE]: ") + red('Unhandled Rejection reason:', reason));
        console.error(error);
    });
}