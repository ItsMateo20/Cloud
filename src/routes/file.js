const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const { readdirSync, existsSync } = require("fs");
const multer = require("multer");

module.exports = {
    name: "file",
    url: "/file/:file",
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
            folder = "";
        }


        const emailExtractedName = data.email.split("@")[0];
        const UserFolder = readdirSync("../../.././Users/").some(
            (folder) => folder.toLowerCase() === emailExtractedName
        );

        if (!UserFolder) return res.redirect("/");

        if (!req.params.file) return res.redirect("/")

        if (req.params.file === "upload") {
            console.log("no form", req.body)
        }

        res.redirect("/")
    },
    run2: async (req, res) => {
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

        let folder = req.cookies.folder || "";

        let emailExtractedName = data.email.split("@")[0];
        const UserFolder = readdirSync("../../.././Users/").some(
            (userFolder) => userFolder.toLowerCase() === emailExtractedName
        );

        if (!UserFolder) return res.redirect("/");
        if (!req.params.file || req.params.file !== "upload") return res.redirect("/");

        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, `../../.././Users/${emailExtractedName}${folder}`);
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname);
            },
        });

        const upload = multer({ storage: storage }).array("files");

        upload(req, res, (err) => {
            // const filesExist = req.files.some((file) => {
            //     return existsSync(`../../.././Users/${emailExtractedName}${folder}/${file.originalname}`);
            // });

            // if (filesExist) {
            //     return res.status(200).json({ success: false, message: "FILE_ALREADY_EXISTS" });
            // }
            if (err) {
                return res.status(200).json({ success: false, message: "ERROR_WHILE_UPLOADING_FILE" });
            }

            return res.status(200).json({ success: true, message: "FILE_UPLOADED" });
        });
    },
};
