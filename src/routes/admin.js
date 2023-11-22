const User = require("../models/User.js");
const UserSettings = require("../models/UserSettings.js");
const jwt = require("jsonwebtoken");
const { readdirSync, mkdirSync } = require("fs");

module.exports = {
    name: "Admin",
    url: "/admin",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/admin.ejs")];

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
        if (data.admin == false) return res.redirect("/");
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

        const userFolder = readdirSync("../../.././Users/").some(
            (folder) => folder.toLowerCase() === decoded.email
        );

        if (!userFolder) {
            mkdirSync(`../../.././Users/${decoded.email}`);
        }

        let userFolderPath = `../../.././Users/${decoded.email}/`;

        if (UserSettingsS.adminMode) {
            userFolderPath = `../../.././Users/`;
        }

        const folderPath = `${userFolderPath}${folder}`;

        let args = {
            body: [`Panel admina | Chmura`],
            email: data.email,
            directory: folder,

            admin: data.admin,

            loggedIn: true,
        };

        res.render("../pages/admin.ejs", args);
    },
};
