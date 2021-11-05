let Vault = artifacts.require("yVault");
let Controller = artifacts.require("Controller");
const assert = require('assert');

assert(process.env.TOKEN_ADDRESS && process.env.CONTROLLER_ADDRESS, 'Configure token and governance addresses in the options');

module.exports = async function(deployer) {
    let controller = await Controller.at(process.env.CONTROLLER_ADDRESS);
    await controller.setVault(process.env.TOKEN_ADDRESS,Vault.address);
};