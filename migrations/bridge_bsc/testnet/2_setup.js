const BSCMockERC20 = artifacts.require("erc20_BSC_Mock");
const BSCBridge = artifacts.require("BscBridge");

module.exports = async function(deployer, network,accounts) {
    if (network == 'bscTestnet')
    {
        // Set bridge inside bsc mock
        const bscERC20 = await BSCMockERC20.deployed();
        await bscERC20.setBridge(BSCBridge.address);
        await bscERC20.mint(accounts[0], web3.utils.toWei("1000000"));
        console.log("Bridge address set!");
    }
}