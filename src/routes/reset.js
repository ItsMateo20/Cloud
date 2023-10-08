module.exports = {
    name: "reset",
    url: "/reset",
    run: async (req, res) => {
        res.clearCookie("folder")
        res.redirect("/")
    }
}