const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

const UserSettings = sequelize.define('UserSettings', {
    email: {
        type: Sequelize.STRING,
    },
    showImage: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = UserSettings;