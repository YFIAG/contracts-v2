let ERC20Mock = artifacts.require("ERC20Mock");

module.exports = async function (deployer, network, accounts) {
    if (network == "mainnet") return;
    deployer.deploy(ERC20Mock, "RewardsToken","RT","1000000000000000000000000");
};