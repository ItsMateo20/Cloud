const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

const UserSettings = sequelize.define('UserSettings', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: false,
    },
    email: {
        type: Sequelize.STRING,
    },
    darkMode: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    localization: {
        type: Sequelize.STRING,
        defaultValue: 'pl_PL',
    },
    showImage: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    adminMode: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = UserSettings;