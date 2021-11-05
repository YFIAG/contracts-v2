require('dotenv').config();

let Controller = artifacts.require("Controller");

module.exports = function (deployer, network, accounts) {
  // deployment steps
  deployer.deploy(Controller,process.env.ADMIN_ADDRESS);
};
