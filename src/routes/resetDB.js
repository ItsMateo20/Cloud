const Sequelize = require('sequelize');
const User = require('../models/User.js');
const UserSettings = require('../models/UserSettings.js');

module.exports = {
    name: "resetDB",
    url: "/r",
    run: async (req, res) => {
        await User.destroy({ where: {} });
        await UserSettings.destroy({ where: {} });
        res.redirect("/login")
    }
}