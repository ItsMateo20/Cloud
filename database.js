const { gray, cyan, red } = require('chalk');
const Sequelize = require('sequelize');
const User = require('./src/models/User.js');
const UserSettings = require('./src/models/UserSettings.js');

module.exports = {
    name: 'database',
    description: 'Database',
    async execute() {


        const sequelize = new Sequelize({
            dialect: 'sqlite',
            logging: false,
            storage: 'database.sqlite',
        });

        await User.sync({
            alter: true
        })

        await UserSettings.sync({
            alter: true
        })

        await sequelize.authenticate()
            .then(() => {
                console.log(gray('[SITE]: ') + cyan('Database connected!'));
            })
            .catch((error) => {
                console.error(gray('[SITE]: ') + red('Database was unable to connect doe to an error:'), error);
            });
    }
}