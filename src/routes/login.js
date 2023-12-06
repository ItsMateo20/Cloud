const User = require("../models/User.js")
const UserSettings = require("../models/UserSettings.js")
const Whitelisted = require("../models/Whitelisted.js");
const jwt = require("jsonwebtoken");

module.exports = {
    name: "Login",
    url: "/login",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/login.ejs")]

        let decoded
        let data
        if (req.cookies.token) {
            try {
                decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
            } catch (e) { }
            if (decoded) {
                data = await User.findOne({ where: { email: decoded.email, password: decoded.password } })
                if (!data) return res.clearCookie("token").redirect("/login")
            } else {
                res.clearCookie("token").redirect("/login")
            }
            const UserSettingS = await UserSettings.findOne({ where: { email: decoded.email } })
            if (!UserSettingS) await UserSettings.create({ email: decoded.email })
            if (decoded && data) return res.redirect("/")
        }


        let args = {
            body: ["Login | Chmura"],
            email: "",

            loggedIn: false,
        }

        res.render("../pages/login.ejs", args)
    },
    run2: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) return res.redirect("/login?error=MISSING_DATA_LOGIN")
        const UserS = await User.findOne({ where: { email: email, password: password } })
        const UserSettingsS = await UserSettings.findOne({ where: { email: email } })
        const WhitelistedS = await Whitelisted.findOne({ where: { email: email } })
        if (!WhitelistedS) return res.redirect("/login?error=EMAIL_NOT_WHITELISTED")

        if (UserS) {
            UserS.token = jwt.sign({ email: UserS.email, password: UserS.password }, process.env.JWTSECRET, { algorithm: process.env.JWTALGORITHM, expiresIn: process.env.JWTEXPIRESIN })
            await UserS.save()
            if (!UserSettingsS) {
                await UserSettings.create({ email: email })
            }

            res.cookie("token", UserS.token, { maxAge: 86400000 })
            res.redirect("/")
        } else if (!UserS) {
            res.redirect("/login?error=INCORRECT_DATA_LOGIN")
        }
    }
}