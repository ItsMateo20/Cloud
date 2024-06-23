const chalk = require("chalk");

module.exports = function log(message, error = false, { line = false, name = "UNDEFINED", type = "log", msgColor = "cyan" } = {}) {
    const availableColors = ["red", "green", "yellow", "blue", "cyan", "gray"];
    if (!availableColors.includes(msgColor)) {
        msgColor = "cyan";
    }

    const lineTxt = line ? chalk.gray("\n<------------------------------------------------------>") : "";
    const errorTxt = error ? chalk.red(error) : "";

    const parsedMessage = message.replace(/\{([^}]+)\}/g, (match, directive) => {
        const parts = directive.trim().split(' ');
        const color = parts[0].toLowerCase();

        if (availableColors.includes(color)) {
            const text = parts.slice(1).join(' ');
            return chalk[color](text || '');
        } else {
            return match;
        }
    });

    const nameTxt = chalk.gray(`[${name}]: `);
    const logOutput = nameTxt + chalk[msgColor](parsedMessage) + lineTxt + errorTxt;

    // Log based on type
    if (type === "error") {
        console.error(logOutput);
    } else if (type === "warn") {
        console.warn(logOutput);
    } else if (type === "info") {
        console.info(logOutput);
    } else {
        console.log(logOutput);
    }
};

// log("You are using the latest version. {gray (}{green 1.4.7}{gray )}", null, { name: 'VERSION' });
// [VERSION]: You are using the latest version. (1.4.7)

// log("This is a {yellow multi-color} {red message}", null, { line: true, name: "MultiColorLogger", type: "log" });
// [MultiColorLogger]: This is a multi-color message
// <------------------------------------------------------>

// log("This is a {blue custom color} {cyan message}", null, { name: "CustomColorLogger", type: "info" });
// [CustomColorLogger]: This is a custom color message

// log("This text should be red", null, { name: "RedTextLogger", type: "log", msgColor: "red"});
// [RedTextLogger]: This text should be red

// log("{invalidColor}This text should default to cyan", null, { name: "InvalidColorLogger", type: "log" });
// [InvalidColorLogger]: This text should default to cyan



