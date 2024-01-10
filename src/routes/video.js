const User = require("../models/User.js");
const UserSettings = require("../models/UserSettings.js");
const jwt = require("jsonwebtoken");
const { readdirSync, mkdirSync, existsSync } = require("fs");
const { resolve } = require("path");

const ffprobe = require('node-ffprobe')

module.exports = {
    name: "video",
    url: "/video",
    run: async (req, res) => {
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

        if (!req.query.path) return res.redirect("/");
        req.query.path = req.query.path.replace(/"/g, "").replace(/'/g, "")


        const userFolder = readdirSync(`${process.env.USERS_DIR}`).some(
            (folder) => folder.toLowerCase() === decoded.email
        );

        if (!userFolder) {
            mkdirSync(`${process.env.USERS_DIR}${decoded.email}`);
        }

        let userFolderPath = `${process.env.USERS_DIR}${decoded.email}/`;

        if (UserSettingsS.adminMode) {
            userFolderPath = `${process.env.USERS_DIR}`;
        }

        const videoPath = `${userFolderPath}${req.query.path}`;
        const getVideo = existsSync(videoPath);

        if (!getVideo) return res.redirect("/?error=FILE_DOESNT_EXIST");
        const video = resolve(videoPath);

        // if (req.query.preview && req.query.preview == "true") {
        //     const metadata = await ffprobe(video);
        //     const dimensions = metadata.streams[0];
        //     let height = dimensions.height;
        //     let width = dimensions.width;
        // } else 
        res.sendFile(video);
    },
};