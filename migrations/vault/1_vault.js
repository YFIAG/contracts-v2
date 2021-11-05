let Vault = artifacts.require("yVault");
const assert = require('assert');

assert(process.env.TOKEN_ADDRESS && process.env.CONTROLLER_ADDRESS, 'Configure token and governance addresses in the options');

module.exports = async function(deployer) {
  deployer.deploy(Vault, process.env.TOKEN_ADDRESS, process.env.CONTROLLER_ADDRESS);
};