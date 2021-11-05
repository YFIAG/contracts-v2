const CRVStrategyStable = artifacts.require("CRVStrategyStable");
const assert = require('assert');

assert(process.env.VAULT_ADDRESS&&process.env.UNDERLYING_ADDRESS&&process.env.STRATEGIST_ADDRESS&&process.env.CURVE_ADDRESS&&process.env.SWAP_ADDRESS&&process.env.YCRV_ADDRESS&&process.env.YYCRV_ADDRESS&&process.env.YTOKEN_ADDRESS&&process.env.TOKEN_INDEX_STABLE, 'Configure addresses in the .env');

module.exports = function(deployer,network,accounts) {
  // deployment steps
  deployer.deploy(CRVStrategyStable,process.env.VAULT_ADDRESS,process.env.UNDERLYING_ADDRESS,process.env.STRATEGIST_ADDRESS,process.env.CURVE_ADDRESS,process.env.SWAP_ADDRESS,process.env.YCRV_ADDRESS,process.env.YYCRV_ADDRESS,process.env.YTOKEN_ADDRESS,process.env.TOKEN_INDEX_STABLE);
};
