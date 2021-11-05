const bscMockERC20 = artifacts.require("erc20_BSC_Mock");
const bscBridge = artifacts.require("BscBridge");
const ECDSA = artifacts.require("ECDSA");

module.exports = async function (deployer, network) {
    if (network == 'bscTestnet')
    {
        let bscMock_address, bscBridge_address;
        // Deploy and link library
        await deployer.deploy(ECDSA);
        await deployer.link(ECDSA, [bscBridge]);
        // Deploy Mock
        await deployer.deploy(bscMockERC20).then(
            () => bscMock_address = bscMockERC20.address
        );
        // Deploy Bridge
        await deployer.deploy(bscBridge, bscMock_address).then(
            () => bscBridge_address = bscBridge.address
        );
        // Logging addresses
        console.log("BSC ERC20Mock: ", bscMock_address);
        console.log("BscBridge: ", bscBridge_address);
    }
}