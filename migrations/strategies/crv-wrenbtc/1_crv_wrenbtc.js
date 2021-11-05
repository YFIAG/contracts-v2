const CRVStrategyWRenBTCMix = artifacts.require("CRVStrategyWRenBTCMix");
const assert = require('assert');

assert(process.env.VAULT_ADDRESS&&process.env.UNDERLYING_ADDRESS&&process.env.STRATEGIST_ADDRESS&&process.env.TOKEN_INDEX_WRENBTC&&process.env.CURVE_POOL_ADDRESS&&process.env.GAUGE_ADDRESS&&process.env.UNISWAP_ADDRESS&&process.env.SECOND_ASSET, 'Configure addresses in the .env');

module.exports = function(deployer,network,accounts) {
  // deployment steps
  deployer.deploy(CRVStrategyWRenBTCMix,process.env.VAULT_ADDRESS,process.env.UNDERLYING_ADDRESS,process.env.STRATEGIST_ADDRESS,process.env.TOKEN_INDEX_WRENBTC,process.env.CURVE_POOL_ADDRESS,process.env.GAUGE_ADDRESS,process.env.UNISWAP_ADDRESS,process.env.SECOND_ASSET);
};
