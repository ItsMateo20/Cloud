const { gray, cyan, red } = require('chalk');
const Sequelize = require('sequelize');
const User = require('./src/models/User.js');
const UserSettings = require('./src/models/UserSettings.js');
const Whitelisted = require('./src/models/Whitelisted.js');

async function connectDatabase() {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        logging: false,
        storage: 'database.sqlite',
    });

    try {
        await sequelize.authenticate();
        console.log(gray('[SITE]: ') + cyan('Database connected!'));
        return sequelize;
    } catch (error) {
        console.error(gray('[SITE]: ') + red('Database connection error:'), error);
        throw error;
    }
}

async function synchronizeModels(sequelize) {
    try {
        await User.sync({ alter: true });
        console.log(gray('[SITE]: ') + cyan('User model synchronized successfully!'));

        await UserSettings.sync({ alter: true });
        console.log(gray('[SITE]: ') + cyan('UserSettings model synchronized successfully!'));

        await Whitelisted.sync({ alter: true });
        console.log(gray('[SITE]: ') + cyan('Whitelisted model synchronized successfully!'));
    } catch (error) {
        console.error(gray('[SITE]: ') + red('Error synchronizing models:'), error);
        throw error;
    }
}

module.exports = {
    name: 'database',
    description: 'Database',
    async execute() {
        const sequelize = await connectDatabase();
        await synchronizeModels(sequelize);

        const adminFind = await User.findOne({ where: { email: 'admin@localhost' } })
        if (!adminFind) {
            await User.create({
                email: 'admin@localhost',
                password: 'admin',
                admin: true,
                token: 'admin',
            })
            await UserSettings.create({ email: 'admin@localhost' })
        }
    }
}