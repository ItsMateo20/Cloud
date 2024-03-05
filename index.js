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
    } else console.log(gray("[VERSION]: ") + cyan("Version check disabled.\n") + gray("<------------------------------------------------------>"))

    if (process.env.DISCORD_ACTIVITY == "true") {
        const { deploy } = require("./src/DiscordActivity.js")
        await deploy()
        console.log(gray("[DISCORD]: ") + cyan("Discord activity connection complete.\n") + gray("<------------------------------------------------------>"))
    } else console.log(gray("[DISCORD]: ") + cyan("Discord activity disabled.\n") + gray("<------------------------------------------------------>"))
}

BeforeStart().then(() => {
    const express = require('express')
    const expressSession = require('express-session')
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
        timeout: 60000,
    });



    const CookieParser = require("cookie-parser")
    const TinyCsrf = require("tiny-csrf")
    const nocache = require('nocache');

    const { readdirSync } = require('fs')

    const User = require("./src/models/User.js")
    const Whitelisted = require("./src/models/Whitelisted.js")

    const ffprobe = require('node-ffprobe')
    const ffprobeInstaller = require('@ffprobe-installer/ffprobe');

    ffprobe.FFPROBE_PATH = ffprobeInstaller.path
    ffprobe.SYNC = true

    ftpServer.on('login', async ({ connection, username, password }, resolve, reject) => {
        if (username === "anonymous") return
        const UserS = await User.findOne({ where: { email: username, password: password } })
        const WhitelistedS = await Whitelisted.findOne({ where: { email: username } })
        if (!UserS || !WhitelistedS) return
        if (UserS && UserS.admin == true) return resolve({ root: process.env.USERS_ADMIN_FTP_DIR });
        if (UserS) return resolve({ root: __dirname + `/${process.env.USERS_FTP_DIR}${username}/` });
        return
    })

    ftpServer.on('server-error', ({ error }) => {
        console.log(error)
    });

    ftpServer.on('client-error', ({ connection, context, error }) => {
        console.log(error)
    });


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
            res.status(404).render("404.ejs", { body: ["404 | Chmura"], loggedIn: false })
        });
        console.log(gray("[ROUTING]: ") + cyan(`Finished loading ${files.length} routes\n`) + gray("<------------------------------------------------------>"));

        console.log(gray("[SITE]: ") + cyan(`Starting on port ${process.env.PORT}`));
        app.listen(process.env.PORT, () => console.log(gray("[SITE]: ") + cyan(`Webpage listening on port ${process.env.PORT}`)))
        if (process.env.FTP_SERVER === "true") ftpServer.listen(process.env.FTP_PORT).then(() => console.log(gray("[SITE]: ") + cyan(`Ftp server listening on port ${process.env.FTP_PORT}`)))
    }).catch((err) => {
        console.log(err)
        return process.exit(1)
    })

    process.on('unhandledRejection', (reason, error) => {
        console.error(gray("[SITE]: ") + red('Unhandled Rejection reason:', reason));
        console.error(error);
    });
})