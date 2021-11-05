let ERC20 = artifacts.require("ERC20Mock");

module.exports = function(deployer) {
  // deployment steps
  let totalSupply = "1000000000000000";
  deployer.deploy(ERC20,"Token","TKN", totalSupply);
};
