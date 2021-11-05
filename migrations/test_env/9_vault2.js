let Vault = artifacts.require("yVault");
let ERC20 = artifacts.require("ERC20Mock");
let Controller = artifacts.require("Controller");

module.exports = async function(deployer) {
  deployer.deploy(Vault, ERC20.address, Controller.address);
};
