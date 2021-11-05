const CompoundNoFoldStrategy = artifacts.require("CompoundNoFoldStrategy");
const assert = require('assert');

assert(process.env.VAULT_ADDRESS&&process.env.UNDERLYING_ADDRESS&&process.env.STRATEGIST_ADDRESS&&process.env.CTOKEN_ADDRESS&&process.env.UNISWAP_ADDRESS, 'Configure addresses in the .env');

module.exports = function(deployer,network,accounts) {
  // deployment steps
  deployer.deploy(CompoundNoFoldStrategy,process.env.VAULT_ADDRESS,process.env.UNDERLYING_ADDRESS,process.env.STRATEGIST_ADDRESS,process.env.CTOKEN_ADDRESS, process.env.UNISWAP_ADDRESS);
};
