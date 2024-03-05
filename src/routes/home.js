const User = require("../models/User.js");
const UserSettings = require("../models/UserSettings.js");
const Whitelisted = require("../models/Whitelisted.js");
const jwt = require("jsonwebtoken");
const { readdirSync, mkdirSync, statSync, existsSync, readFileSync } = require("fs");
const { join, extname, relative } = require("path");
const sharp = require('sharp');
const ffprobe = require('node-ffprobe')

const textDocumentFiles = readFileSync(__dirname + "/../dist/json/txtDocumentExtensionMap.json")

module.exports = {
    name: "Home",
    url: "/",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/home.ejs")];

        if (!req.cookies.token) return res.redirect("/login");
        let decoded;
        try {
            decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET, { algorithm: process.env.JWTALGORITHM });
        } catch (e) { }
        if (!decoded) return res.redirect("/login");

        let data = await User.findOne({
            where: { email: decoded.email, password: decoded.password },
        });
        if (!data) return res.redirect("/login");
        let UserSettingsS = await UserSettings.findOne({
            where: { email: decoded.email },
        });
        if (!UserSettingsS) return res.redirect("/login");

        let folder
        if (req.cookies.folder) {
            folder = `${req.cookies.folder}`;
        } else {
            folder = "/";
        }


        const userFolder = readdirSync(`${process.env.USERS_DIR}`).some(
            (folder) => folder.toLowerCase() === decoded.email
        );

        if (!userFolder) {
            mkdirSync(`${process.env.USERS_DIR}/${decoded.email}`);
        }

        let userFolderPath = `${process.env.USERS_DIR}${decoded.email}/`;

        if (UserSettingsS.adminMode) {
            userFolderPath = `${process.env.USERS_DIR}`;
        }

        const folderPath = `${userFolderPath}${folder}`;

        try {
            await existsSync(folderPath)
        } catch (e) {
            res.clearCookie('folder');
            return res.redirect("/?error=INVALID_FOLDER")
        }


        async function getSubfolders(directory, items) {
            const entries = readdirSync(directory);

            for (const entry of entries) {
                const entryPath = join(directory, entry);
                let entryRelativePath = relative(userFolderPath, entryPath);
                const isDirectory = statSync(entryPath).isDirectory();

                entryRelativePath = entryRelativePath.toString().replace(/\\/g, "/");

                let url = "assets/icons/other.png";
                let relativePath = "";
                let type = "other";
                let height = 100;
                let width = 300;
                let dateModified = 1;

                const extnameS = extname(entry).toLowerCase()

                if (isDirectory || extnameS === "" || extnameS === "." || !extnameS) {
                    relativePath = `/folder/folder?path=${entryRelativePath}`
                    url = "icons/folder.png";
                    type = "folder";
                } else if (extnameS === ".jpg" || extnameS === ".jfif" || extnameS === ".jpeg" || extnameS === ".png" || extnameS === ".gif" || extnameS === ".webp") {
                    relativePath = `/image?path=${entryRelativePath}`
                    url = "icons/image.png"
                    type = "image";

                    const dimensions = await sharp(entryPath).metadata();
                    height = dimensions.height;
                    width = dimensions.width;

                    dateModified = statSync(entryPath).mtimeMs;
                } else if (extnameS === ".mp4" || extnameS === ".mp4a" || extnameS === ".avi" || extnameS === ".mov") {
                    relativePath = `/video?path=${entryRelativePath}`
                    url = "icons/video.png";
                    type = "video";

                    const metadata = await ffprobe(entryPath);
                    const dimensions = metadata.streams[0]
                    const dimensions2 = metadata.streams[1]
                    height = dimensions.height || dimensions2.height || 100;
                    width = dimensions.width || dimensions2.width || 300;

                    dateModified = statSync(entryPath).mtimeMs;
                } else if (extnameS === ".mp3" || extnameS === ".wav" || extnameS === ".ogg" || extnameS === ".flac" || extnameS === ".m4a") {
                    relativePath = `/audio?path=${entryRelativePath}`
                    url = "icons/audio.png";
                    type = "audio";
                } else if (textDocumentFiles.toString().includes(extnameS)) {
                    relativePath = `/document?path=${entryRelativePath}`
                    url = "icons/document.png";
                    type = "document";
                } else {
                    relativePath = `/file/download?name=${entry}&path=${entryRelativePath}&type=other`
                    url = "icons/other.png";
                    type = "other";
                    dateModified = statSync(entryPath).mtimeMs;
                }

                const itemInfo = {
                    name: entry,
                    redirect: relativePath,
                    path: entryRelativePath,
                    type: type,
                    imageurl: url,
                    height: height,
                    width: width,
                    dateModified: dateModified,
                };

                items.push(itemInfo);
            }

            items.sort((a, b) => {
                if (a.type === "folder" && b.type !== "folder") {
                    return -1;
                } else if (a.type !== "folder" && b.type === "folder") {
                    return 1;
                } else if (a.type === "audio" && b.type !== "audio") {
                    return 1;
                } else if (a.type !== "audio" && b.type === "audio") {
                    return -1;
                } else if (a.type === "document" && b.type !== "document") {
                    return 1;
                } else if (a.type !== "document" && b.type === "document") {
                    return -1;
                }
                if (b.dateModified - a.dateModified === 0) {
                    const aNumbers = a.name.match(/\d+/g);
                    const bNumbers = b.name.match(/\d+/g);
                    const aSum = aNumbers ? aNumbers.map(Number).reduce((a, b) => a + b, 0) : 0;
                    const bSum = bNumbers ? bNumbers.map(Number).reduce((a, b) => a + b, 0) : 0;
                    if (aSum !== bSum) {
                        return bSum - aSum;
                    }
                    return a.name.localeCompare(b.name);
                }
                return b.dateModified - a.dateModified;
            });

            return items;
        }


        const items = [];
        await getSubfolders(folderPath, items);

        if (folder.startsWith("/")) {
            folder = folder.substring(1);
        }
        if (folder.includes("//")) {
            folder = folder.replace("//", "/");
        }

        let args = {
            body: [`Główna strona | Chmura`],
            email: data.email,
            items: items,
            directory: folder,

            admin: data.admin,

            loggedIn: true,
        };

        const localizationContent = await require("../dist/localization/" + UserSettingsS.localization + ".json")
        args.body = [`${localizationContent.Pages["Home"]} | ${localizationContent.Main["Title"]}`]

        if (data.admin) {
            const whitelisted = await Whitelisted.findAll();
            const whitelist = [];
            whitelisted.forEach((user) => {
                whitelist.push({ id: user.id, email: user.email });
            });
            whitelist.sort((a, b) => a.id - b.id);
            args.whitelistList = whitelist;

            const admins = await User.findAll({ where: { admin: true } });
            const adminList = [];
            admins.forEach((user) => {
                adminList.push({ id: user.id, email: user.email });
            });
            adminList.sort((a, b) => a.id - b.id);
            args.adminList = adminList;
        }

        res.render("../pages/home.ejs", args);
    },
};
