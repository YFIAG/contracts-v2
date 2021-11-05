const bscBridge = artifacts.require("BscBridge");
const ECDSA = artifacts.require("ECDSA");
const assert = require('assert');

assert(process.env.YFIAG_ADDRESS, 'Configure YFIAG_ADDRESS in the options');

module.exports = async function (deployer, network) {
    let bscBridge_address;
    // Deploy and link library
    await deployer.deploy(ECDSA);
    await deployer.link(ECDSA, [bscBridge]);
    // Deploy Bridge
    await deployer.deploy(bscBridge, process.env.YFIAG_ADDRESS).then(
        () => bscBridge_address = bscBridge.address
    );
    console.log("BscBridge: ", bscBridge_address);
}