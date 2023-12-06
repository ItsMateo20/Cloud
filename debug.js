
const { gray, cyan, red } = require("chalk");
console.log(gray("[SITE]: ") + cyan("Starting debug script..."));

const User = require('./src/models/User.js');
const UserSettings = require('./src/models/UserSettings.js');

console.log(gray("[SITE]: ") + cyan("Resetting admin account..."));
RemoveMainAdminAccounts();
console.log(gray("[SITE]: ") + cyan("Admin account reset!"));

console.log(gray("[SITE]: ") + cyan("Debug script finished! Starting main server...\n") + gray("<------------------------------------------------------>"));
require("./index.js");


async function RemoveMainAdminAccounts() {
    await User.destroy({ where: { email: 'admin@localhost' } });
    await UserSettings.destroy({ where: { email: 'admin@localhost' } });
    if (await User.findAll({ where: { email: 'admin@localhost' } })) return RemoveMainAdminAccounts();
    if (await UserSettings.findAll({ where: { email: 'admin@localhost' } })) return RemoveMainAdminAccounts();
}