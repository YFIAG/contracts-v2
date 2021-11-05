const BSCYFIAG = artifacts.require("BSCYFIAG");

module.exports = function(deployer,network,accounts) {
  deployer.deploy(BSCYFIAG);
};
