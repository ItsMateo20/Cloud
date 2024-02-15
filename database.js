const { gray, cyan, red } = require('chalk');
const Sequelize = require('sequelize');
const User = require('./src/models/User.js');
const UserSettings = require('./src/models/UserSettings.js');
const Whitelisted = require('./src/models/Whitelisted.js');

async function connectDatabase() {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        logging: false,
        storage: './database.sqlite',
    });

    try {
        await sequelize.authenticate();
        console.log(gray('[DATABASE]: ') + cyan('Database connected!'));
        return sequelize;
    } catch (error) {
        console.error(gray('[DATABASE]: ') + red('Database connection error:'), error);
        throw error;
    }
}

async function synchronizeModels(sequelize) {
    const isDev = process.argv.includes('--dev');
    if (isDev) console.log(gray('[DATABASE]: ') + cyan('Synchronizing models...'));
    try {
        await sequelize.sync({ alter: true });

        await User.sync({ alter: true });
        if (isDev) console.log(gray('[DATABASE]: ') + cyan('User model synchronized successfully!'));

        await UserSettings.sync({ alter: true });
        if (isDev) console.log(gray('[DATABASE]: ') + cyan('UserSettings model synchronized successfully!'));

        await Whitelisted.sync({ alter: true });
        if (isDev) console.log(gray('[DATABASE]: ') + cyan('Whitelisted model synchronized successfully!'));

        console.log(gray('[DATABASE]: ') + cyan('All models synchronized successfully!\n') + gray('[DATABASE]: ') + cyan('Database ready!\n') + gray('<------------------------------------------------------>'));
    } catch (error) {
        console.error(gray('[DATABASE]: ') + red('Error synchronizing models:'), error);
        console.log(gray('[DATABASE]: ') + cyan('Trying automatic repairs...'));
        const modelsToSync = [User, UserSettings, Whitelisted];

        for (const model of modelsToSync) {
            await synchronizeModelWithRetry(sequelize, model);
        }
        require('./src/debug.js')();
    }
}

async function synchronizeModelWithRetry(sequelize, model) {
    const isDev = process.argv.includes('--dev');
    const backupTableName = `${model.getTableName()}_backup`;
    const backupTableExists = await sequelize.getQueryInterface().showAllTables().then(tables => tables.includes(backupTableName));
    const maxRetries = 3;
    let retries = 0;

    if (backupTableExists) {
        while (retries < maxRetries) {
            try {
                // Fetch data from both the original and backup tables
                const [originalData, backupData] = await Promise.all([
                    model.findAll(),
                    sequelize.query(`SELECT * FROM ${backupTableName};`, { type: sequelize.QueryTypes.SELECT })
                ]);

                // Migrate data from the backup table to the original table
                for (const backupRecord of backupData) {
                    const existingRecord = originalData.find(record => record.username === backupRecord.username);

                    if (existingRecord) {
                        // If the record exists in the original table, update it if necessary
                        if (existingRecord.updatedAt < backupRecord.updatedAt) {
                            await existingRecord.update(backupRecord);
                        }
                    } else {
                        // If the record does not exist in the original table, create it
                        await model.create(backupRecord);
                    }
                }

                // Drop the backup table after synchronization
                await sequelize.getQueryInterface().dropTable(backupTableName);

                if (isDev) console.log(gray('[DATABASE]: ') + cyan(`${model.name} model synchronized successfully!`));
                return;
            } catch (error) {
                console.error(gray('[DATABASE]: ') + red(`Error synchronizing ${model.name} model:`), error);
                retries++;
                if (retries < maxRetries) {
                    console.log(gray('[DATABASE]: ') + cyan(`Retrying synchronization of ${model.name} model (Retry ${retries}/${maxRetries})...`));
                } else {
                    throw error;
                }
            }
        }
    }
}


async function areTablesEqual(model, sequelize) {
    const [originalData, backupData] = await Promise.all([
        model.findAll(),
        sequelize.query(`SELECT * FROM ${model.getTableName()}_backup;`, { type: sequelize.QueryTypes.SELECT })
    ]);

    return JSON.stringify(originalData) === JSON.stringify(backupData);
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
                await (UserSettings.findOne({ where: { email: 'admin@localhost' } }) ? UserSettings.create({ email: 'admin@localhost' }) : "")
                await (Whitelisted.findOne({ where: { email: 'admin@localhost' } }) ? Whitelisted.create({ email: 'admin@localhost' }) : "")
            }
        }, 5000);
    }
}
