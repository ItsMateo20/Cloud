const { gray, cyan, red } = require("chalk");
const User = require('./models/User.js');
const UserSettings = require('./models/UserSettings.js');
const Whitelisted = require("./models/Whitelisted.js");

async function RemoveMainAdminAccounts() {
    const UserS = await User.findOne({ where: { email: 'admin@localhost' } });
    const UserSettingsS = await UserSettings.findOne({ where: { email: 'admin@localhost' } });
    const WhitelistedS = await Whitelisted.findOne({ where: { email: 'admin@localhost' } });
    if (UserS) await UserS.destroy();
    if (UserSettingsS) await UserSettingsS.destroy();
    if (WhitelistedS) await WhitelistedS.destroy();
    if (await User.findOne({ where: { email: 'admin@localhost' } })) return RemoveMainAdminAccounts();
    if (await UserSettings.findOne({ where: { email: 'admin@localhost' } })) return RemoveMainAdminAccounts();
    if (await Whitelisted.findOne({ where: { email: 'admin@localhost' } })) return RemoveMainAdminAccounts();
    return;
}

async function debug() {
    console.log(gray("[SITE]: ") + cyan("Starting debug script...\n"));
    console.log(gray("[SITE]: ") + cyan("Removing admin account..."));
    await RemoveMainAdminAccounts();
    console.log(gray("[SITE]: ") + cyan("Admin account removed!\n"));

    console.log(gray("[SITE]: ") + cyan("Creating admin account..."));
    const UserS = await User.create({
        email: 'admin@localhost',
        password: 'admin',
        admin: true,
        token: 'admin',
    })
    await UserS.save()
    const UserSettingsS = await UserSettings.create({ email: 'admin@localhost' })
    await UserSettingsS.save()
    const WhitelistedsS = await Whitelisted.create({ email: 'admin@localhost' })
    await WhitelistedsS.save()
    console.log(gray("[SITE]: ") + cyan("Admin account created!\n"));

    console.log(gray("[SITE]: ") + cyan("Syncing models..."));
    const Sequelize = require("sequelize");
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        logging: false,
        storage: '../database.sqlite',
    });
    sequelize.sync({ alter: true });
    User.sync({ alter: true });
    UserSettings.sync({ alter: true });
    Whitelisted.sync({ alter: true });
    console.log(gray("[SITE]: ") + cyan("Models synced!"));

    console.log(gray("[SITE]: ") + cyan("Debug script finished!\n") + gray("<------------------------------------------------------>"));
}

module.exports = debug;

