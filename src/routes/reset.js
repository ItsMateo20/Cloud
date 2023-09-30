const User = require("../models/User.js")

module.exports = {
    name: "reset",
    url: "/reset",
    run: async (req, res) => {
        const UserS = await User.findOne()
        await UserS.destroy()
        res.clearCookie("token")
        res.redirect("/signup")
    }
}