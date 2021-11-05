const VenusStrategy = artifacts.require("VenusStrategy");
const assert = require('assert');

assert(process.env.VAULT_ADDRESS&&process.env.UNDERLYING_ADDRESS&&process.env.STRATEGIST_ADDRESS&&process.env.VTOKEN_ADDRESS&&process.env.VENUS_REWARD&&process.env.ROUTER_ADDRES, 'Configure addresses in the .env');

module.exports = function(deployer,network,accounts) {
  // deployment steps
  deployer.deploy(VenusStrategy,process.env.VAULT_ADDRESS,process.env.UNDERLYING_ADDRESS,process.env.STRATEGIST_ADDRESS,process.env.VTOKEN_ADDRESS,process.env.VENUS_REWARD,process.env.ROUTER_ADDRES);
};
