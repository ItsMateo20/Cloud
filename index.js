require("dotenv").config()
const { gray, cyan, red } = require("chalk")

const express = require('express')
const app = express()

const ftpSrv = require("ftp-srv")
const ftpServer = new ftpSrv({
    url: `ftp://0.0.0.0:${process.env.FTP_PORT}`,
});


const CookieParser = require("cookie-parser")
const UrlEncodedParser = require("body-parser").urlencoded({ extended: false })
const nocache = require('nocache');

const { readdirSync } = require('fs')
const database = require("./database.js")

const User = require("./src/models/User.js")
const Whitelisted = require("./src/models/Whitelisted.js")

const ffprobe = require('node-ffprobe')
const ffprobeInstaller = require('@ffprobe-installer/ffprobe')

ffprobe.FFPROBE_PATH = ffprobeInstaller.path
ffprobe.SYNC = true


ftpServer.on('login', async ({ connection, username, password }, resolve, reject) => {
    if (username === "anonymous") return
    const UserS = await User.findOne({ where: { email: username, password: password } })
    const WhitelistedS = await Whitelisted.findOne({ where: { email: username } })
    if (!UserS || !WhitelistedS) return
    if (UserS && UserS.admin == true) return resolve({ root: `../` });
    if (UserS) return resolve({ root: `../users/${username}/` });
    return
});



database.execute().then(async () => {
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
});

process.on('unhandledRejection', (reason, error) => {
    console.error(gray("[SITE]: ") + red('Unhandled Rejection reason:', reason));
    console.error(error);
});