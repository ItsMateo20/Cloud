const User = require("../models/User.js")
const jwt = require("jsonwebtoken");

module.exports = {
    name: "404",
    url: "/404",
    run: async (req, res) => {
        // delete require.cache[require.resolve("../pages/404.ejs")]

        // if (!req.cookies.token) return res.redirect("/login")
        // let decoded
        // try {
        //     decoded = jwt.verify(req.cookies.token, process.env.JWTSECRET)
        // } catch (e) { }
        // if (!decoded) return res.redirect("/login")

        // let data = await User.findOne({ where: { email: decoded.email, password: decoded.password } })
        // if (!data) return res.redirect("/login")
        // let args = {
        //     body: [`404 Strona nie znaleziona | Chmura`],
        //     email: data.email,

        //     loggedIn: true,
        // }

        // res.render("../pages/404.ejs", args)
        res.redirect('/')
    }
}