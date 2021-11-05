const ethBridge = artifacts.require("EthBridge");
const ECDSA = artifacts.require("ECDSA");
const assert = require('assert');

assert( process.env.YFIAG_ADDRESS, 'Configure YFIAG_ADDRESS in the options');

module.exports = async function (deployer, network) {

    let ethBridge_address;
    // Deploy and link library
    await deployer.deploy(ECDSA);
    await deployer.link(ECDSA, [ethBridge]);
    // Deploy Bridge
    await deployer.deploy(ethBridge, process.env.YFIAG_ADDRESS).then(
        () => ethBridge_address = ethBridge.address
    );
    // Logging addresses
    console.log("EthBridge: ", ethBridge_address);
}