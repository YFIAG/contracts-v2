let Governance = artifacts.require("Governance");
let TokenYFIAG = artifacts.require("TestTokenYFIAG");
let ERC20Mock = artifacts.require("ERC20Mock");
const fs = require("fs");
require('dotenv').config();

module.exports = async function (deployer, network, accounts) {
    const yfiagAddress = (await TokenYFIAG.deployed()).address;
    const feeAddress = require("./temp.json").feeToken;
    const rewardsAddress = (await ERC20Mock.deployed()).address;
    await deployer.deploy(Governance, yfiagAddress, feeAddress, rewardsAddress, process.env.ADMIN_ADDRESS);
};