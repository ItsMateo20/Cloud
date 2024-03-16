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
    sortingBy: {
        type: Sequelize.STRING,
        defaultValue: 'name',
    },
    sortingDirection: {
        type: Sequelize.STRING,
        defaultValue: 'asc',
    },
    showImage: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    newWindowFileOpen: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    adminMode: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = UserSettings;