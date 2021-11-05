let YTestStrategy = artifacts.require("YTestStrategy");
let ERC20 = artifacts.require("ERC20Mock");
let Controller = artifacts.require("Controller");
let Vault = artifacts.require("yVault");

module.exports = async function (deployer) {
    deployer.deploy(YTestStrategy, ERC20.address,Controller.address,Vault.address, "TestStrategy1");
};
