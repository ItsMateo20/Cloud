const User = require("../models/User.js");
const UserSettings = require("../models/UserSettings.js");
const jwt = require("jsonwebtoken");
const { readdirSync } = require("fs");

const { gray, cyan, red } = require("chalk");

module.exports = {
    name: "settings",
    url: "/settings/:setting",
    run: async (req, res) => {
        const { email, folder, decoded, data, userFolderPath, folderPath } = await auth(req, res)

        if (req.params.setting === "settings") {
            return res.status(200).json({ success: true, info: { admin: data.admin }, settings: { darkMode: UserSettingsS.darkMode, showImage: UserSettingsS.showImage, adminMode: UserSettingsS.adminMode } })
        } else return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" })
    },
    run2: async (req, res) => {
        const { email, folder, decoded, data, userFolderPath, folderPath } = await auth(req, res)


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
        } else if (req.params.setting === "adminMode") {
            const { value } = req.body;
            if (value.toString() !== "true" && value.toString() !== "false") return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" })
            let newValue
            if (value.toString() === "true") newValue = true
            if (value.toString() === "false") newValue = false
            UserSettingsS.adminMode = newValue
            await UserSettingsS.save()
            res.status(200).json({ success: true, message: "UPDATED_SETTING" })
        } else return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" })
    },
};

async function auth(req, res) {
    if (!req.cookies.token) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });
    let decoded;
    try {
        decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET, { algorithm: process.env.JWTALGORITHM });
    } catch (e) { }
    if (!decoded) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });

    let data = await User.findOne({
        where: { email: decoded.email, password: decoded.password },
    });
    if (!data) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });
    let UserSettingsS = await UserSettings.findOne({
        where: { email: decoded.email },
    });
    if (!UserSettingsS) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });

    let folder = req.cookies.folder || "";

    const email = decoded.email
    const userFolder = readdirSync("../../.././Users/").some(
        (userFolder) => userFolder.toLowerCase() === email
    );

    if (!userFolder) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });
    let userFolderPath = `../../.././Users/${email}/`;

    if (UserSettingsS.adminMode) {
        userFolderPath = `../../.././Users/`;
    }

    const folderPath = `${userFolderPath}${folder}`;

    return { email, folder, decoded, data, userFolderPath, folderPath }
}