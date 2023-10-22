const User = require("../models/User.js");
const UserSettings = require("../models/UserSettings.js");
const jwt = require("jsonwebtoken");
const { readdirSync } = require("fs");

const { gray, cyan, red } = require("chalk");

module.exports = {
    name: "settings",
    url: "/settings/:setting",
    run: async (req, res) => {
        if (!req.cookies.token) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });
        let decoded;
        try {
            decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET);
        } catch (e) { }
        if (!decoded) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });

        const data = await User.findOne({
            where: { email: decoded.email, password: decoded.password },
        });
        if (!data) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });
        const UserSettingsS = await UserSettings.findOne({
            where: { email: decoded.email },
        });
        if (!UserSettingsS) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });

        const folder = req.cookies.folder || "";

        const emailExtractedName = data.email.split("@")[0];
        const userFolder = readdirSync("../../.././Users/").some(
            (userFolder) => userFolder.toLowerCase() === emailExtractedName
        );

        if (!userFolder) return res.status(500).json({ success: false, message: "INVALID_FOLDER" });
        const userFolderPath = `../../.././Users/${emailExtractedName}`;
        const folderPath = `${userFolderPath}${folder}`;

        if (req.params.setting === "settings") {
            return res.status(200).json({ success: true, settings: { darkMode: UserSettingsS.darkMode, showImage: UserSettingsS.showImage } })
        } else return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" })
    },
    run2: async (req, res) => {
        if (!req.cookies.token) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });
        let decoded;
        try {
            decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET);
        } catch (e) { }
        if (!decoded) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });

        const data = await User.findOne({
            where: { email: decoded.email, password: decoded.password },
        });
        if (!data) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });
        const UserSettingsS = await UserSettings.findOne({
            where: { email: decoded.email },
        });
        if (!UserSettingsS) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });

        const folder = req.cookies.folder || "";

        const emailExtractedName = data.email.split("@")[0];
        const userFolder = readdirSync("../../.././Users/").some(
            (userFolder) => userFolder.toLowerCase() === emailExtractedName
        );

        if (!userFolder) return res.status(500).json({ success: false, message: "INVALID_FOLDER" });
        const userFolderPath = `../../.././Users/${emailExtractedName}`;
        const folderPath = `${userFolderPath}${folder}`;


        if (req.params.setting === "showImage") {
            const { value } = req.body;
            if (value.toString() !== "true" && value.toString() !== "false") return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" })
            let newValue
            if (value.toString() === "true") newValue = true
            if (value.toString() === "false") newValue = false
            UserSettingsS.showImage = newValue
            await UserSettingsS.save()
            res.status(200).json({ success: true, message: "UPDATED_SETTING" })
        } else if (req.params.setting === "darkMode") {
            const { value } = req.body;
            if (value.toString() !== "true" && value.toString() !== "false") return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" })
            let newValue
            if (value.toString() === "true") newValue = true
            if (value.toString() === "false") newValue = false
            UserSettingsS.darkMode = newValue
            await UserSettingsS.save()
            res.status(200).json({ success: true, message: "UPDATED_SETTING" })
        } else return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" })
    },
};
