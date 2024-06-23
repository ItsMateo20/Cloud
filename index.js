require("dotenv").config()
const log = require("./src/components/logger.js")

async function BeforeStart() {
    if (process.argv.includes("--setup")) {
        await require("./src/components/setup.js")().then((success) => {
            if (success) log("Setup complete.", null, { line: true, type: "info", name: "SETUP" })
            return process.exit(0)
        }).catch((err) => {
            log("Setup failed.", err, { line: true, type: "error", name: "SETUP", msgColor: "red" })
            return process.exit(0)
        })
    }

    if (process.env.CHECKVERSION == "true") {
        const { checkForUpdates } = require("./src/components/CheckVersion.js")
        await checkForUpdates().then(() => {
            log("Version check complete.", null, { line: true, type: "info", name: "VERSION" })
        }).catch((err) => {
            log("Version check failed.", err, { line: true, type: "error", name: "VERSION", msgColor: "red" })
        })
    }

    if (process.argv.includes("--update")) {
        const { isOutdated, fetchLatestVersion } = require("./src/components/CheckVersion.js")
        const { downloadAndApplyUpdate } = require("./src/components/autoUpdate.js")
        const version = await fetchLatestVersion()
        if (isOutdated) {
            await downloadAndApplyUpdate(version).then(() => {
                log("Update complete.", null, { line: true, type: "info", name: "UPDATE" })
            }).catch((err) => {
                log("Update failed.", err, { line: true, type: "error", name: "UPDATE", msgColor: "red" })
            })
        }
        return process.exit(0)
    }

    if (process.env.DISCORD_ACTIVITY == "true") {
        const { deploy } = require("./src/components/DiscordActivity.js")
        await deploy()
        log("Discord activity started.", null, { line: true, type: "info", name: "DISCORD" })
    }
}

BeforeStart().then(() => {
    const express = require('express')
    const expressSession = require('express-session')
    const app = express()

    const CookieParser = require("cookie-parser")
    const TinyCsrf = require("tiny-csrf")
    const nocache = require('nocache');

    const { readdirSync } = require('fs')

    const ffprobe = require('node-ffprobe')
    const ffprobeInstaller = require('@ffprobe-installer/ffprobe');

    ffprobe.FFPROBE_PATH = ffprobeInstaller.path
    ffprobe.SYNC = true


    require("./database.js").execute().then(() => {
        app.enable("trust proxy")
        app.disable('x-powered-by')
        app.disable('x-content-type-options')
        app.set("etag", false)

        app.use(express.urlencoded({ extended: false }))
        app.use(express.json());
        app.use(CookieParser(process.env.COOKIE_SECRET))
        app.use(expressSession({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true, cookie: { secure: true, sameSite: "strict", maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true } }))
        app.use(TinyCsrf(process.env.CSRF_SECRET, ["POST"], ["/file/upload"]));
        app.use(nocache())

        app.set("view engine", "ejs")
        app.set("views", __dirname + "/src/pages")
        app.use(express.static(__dirname + '/src/assets/'))
        app.use(express.static(__dirname + '/src/dist/'))

        let files = readdirSync(__dirname + '/src/routes/')
        log(`Started loading ${files.length} routes`, null, { type: "info", name: "ROUTING" })
        files.forEach(f => {
            if (f.endsWith(".js") === false) return log(`Found folder inside routes folder: ${f} skipping...`, null, { type: "warn", name: "ROUTING", msgColor: "yellow" })
            const file = require(`./src/routes/${f}`)
            if (file && file.url) {
                app.get(file.url, file.run)
                if (file.run2) app.post(file.url, file.run2)
                log(`Loaded ${file.url}`, null, { type: "info", name: "ROUTING" })
            }
        })
        app.use(function (req, res, next) {
            res.status(404).send("404 Not Found")
            log(`404 Not Found: ${req.url}`, null, { line: true, type: "warn", name: "USER" })
        });
        log(`Finished loading ${files.length} routes`, null, { line: true, type: "info", name: "ROUTING" })

        log(`Starting on port {green ${process.env.PORT}}`, null, { type: "info", name: "SITE" })
        app.listen(process.env.PORT, () => log(`Webpage listening on port {green ${process.env.PORT}} {gray - You can now view your cloud on http://localhost:${process.env.PORT}}`, null, { type: "info", name: "SITE" }))
    }).catch((err) => {
        log("Failed to connect to database.", err, { type: "error", name: "SITE" })
        return process.exit(1)
    })

    process.on('unhandledRejection', (reason, error) => {
        log('Unhandled Rejection at:', error, { type: "error", name: "SITE" })
    });
})