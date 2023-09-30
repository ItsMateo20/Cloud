const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const { readdirSync, mkdirSync, statSync } = require("fs");
const { join, extname, relative } = require("path");

module.exports = {
    name: "Folder",
    url: "/folder",
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

        if (!req.query.folder) return res.redirect("/")
        req.query.folder = req.query.folder.replace(/"/g, "").replace(/'/g, "")

        const emailExtractedName = data.email.split("@")[0];
        const UserFolder = readdirSync("../../.././Users/").some(
            (folder) => folder.toLowerCase() === emailExtractedName
        );

        if (!UserFolder) return res.redirect("/");

        const userFolderPath = `../../.././Users/${emailExtractedName}`;
        const folderPath = `${userFolderPath}/${req.query.folder}`;
        const getFolder = readdirSync(folderPath);

        if (!getFolder) return res.redirect("/");

        res.cookie("folder", `/${req.query.folder}`, { maxAge: 86400000 });

        res.redirect("/");
    },
};
