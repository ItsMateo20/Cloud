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
        const isDev = process.argv.includes('--dev');
        if (isDev) console.log(gray('[SITE]: ') + cyan('Synchronizing models...'));
        await sequelize.sync({ alter: true });
        if (isDev) console.log(gray('[SITE]: ') + cyan('Database synchronized successfully!'));

        await User.sync({ alter: true });
        if (isDev) console.log(gray('[SITE]: ') + cyan('User model synchronized successfully!'));

        await UserSettings.sync({ alter: true });
        if (isDev) console.log(gray('[SITE]: ') + cyan('UserSettings model synchronized successfully!'));

        await Whitelisted.sync({ alter: true });
        if (isDev) console.log(gray('[SITE]: ') + cyan('Whitelisted model synchronized successfully!'));

        console.log(gray('[SITE]: ') + cyan('All models synchronized successfully!\n') + gray('[SITE]: ') + cyan('Database ready!\n') + gray('<------------------------------------------------------>'));
    } catch (error) {
        console.error(gray('[SITE]: ') + red('Error synchronizing models:'), error);
        console.log(gray('[SITE]: ') + cyan('Trying automatic fixes...'));
        require('./src/debug.js')
    }
}

module.exports = {
    name: 'database',
    description: 'Database',
    async execute() {
        const sequelize = await connectDatabase();

        await synchronizeModels(sequelize);

        setTimeout(async () => {
            const adminFind = await User.findOne({ where: { email: 'admin@localhost' } })
            if (!adminFind) {
                await User.create({
                    email: 'admin@localhost',
                    password: 'admin',
                    admin: true,
                    token: 'admin',
                })
                await UserSettings.create({ email: 'admin@localhost' })
                await Whitelisted.create({ email: 'admin@localhost' })
            }
        }, 5000);
    }
}