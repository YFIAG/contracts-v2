let TokenYFIAG = artifacts.require("TestTokenYFIAG");
require('dotenv').config();

module.exports = async function (deployer, network, accounts) {
    if (network == "mainnet") return;
    deployer.deploy(TokenYFIAG,process.env.ADMIN_ADDRESS);
};