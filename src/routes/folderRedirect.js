const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const { readdirSync, mkdirSync } = require("fs");

module.exports = {
    name: "folderRedirect",
    url: "/folder/:folder",
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

        if (!userFolder) return res.redirect("/");

        if (!req.params.folder) return res.redirect("/")

        if (req.params.folder === "back") {

            const folders = folder.split('/').filter(folder => folder.trim() !== '');

            if (folders.length >= 1) {
                folders.pop();
                const newFolderPath = "/" + folders.join('/')

                res.cookie('folder', newFolderPath);
            }
        } else if (req.params.folder === "root") {
            res.clearCookie('folder');
        } else if (req.params.folder === "new") {
            if (req.query.name) {
                if (readdirSync(`../../.././Users/${emailExtractedName}${folder}`)) {
                    if (readdirSync(`../../.././Users/${emailExtractedName}/${folder}`).includes(req.query.name)) {
                        res.cookie('folder', folder + req.query.name)
                    } else {
                        await mkdirSync(`../../.././Users/${emailExtractedName}/${folder}/${req.query.name}`)

                        if (readdirSync(`../../.././Users/${emailExtractedName}/${folder}/${req.query.name}`)) {
                            res.cookie('folder', folder + req.query.name);
                        }
                    }
                }
            }
        }

        res.redirect("/")
    },
    run2: async (req, res) => { },
};
