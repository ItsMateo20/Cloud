const User = require("../models/User.js")
const jwt = require("jsonwebtoken");

module.exports = {
    name: "register",
    url: "/register",
    run: async (req, res) => {
        res.redirect("/signup")
    }
}