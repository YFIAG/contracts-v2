let ERC20Mock = artifacts.require("ERC20Mock");
const fs = require("fs");
const path = require("path");
module.exports = async function (deployer, network, accounts) {
    if (network == "mainnet") return;
    const address = (await ERC20Mock.deployed()).address;
    fs.writeFileSync(path.join( __dirname,"temp.json"), JSON.stringify({ feeToken: address }));
};