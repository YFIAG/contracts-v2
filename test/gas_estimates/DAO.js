const {
    ether,
    time
} = require('@openzeppelin/test-helpers');
const BN = web3.utils.BN;
const createGasEstimateDoc = require("../../utils/create_gas_estimate_doc");
/* Artifacts imports */
const TokenYFIAG = artifacts.require("TestTokenYFIAG");
const Governance = artifacts.require("Governance");
const ERC20Mock = artifacts.require('ERC20Mock');

contract('DAO gas estimate', accounts => {
    let stakingToken;
    let feesToken;
    let rewardsToken;
    let DAO;
    let [sender, governance, thirdParty] = accounts;
    let gas = {};
    gas.DAO = {};
    beforeEach(async () => {
        await deployDAO();
    });


    it(``, async () => {
        const stakeAmount = ether("0.5");
        await stakingToken.approve(DAO.address, stakeAmount);
        gas.DAO.stake = await DAO.stake.estimateGas(stakeAmount);
        await DAO.stake(stakeAmount);
        gas.DAO.withdraw = await DAO.withdraw.estimateGas(stakeAmount);
    });

    it(``, async () => {
        const minimum = await DAO.getMinimum();
        const stakeAmount = minimum;

        await stakingToken.approve(DAO.address, stakeAmount);
        await DAO.stake(stakeAmount);
        gas.DAO.propose = await DAO.propose.estimateGas("cid");
        await DAO.propose("cid");
        time.increase(10);

        const votingPower = new BN(ether('100'));

        await stakingToken.transfer(thirdParty, votingPower);
        await stakingToken.approve(DAO.address, votingPower, {
            from: thirdParty
        });
        await DAO.stake(votingPower, {
            from: thirdParty
        });


        gas.DAO.voteFor = await DAO.voteFor.estimateGas(0, {
            from: thirdParty
        })
    });

    it(``, async () => {
        const minimum = await DAO.getMinimum();
        const stakeAmount = minimum;

        await stakingToken.approve(DAO.address, stakeAmount);
        await DAO.stake(stakeAmount);
        await DAO.propose("cid");
        time.increase(10);

        const votingPower = new BN(ether('100'));

        await stakingToken.transfer(thirdParty, votingPower);
        await stakingToken.approve(DAO.address, votingPower, {
            from: thirdParty
        });
        await DAO.stake(votingPower, {
            from: thirdParty
        });


        gas.DAO.voteAgainst = await DAO.voteAgainst.estimateGas(0, {
            from: thirdParty
        })
    });

    it(`Write results`, async () => {
        console.dir(gas);
        createGasEstimateDoc(gas);
    });


    async function deployDAO() {
        stakingToken = await TokenYFIAG.new(sender);
        feesToken = await ERC20Mock.new("FeesToken", "FT", ether("1000000"));
        rewardsToken = await ERC20Mock.new("RewardsToken", "RT", ether("1000000"));
        DAO = await Governance.new(stakingToken.address, feesToken.address, rewardsToken.address, governance);
    }

});