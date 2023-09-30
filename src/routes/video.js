const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const { readdirSync, mkdirSync, readFileSync } = require("fs");
const { resolve } = require("path");

module.exports = {
    name: "video",
    url: "/video",
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

        if (!req.query.video) return res.redirect("/");
        req.query.video = req.query.video.replace(/"/g, "").replace(/'/g, "")

        const emailExtractedName = data.email.split("@")[0];
        const UserFolder = readdirSync("../../.././Users/").some(
            (folder) => folder.toLowerCase() === emailExtractedName
        );

        if (!UserFolder) {
            mkdirSync(`../../.././Users/${emailExtractedName}`);
        }

        const userFolderPath = `../../.././Users/${emailExtractedName}`;
        const videoPath = `${userFolderPath}/${req.query.video}`;
        const getVideo = readFileSync(videoPath);

        if (!getVideo) return res.redirect("/");
        const video = resolve(videoPath);

        res.sendFile(video);
    },
};
