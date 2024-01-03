const { gray, cyan, red } = require("chalk");
console.log(gray("[SITE]: ") + cyan("Starting debug script..."));

const User = require('./models/User.js');
const UserSettings = require('./models/UserSettings.js');
const Whitelisted = require("./models/Whitelisted.js");

console.log(gray("[SITE]: ") + cyan("Removing admin account..."));
RemoveMainAdminAccounts();
console.log(gray("[SITE]: ") + cyan("Admin account removed!\n"));

console.log(gray("[SITE]: ") + cyan("Creating admin account..."));
User.create({
    email: 'admin@localhost',
    password: 'admin',
    admin: true,
    token: 'admin',
})
UserSettings.create({ email: 'admin@localhost' })
Whitelisted.create({ email: 'admin@localhost' })
console.log(gray("[SITE]: ") + cyan("Admin account created!\n"));

console.log(gray("[SITE]: ") + cyan("Syncing models..."));
const sequelize = require("./database.js");
sequelize.sync({ alter: true });
User.sync({ alter: true });
UserSettings.sync({ alter: true });
Whitelisted.sync({ alter: true });
console.log(gray("[SITE]: ") + cyan("Models synced!"));

console.log(gray("[SITE]: ") + cyan("Debug script finished!\n") + gray("<------------------------------------------------------>"));

async function RemoveMainAdminAccounts() {
    const UserS = await User.findOne({ where: { email: 'admin@localhost' } });
    const UserSettingsS = await UserSettings.findOne({ where: { email: 'admin@localhost' } });
    const WhitelistedS = await Whitelisted.findOne({ where: { email: 'admin@localhost' } });
    if (UserS) await UserS.destroy();
    if (UserSettingsS) await UserSettingsS.destroy();
    if (WhitelistedS) await WhitelistedS.destroy();
    if (await User.findAll({ where: { email: 'admin@localhost' } })) return RemoveMainAdminAccounts();
    if (await UserSettings.findAll({ where: { email: 'admin@localhost' } })) return RemoveMainAdminAccounts();
    if (await Whitelisted.findAll({ where: { email: 'admin@localhost' } })) return RemoveMainAdminAccounts();
    return;
}