require('dotenv').config();
let fs = require("fs");
let path = require("path");
let Vault = artifacts.require("yVault");
let ERC20 = artifacts.require("ERC20Mock");
let Controller = artifacts.require("Controller");
let YTestStrategy = artifacts.require("YTestStrategy");

module.exports = async function (deployer) {
    let token = await ERC20.deployed();
    let controller = await Controller.deployed();
    let vault = await Vault.deployed();
    await token.mint(process.env.ADMIN_ADDRESS, "1000000000000000000000");
    await vault.setGovernance(process.env.ADMIN_ADDRESS);
    await controller.setVault(ERC20.address, Vault.address);
    await controller.approveStrategy(Vault.address, YTestStrategy.address);
    await controller.setStrategy(Vault.address, YTestStrategy.address);
    let addresses = {
        controller: controller.address,
        vault1: vault.address,
        token1: token.address,
        strategy1: YTestStrategy.address
    };
    fs.writeFileSync(path.join(__dirname,"addresses.tmp.json"),JSON.stringify(addresses));
};