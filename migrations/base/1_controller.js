const Controller = artifacts.require("Controller");
const assert = require('assert');

assert(process.env.REWARDS_ADDRESS, 'Configure rewards address in the options');

module.exports = function(deployer,network,accounts) {
  // deployment steps
  deployer.deploy(Controller,process.env.REWARDS_ADDRESS);
};
