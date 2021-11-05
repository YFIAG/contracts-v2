let Governance = artifacts.require("Governance");
require('dotenv').config();
const assert = require('assert');

assert(process.env.YFIAG_ADDRESS, 'Configure YFIAG_ADDRESS in the options');
assert(process.env.FEE_TOKEN_ADDRESS, 'Configure FEE_TOKEN_ADDRESS in the options');
assert(process.env.FEE_TOKEN_ADDRESS, 'Configure FEE_TOKEN_ADDRESS in the options');
assert(process.env.REWARDS_ADDRESS, 'Configure REWARDS_ADDRESS in the options');
assert(process.env.GOVERNANCE_ADDRESS, 'Configure GOVERNANCE_ADDRESS in the options');

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(Governance, process.env.YFIAG_ADDRESS, process.env.FEE_TOKEN_ADDRESS, process.env.REWARDS_ADDRESS, process.env.GOVERNANCE_ADDRESS);
};