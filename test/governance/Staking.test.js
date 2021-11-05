const {
    constants,
    expectEvent,
    expectRevert,
    balance,
    time,
    ether
} = require('@openzeppelin/test-helpers');
const fromWei = web3.utils.fromWei;
const duration = time.duration;
const BN = web3.utils.BN;
const { logBN } = require("../../utils/test");
const zero = new BN('0');
/* Chai */
const chai = require('chai');
chai.use(require('chai-bn')(BN));
const should = require('chai').should();
/* Artifacts imports */
const TokenYFIAG = artifacts.require("TestTokenYFIAG");
const Governance = artifacts.require("Governance");
const ERC20Mock = artifacts.require('ERC20Mock');

contract('DAO staking test', accounts => {
    let stakingToken;
    let feesToken;
    let rewardsToken;
    let DAO;
    let [sender, governance, thirdParty] = accounts;
    let cid = "QmcionDQ75NpSR2j7fCGKGd4q8Fn3wwP1rmfjBVWrVb5Ar";

    beforeEach(async () => {
        await deployDAO();
    });

    it(`User can stake staking tokens if he has enough tokens and he approved tokens`, async () => {
        // check staking token
        (await DAO.getStakingToken()).should.equal(stakingToken.address);

        const balanceBefore = await stakingToken.balanceOf(sender);
        const totalSupplyBefore = await DAO.totalSupply();
        const votingPowerBefore = await DAO.balanceOf(sender);

        const stakeAmount = ether("0.5");
        await stakingToken.approve(DAO.address, stakeAmount);
        await DAO.stake(stakeAmount);

        const totalSupplyAfter = await DAO.totalSupply();
        const balanceAfter = await stakingToken.balanceOf(sender);
        const votingPowerAfter = await DAO.balanceOf(sender);

        totalSupplyBefore.should.bignumber.equal(zero);
        totalSupplyAfter.should.bignumber.equal(stakeAmount);
        balanceAfter.should.bignumber.equal(balanceBefore.sub(stakeAmount));
        votingPowerBefore.should.bignumber.equal(zero);
        votingPowerAfter.should.bignumber.equal(stakeAmount);
    });

    it(`User can't stake zero staking tokens`, async () => {
        const balanceBefore = await stakingToken.balanceOf(sender);
        const totalSupplyBefore = await DAO.totalSupply();
        const votingPowerBefore = await DAO.balanceOf(sender);

        const stakeAmount = ether("0.5");
        await stakingToken.approve(DAO.address, stakeAmount);
        await expectRevert(DAO.stake(zero),"Cannot stake 0");

        const totalSupplyAfter = await DAO.totalSupply();
        const balanceAfter = await stakingToken.balanceOf(sender);
        const votingPowerAfter = await DAO.balanceOf(sender);

        totalSupplyBefore.should.bignumber.equal(zero);
        totalSupplyAfter.should.bignumber.equal(zero);
        balanceAfter.should.bignumber.equal(balanceBefore);
        votingPowerBefore.should.bignumber.equal(zero);
        votingPowerAfter.should.bignumber.equal(zero);
    });

    it(`User can't stake staking tokens if he hasn't enough tokens`, async () => {
        await stakingToken.transfer(thirdParty, 1);
        const balanceBefore = await stakingToken.balanceOf(thirdParty);
        const totalSupplyBefore = await DAO.totalSupply();
        const stakeAmount = 1;

        await stakingToken.approve(DAO.address, stakeAmount);
        await expectRevert(DAO.stake(stakeAmount+1),"ERC20: transfer amount exceeds allowance");

        const totalSupplyAfter = await DAO.totalSupply();
        const balanceAfter = await stakingToken.balanceOf(thirdParty);
        const votingPower = await DAO.balanceOf(thirdParty);

        totalSupplyBefore.should.bignumber.equal(zero);
        totalSupplyAfter.should.bignumber.equal(zero);
        balanceAfter.should.bignumber.equal(balanceBefore);
        votingPower.should.bignumber.equal(zero);
    });

    it(`User can withdraw if he has enough voting power`, async ()=>{
        const stakeAmount = ether("0.5");
        await stakingToken.approve(DAO.address, stakeAmount);
        await DAO.stake(stakeAmount);

        const balanceBefore = await stakingToken.balanceOf(sender);
        const totalSupplyBefore = await DAO.totalSupply();
        const votingPowerBefore = await DAO.balanceOf(sender);

        await DAO.withdraw(stakeAmount);

        const totalSupplyAfter = await DAO.totalSupply();
        const balanceAfter = await stakingToken.balanceOf(sender);
        const votingPowerAfter = await DAO.balanceOf(sender);

        totalSupplyBefore.should.bignumber.equal(stakeAmount);
        totalSupplyAfter.should.bignumber.equal(zero);
        balanceAfter.should.bignumber.equal(balanceBefore.add(stakeAmount));
        votingPowerBefore.should.bignumber.equal(stakeAmount);
        votingPowerAfter.should.bignumber.equal(zero);
    });

    it(`User can't withdraw if he hasn't enough voting power`, async ()=>{
        const stakeAmount = ether("0.5");

        const balanceBefore = await stakingToken.balanceOf(sender);
        const totalSupplyBefore = await DAO.totalSupply();
        const votingPowerBefore = await DAO.balanceOf(sender);

        await expectRevert(DAO.withdraw(stakeAmount),"SafeMath: subtraction overflow");

        const totalSupplyAfter = await DAO.totalSupply();
        const balanceAfter = await stakingToken.balanceOf(sender);
        const votingPowerAfter = await DAO.balanceOf(sender);

        totalSupplyBefore.should.bignumber.equal(zero);
        totalSupplyAfter.should.bignumber.equal(zero);
        balanceAfter.should.bignumber.equal(balanceBefore);
        votingPowerBefore.should.bignumber.equal(zero);
        votingPowerAfter.should.bignumber.equal(zero);
    });

    it(`User can't withdraw zero`, async ()=>{
        const stakeAmount = ether("0.5");
        await stakingToken.approve(DAO.address, stakeAmount);
        await DAO.stake(stakeAmount);

        const balanceBefore = await stakingToken.balanceOf(sender);
        const totalSupplyBefore = await DAO.totalSupply();
        const votingPowerBefore = await DAO.balanceOf(sender);

        await expectRevert( DAO.withdraw(zero), "Cannot withdraw 0");

        const totalSupplyAfter = await DAO.totalSupply();
        const balanceAfter = await stakingToken.balanceOf(sender);
        const votingPowerAfter = await DAO.balanceOf(sender);

        totalSupplyBefore.should.bignumber.equal(stakeAmount);
        totalSupplyAfter.should.bignumber.equal(stakeAmount);
        balanceAfter.should.bignumber.equal(balanceBefore);
        votingPowerBefore.should.bignumber.equal(stakeAmount);
        votingPowerAfter.should.bignumber.equal(stakeAmount);
    });


    it(`User can't withdraw locked (in voting) funds`, async () => {
        const minimum = await DAO.getMinimum();
        const stakeAmount = minimum;
        await stakingToken.approve(DAO.address, stakeAmount);
        await DAO.stake(stakeAmount);
        await DAO.propose(cid);

        const balanceBefore = await stakingToken.balanceOf(sender);
        const totalSupplyBefore = await DAO.totalSupply();
        const votingPowerBefore = await DAO.balanceOf(sender);

        await expectRevert( DAO.withdraw(stakeAmount), "!locked");

        const totalSupplyAfter = await DAO.totalSupply();
        const balanceAfter = await stakingToken.balanceOf(sender);
        const votingPowerAfter = await DAO.balanceOf(sender);

        totalSupplyBefore.should.bignumber.equal(stakeAmount);
        totalSupplyAfter.should.bignumber.equal(stakeAmount);
        balanceAfter.should.bignumber.equal(balanceBefore);
        votingPowerBefore.should.bignumber.equal(stakeAmount);
        votingPowerAfter.should.bignumber.equal(stakeAmount);
    });



    async function deployDAO() {
        stakingToken = await TokenYFIAG.new(sender);
        feesToken = await ERC20Mock.new("FeesToken", "FT", ether("1000000"));
        rewardsToken = await ERC20Mock.new("RewardsToken", "RT", ether("1000000"));
        DAO = await Governance.new(stakingToken.address, feesToken.address, rewardsToken.address, governance);
    }

});