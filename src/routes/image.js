const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const { readdirSync, mkdirSync, existsSync } = require("fs");
const { resolve } = require("path");

module.exports = {
    name: "image",
    url: "/image",
    run: async (req, res) => {
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

        if (!req.query.image) return res.redirect("/");
        req.query.image = req.query.image.replace(/"/g, "").replace(/'/g, "")

        const emailExtractedName = data.email.split("@")[0];
        const UserFolder = readdirSync("../../.././Users/").some(
            (folder) => folder.toLowerCase() === emailExtractedName
        );

        if (!UserFolder) {
            mkdirSync(`../../.././Users/${emailExtractedName}`);
        }

        const userFolderPath = `../../.././Users/${emailExtractedName}`;
        const imagePath = `${userFolderPath}/${req.query.image}`;
        const getImage = existsSync(imagePath);

        if (!getImage) return res.redirect("/?error=FILE_DOESNT_EXIST");
        const image = resolve(imagePath);

        res.sendFile(image);
    },
};
