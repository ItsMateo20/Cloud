require("dotenv").config()
const { gray, cyan, red } = require("chalk")

async function BeforeStart() {
    if (process.argv.includes("--setup")) {
        await require("./src/setup.js")().then((success) => {
            if (success) console.log(gray("[SETUP]: ") + cyan("Setup complete.\n") + gray("<------------------------------------------------------>"))
            return process.exit(0)
        }).catch((err) => {
            console.log(err)
            console.log(gray("[SETUP]: ") + cyan("Setup failed.\n") + gray("<------------------------------------------------------>") + red("Please check the error above"))
            return process.exit(0)
        })
    }

    if (process.env.CHECKVERSION == "true") {
        const { checkForUpdates } = require("./src/CheckVersion.js")
        await checkForUpdates().then(() => {
            console.log(gray("[VERSION]: ") + cyan("Version check complete.\n") + gray("<------------------------------------------------------>"))
        }).catch((err) => {
            console.log(err)
        })
    }

    if (process.env.DISCORD_ACTIVITY == "true") {
        const { deploy } = require("./src/DiscordActivity.js")
        await deploy()
        console.log(gray("[DISCORD]: ") + cyan("Discord activity connection complete.\n") + gray("<------------------------------------------------------>"))
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
        console.log(gray("[ROUTING]: ") + cyan(`Started loading ${files.length} routes`));
        files.forEach(f => {
            if (f.endsWith(".js") === false) return console.log(gray("[ROUTING]: ") + red(`Found folder inside routes folder: ${f} skipping...`))
            const file = require(`./src/routes/${f}`)
            if (file && file.url) {
                app.get(file.url, file.run)
                if (file.run2) app.post(file.url, file.run2)
                console.log(gray("[ROUTING]: ") + cyan(`Loaded ${file.url}`))
            }
        })
        app.use(function (req, res, next) {
            res.status(404).send("404 Not Found")
        });
        console.log(gray("[ROUTING]: ") + cyan(`Finished loading ${files.length} routes\n`) + gray("<------------------------------------------------------>"));

        console.log(gray("[SITE]: ") + cyan(`Starting on port ${process.env.PORT}`));
        app.listen(process.env.PORT, () => console.log(gray("[SITE]: ") + cyan(`Webpage listening on port ${process.env.PORT}`)))
    }).catch((err) => {
        console.log(err)
        return process.exit(1)
    })

    process.on('unhandledRejection', (reason, error) => {
        console.error(gray("[SITE]: ") + red('Unhandled Rejection reason:', reason));
        console.error(error);
    });
})