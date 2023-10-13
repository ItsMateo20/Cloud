const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const { readdirSync, existsSync, unlinkSync, rmdirSync, createWriteStream, renameSync } = require("fs");
const archiver = require('archiver');
const { join } = require("path");
const multer = require("multer");

const { gray, cyan, red } = require("chalk");

module.exports = {
    name: "file",
    url: "/file/:file",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/home.ejs")];

        const { emailExtractedName, folder, decoded, data, userFolderPath, folderPath } = await auth(req, res)

        if (!req.params.file) return res.redirect("/")

        if (req.params.file === "delete") {
            const { name, path, type } = req.query;

            if (!name || !path || !type) return res.redirect("/?error=FILE_DOESNT_EXIST")
            if (type === "folder") {
                if (existsSync(`${folderPath}/${name}`) && existsSync(`${userFolderPath}/${path}`)) {
                    await rmdirSync(`${userFolderPath}/${path}`, { recursive: true, force: true })
                    return res.redirect("/?success=FOLDER_DELETED")
                } else return res.redirect("/?error=FOLDER_DOESNT_EXIST")
            } else {
                if (existsSync(`${folderPath}/${name}`) && existsSync(`${userFolderPath}/${path}`)) {
                    await unlinkSync(`${userFolderPath}/${path}`)
                    return res.redirect("/?success=FILE_DELETED")
                } else return res.redirect("/?error=FILE_DOESNT_EXIST")
            }
        } else if (req.params.file === "download") {
            const { name, path, type } = req.query;

            if (!name || !path || !type) return res.redirect("/?error=FILE_DOESNT_EXIST");

            if (type === "folder") {
                if (existsSync(`${folderPath}/${name}`) && existsSync(`${userFolderPath}/${path}`)) {
                    const zipFileName = `${name}.zip`;
                    const zipFilePath = join(`${userFolderPath}/${path}`, zipFileName);
                    const output = createWriteStream(zipFilePath);
                    const archive = archiver('zip', {
                        zlib: { level: 0 },
                    });

                    archive.on('error', (err) => {
                        console.log(gray("[SITE]: ") + red('Error during zip creation:', err));
                        return res.redirect('/?error=ZIP_CREATION_ERROR');
                    });

                    output.on('close', async function () {
                        await res.download(zipFilePath, zipFileName, async (err) => {
                            if (err) {
                                console.log(gray("[SITE]: ") + red('Error during download:', err));
                            } else {
                                await unlinkSync(zipFilePath);
                                if (existsSync(zipFilePath)) {
                                    await unlinkSync(zipFilePath).catch((err) => {
                                        console.log(gray("[SITE]: ") + red('Error during deleting zip file:', err));
                                    });
                                }
                            }
                        });
                    });

                    archive.pipe(output);
                    archive.directory(`${userFolderPath}/${path}`, false);
                    archive.finalize();
                } else return res.redirect("/?error=FOLDER_DOESNT_EXIST");
            } else {
                if (existsSync(`${userFolderPath}${folder}/${name}`) && existsSync(`${userFolderPath}/${path}`)) {
                    return res.download(`${userFolderPath}/${path}`).catch((err) => {
                        console.log(gray("[SITE]: ") + red('Error during download:', err));
                        return res.redirect('/?error=DOWNLOAD_ERROR');
                    });
                } else return res.redirect("/?error=FILE_DOESNT_EXIST");
            }
        } else if (req.params.file === "rename") {
            const { name, path, type, newName } = req.query;

            if (!name || !path || !type || !newName) return res.redirect("/?error=FILE_DOESNT_EXIST")
            if (type === "folder") {
                if (existsSync(`${userFolderPath}${folder}/${name}`) && existsSync(`${userFolderPath}/${path}`)) {
                    await rmdirSync(`${userFolderPath}/${path}`, { recursive: true, force: true })
                    return res.redirect("/?success=FOLDER_DELETED")
                } else return res.redirect("/?error=FOLDER_DOESNT_EXIST")
            } else {
                if (existsSync(`${userFolderPath}${folder}/${name}`) && existsSync(`${userFolderPath}/${path}`)) {
                    await unlinkSync(`${userFolderPath}/${path}`)
                    return res.redirect("/?success=FILE_DELETED")
                } else return res.redirect("/?error=FILE_DOESNT_EXIST")
            }
        } else res.redirect("/?error=UNKNOWN_ERROR")
    },
    run2: async (req, res) => {
        const { emailExtractedName, folder, decoded, data, userFolderPath, folderPath } = await auth(req, res)
        if (req.params.file === "upload") {
            const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, `${userFolderPath}${folder}`);
                },
                filename: (req, file, cb) => {
                    cb(null, file.originalname);
                },
            });

            const upload = multer({ storage: storage }).array("files");

            upload(req, res, (err) => {
                // const filesExist = req.files.some((file) => {
                //     return existsSync(`${userFolderPath}${folder}/${file.originalname}`);
                // });

                // if (filesExist) {
                //     return res.status(200).json({ success: false, message: "FILE_ALREADY_EXISTS" });
                // }
                if (err) return res.status(500).json({ success: false, message: "ERROR_WHILE_UPLOADING_FILE" });

                return res.status(200).json({ success: true, message: "FILE_UPLOADED" });
            });
        } else if (req.params.file == "rename") {
            const { name, path, type, newName } = req.body;

            if (!name || !path || !type || !newName) {
                return res.status(500).json({ success: false, message: "FILE_DOESNT_EXIST" });
            }

            if (type === "folder") {
                if (existsSync(`${userFolderPath}${folder}/${name}`) && existsSync(`${userFolderPath}/${path}`)) {
                    await renameSync(`${folderPath}/${name}`, `${folderPath}/${newFileName}`);
                    return res.status(200).json({ success: true, message: "FOLDER_RENAMED" });
                } else {
                    return res.status(500).json({ success: false, message: "FOLDER_DOESNT_EXIST" });
                }
            } else {
                if (existsSync(`${userFolderPath}${folder}/${name}`) && existsSync(`${userFolderPath}/${path}`)) {
                    let newFileName = `${newName}${name.substring(name.lastIndexOf('.'))}`

                    await renameSync(`${folderPath}/${name}`, `${folderPath}/${newFileName}`);
                    return res.status(200).json({ success: true, message: "FILE_RENAMED" });
                } else {
                    return res.status(500).json({ success: false, message: "FILE_DOESNT_EXIST" });
                }
            }

        } else return res.status(500).json({ success: false, message: "UNKNOWN_ERROR" })
    },
};

async function auth(req, res) {
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
    const userFolder = readdirSync("../../.././Users/").some(
        (userFolder) => userFolder.toLowerCase() === emailExtractedName
    );

    if (!userFolder) return res.redirect("/");
    const userFolderPath = `../../.././Users/${emailExtractedName}`;
    const folderPath = `${userFolderPath}${folder}`;

    return { emailExtractedName, folder, decoded, data, userFolderPath, folderPath }
}
