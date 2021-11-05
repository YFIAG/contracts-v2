const CRVStrategyYCRV = artifacts.require("CRVStrategyYCRV");
const assert = require('assert');

assert(process.env.VAULT_ADDRESS&&process.env.UNDERLYING_ADDRESS&&process.env.STRATEGIST_ADDRESS&&process.env.POOL_ADDRESS&&process.env.CURVE_DEPOSIT_ADDRESS&&process.env.DAI_ADDRESS&&process.env.UNISWAP_ADDRESS, 'Configure addresses in the .env');

module.exports = function(deployer,network,accounts) {
  // deployment steps
  deployer.deploy(CRVStrategyYCRV,process.env.VAULT_ADDRESS,process.env.UNDERLYING_ADDRESS,process.env.STRATEGIST_ADDRESS,process.env.POOL_ADDRESS,process.env.CURVE_DEPOSIT_ADDRESS,process.env.DAI_ADDRESS,process.env.UNISWAP_ADDRESS);
};
