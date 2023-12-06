const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite'
});

const Whitelisted = sequelize.define('Whitelisted', {
    email: {
        type: Sequelize.STRING,
    }
});

module.exports = Whitelisted;