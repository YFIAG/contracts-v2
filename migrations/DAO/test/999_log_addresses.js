let Governance = artifacts.require("Governance");
let TokenYFIAG = artifacts.require("TestTokenYFIAG");
let ERC20Mock = artifacts.require("ERC20Mock");
const fs = require("fs");
const path = require("path");

module.exports = async function (deployer, network, accounts) {
    const yfiagAddress = (await TokenYFIAG.deployed()).address;
    const {feeToken} = require("./temp.json");
    const rewardsAddress = (await ERC20Mock.deployed()).address;
    const governanceAddress = (await Governance.deployed()).address;
    const addresses = {
        yfiagAddress,
        feeToken,
        rewardsAddress,
        governanceAddress
    }
    console.dir(addresses);
    fs.unlinkSync(path.join(__dirname, "temp.json"));
};