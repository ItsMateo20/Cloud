const User = require("../models/User.js")
const jwt = require("jsonwebtoken");

module.exports = {
    name: "signup",
    url: "/signup",
    run: async (req, res) => {
        delete require.cache[require.resolve("../pages/signup.ejs")]

        let decoded
        let data
        if (req.cookies.token) {
            try {
                decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
            } catch (e) { }
            if (decoded) {
                data = await User.findOne({ where: { email: decoded.email, password: decoded.password } })
                if (!data) return res.redirect("/login?redirect=" + req.originalUrl)
            }
            if (decoded && data) return res.redirect("/")
        }


        let args = {
            body: ["Signup | Chmura"],
            email: "",

            loggedIn: false,
        }

        res.render("../pages/signup.ejs", args)
    },
    run2: async (req, res) => {
        const { email, password1, password2 } = req.body;

        if (!email || !password1 || !password2) return res.redirect("/signup?error=MISSING_DATA_SIGNUP")
        if (password1 !== password2) return res.redirect("/signup?error=PASSWORD_NOT_MATCH_SIGNUP")

        try {
            const UserS = await User.create({ email: email, password: password1 });
            UserS.token = jwt.sign({ email: email, password: password1 }, process.env.JWTSECRET);
            await UserS.save();


            res.cookie("token", UserS.token, { maxAge: 86400000 });
            res.redirect("/login");
        } catch (error) {
            if (error.name === "SequelizeUniqueConstraintError") {
                res.redirect("/signup?error=ACCOUNT_ALREADY_EXISTS_SIGNUP");
            } else {
                console.error(error);
                res.redirect("/signup?error=UNKNOWN_ERROR");
            }
        }
    }
}