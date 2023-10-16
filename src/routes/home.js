const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const { readdirSync, mkdirSync, statSync } = require("fs");
const { join, extname, relative } = require("path");
const sizeOf = require('image-size');
const ffprobe = require('node-ffprobe')

module.exports = {
    name: "Home",
    url: "/",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/home.ejs")];

        if (!req.cookies.token) return res.redirect("/login");
        let decoded;
        try {
            decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET);
        } catch (e) { }
        if (!decoded) return res.redirect("/login");

        let data = await User.findOne({
            where: { email: decoded.email, password: decoded.password },
        });
        if (!data) return res.redirect("/login");

        let folder
        if (req.cookies.folder) {
            folder = `${req.cookies.folder}`;
        } else {
            folder = "/";
        }

        const emailExtractedName = data.email.split("@")[0];
        const userFolder = readdirSync("../../.././Users/").some(
            (folder) => folder.toLowerCase() === emailExtractedName
        );

        if (!userFolder) {
            mkdirSync(`../../.././Users/${emailExtractedName}`);
        }

        const userFolderPath = `../../.././Users/${emailExtractedName}`;
        const folderPath = `${userFolderPath}${folder}`;

        try {
            readdirSync(folderPath)
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

                if (extnameS === ".jpg" || extnameS === ".jpeg" || extnameS === ".png" || extnameS === ".gif") {
                    relativePath = `/image?image="${entryRelativePath}"`
                    url = "icons/image.png";
                    type = "image";

                    const dimensions = sizeOf(entryPath);
                    height = dimensions.height;
                    width = dimensions.width;

                    dateModified = statSync(entryPath).mtimeMs;
                } else if (extnameS === ".mp4" || extnameS === ".avi" || extnameS === ".mov") {
                    relativePath = `/video?video="${entryRelativePath}"`
                    url = "icons/video.png";
                    type = "video";

                    const metadata = await ffprobe(entryPath);
                    const dimensions = metadata.streams[0];
                    height = dimensions.height;
                    width = dimensions.width;

                    dateModified = statSync(entryPath).mtimeMs;
                } else if (isDirectory) {
                    relativePath = `/folder?folder="${entryRelativePath}"`
                    url = "assets/icons/folder.png";
                    type = "folder";
                } else {
                    relativePath = `/download?file="${entryRelativePath}"`
                    url = "assets/icons/other.png";
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
                }
                return b.dateModified - a.dateModified;
            });

            return items;
        }


        const items = [];
        await getSubfolders(folderPath, items);

        // console.table(items);

        let args = {
            body: [`Głowna strona | Chmura`],
            email: data.email,
            items: items,
            directory: folder,

            loggedIn: true,
        };

        res.render("../pages/home.ejs", args);
    },
};
