const User = require("../models/User.js")
const Whitelisted = require("../models/Whitelisted.js")
const jwt = require("jsonwebtoken");
const { readdirSync } = require("fs");

module.exports = {
    name: "Api",
    url: "/api/:id",
    run: async (req, res) => {
        const { decoded, data, userFolder, userFolderPath, folderPath } = await Auth(req, res);
        ApiFunction(req, res);
    },
    run2: async (req, res) => {
        const { decoded, data, userFolder, userFolderPath, folderPath } = await Auth(req, res);
        ApiFunction(req, res);
    }
}

async function Auth(req, res) {
    if (!req.cookies.token) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });
    let decoded;
    try {
        decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET, { algorithm: process.env.JWTALGORITHM });
    } catch (e) { }
    if (!decoded) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });

    const data = await User.findOne({
        where: { email: decoded.email, password: decoded.password },
    });
    if (!data) return res.status(500).json({ success: false, message: "FAILED_AUTHENTICATION" });
    if (!data.admin) return res.status(500).json({ success: false, message: "ACCESS_DENIED" });

    const folder = req.cookies.folder || "";


    const userFolder = readdirSync("../../.././Users/").some(
        (userFolder) => userFolder.toLowerCase() === decoded.email
    );

    if (!userFolder) return res.status(500).json({ success: false, message: "INVALID_FOLDER" });
    const userFolderPath = `../../.././Users/${decoded.email}`;
    const folderPath = `${userFolderPath}${folder}`;

    return { decoded, data, userFolder, userFolderPath, folderPath }
}

async function ApiFunction(req, res) {
    if (req.params.id == "admin") {
        async function getAllEmails() {
            const data = await User.findAll({ where: { admin: true } });
            const admins = [];
            data.forEach((user) => {
                admins.push({ id: user.id, email: user.email });
            });
            admins.sort((a, b) => a.id - b.id);
            return admins;
        }
        if (req.query.action == "add") {
            const { email } = req.body;
            if (!email) return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" });
            const data = await User.findOne({ where: { email } });
            if (data) return res.status(500).json({ success: false, message: "EMAIL_ALREADY_ADMIN" });
            data.admin = true;
            await data.save();
            let admins = await getAllEmails();
            return res.status(200).json({ success: true, message: "EMAIL_ADMINED", list: admins });
        } else if (req.query.action == "remove") {
            const { email } = req.body;
            if (!email) return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" });
            const data = await User.findOne({ where: { email } });
            if (!data) return res.status(500).json({ success: false, message: "" });
            data.admin = false
            await data.save();
            let admins = await getAllEmails();
            return res.status(200).json({ success: true, message: "EMAIL_UNADMINED", list: admins });
        } else if (req.query.action == "get") {
            let admins = await getAllEmails();
            return res.status(200).json({ success: true, list: admins });
        } else return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" })
    } else if (req.params.id == "whitelist") {
        async function getAllEmails() {
            const data = await Whitelisted.findAll({ where: {} });
            const whitelist = [];
            data.forEach((user) => {
                whitelist.push({ id: user.id, email: user.email });
            });
            whitelist.sort((a, b) => a.id - b.id);
            return whitelist;
        }
        if (req.query.action == "add") {
            const { email } = req.body;
            if (!email) return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" });
            const data = await Whitelisted.findOne({ where: { email } });
            if (data) return res.status(500).json({ success: false, message: "EMAIL_ALREADY_WHITELISTED" });
            await Whitelisted.create({ email });
            let whitelist = await getAllEmails();
            return res.status(200).json({ success: true, message: "EMAIL_WHITELISTED", list: whitelist });
        } else if (req.query.action == "remove") {
            const { email } = req.body;
            if (!email) return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" });
            const data = await Whitelisted.findOne({ where: { email } });
            if (!data) return res.status(500).json({ success: false, message: "EMAIL_NOT_WHITELISTED" });
            await data.destroy();
            let whitelist = await getAllEmails();
            return res.status(200).json({ success: true, message: "EMAIL_UNWHITELISTED", list: whitelist });
        } else if (req.query.action == "get") {
            let whitelist = await getAllEmails();
            return res.status(200).json({ success: true, list: whitelist });
        } else return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" })
    } else return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" })
}