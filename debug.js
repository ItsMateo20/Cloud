
const { gray, cyan, red } = require("chalk");
console.log(gray("[SITE]: ") + cyan("Starting debug script..."));

const User = require('./src/models/User.js');
const UserSettings = require('./src/models/UserSettings.js');
const Whitelisted = require("./src/models/Whitelisted.js");

console.log(gray("[SITE]: ") + cyan("Resetting admin account..."));
RemoveMainAdminAccounts();
console.log(gray("[SITE]: ") + cyan("Admin account reset!"));

console.log(gray("[SITE]: ") + cyan("Debug script finished! Starting main server...\n") + gray("<------------------------------------------------------>"));
require("./index.js");


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