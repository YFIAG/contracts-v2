const utils = require("web3-utils");
const path = require('path');
const fs = require('fs');

function getConfig() {
    let config = require("./config.json");
    if (config.path) {
        config = JSON.parse(fs.readFileSync(config.path));
    }
    return config;
}
exports.getConfig = getConfig;

function coerceAddress(arg) {
    if (utils.isAddress(arg))
        return arg;

    else
        throw new Error(`Invalid address - ${arg}`.bgRed);
}
exports.coerceAddress = coerceAddress;

function coercePath(arg) {
    return path.resolve(process.cwd(), arg);
}
exports.coercePath = coercePath;