const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
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
const { default: BigNumber } = require('bignumber.js');
const zero = new BN('0');
/* Chai */
const chai = require('chai');
const { expect } = require('chai');
/* Artifacts imports */
const VenusStrategy = artifacts.require('VenusStrategy');
const Controller = artifacts.require('Controller');
const yVault = artifacts.require('yVault');
/* Interfaces for fork */
const IRouter = artifacts.require('IPancakeRouter');
const IERC20 = artifacts.require('IERC20');
const IComptroller = artifacts.require('IComptroller');
const IVERC20 = artifacts.require('IVERC20');
/* Mainnet addresses */
const pancakeAddr = '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F';
const btcbAddr = '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c';
const wbnbAddr = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
const rewardAddr = '0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63';
const vTokenAddr = '0x882C173bC7Ff3b7786CA16dfeD3DFFfb9Ee7847B';
const comptrollerAddr = '0xfD36E2c2a6789Db23113685031d7F16329158384';

pancakeAddr = 0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F
btcbAddr = 0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c
wbnbAddr = 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c
rewardAddr = 0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63
vTokenAddr = 0x882C173bC7Ff3b7786CA16dfeD3DFFfb9Ee7847B
comptrollerAddr = 0xfD36E2c2a6789Db23113685031d7F16329158384
/* Constants */
const min = 9500;
const max = 10000;
/* Utils */
const getTimestamp = async() => {
    let blocknum = await web3.eth.getBlockNumber();
    let block = await web3.eth.getBlock(blocknum);
    let time = block.timestamp;
    return time;
}

describe('Fork test Venus Strategy', () => {
    let strategy, vault;
    let token, vtoken, rewardToken;
    let controller, comptroller;
    let pancake;
    let governance, strategist, user1, user2, rewards;
    let balance;

    before(async() => {
        [
            governance, strategist, user1, user2, rewards
        ] = await web3.eth.getAccounts();

        controller = await Controller.new(rewards);
        pancake = await IRouter.at(pancakeAddr);
        rewardToken = await IERC20.at(rewardAddr);
        comptroller = await IComptroller.at(comptrollerAddr);
        token = await IERC20.at(btcbAddr);
        vault = await yVault.new(token.address, controller.address);
        vToken = await IVERC20.at(vTokenAddr);
        strategy = await VenusStrategy.new(vault.address, token.address, strategist, vToken.address, rewardToken.address, pancake.address);
        await controller.approveStrategy(vault.address, strategy.address);
        await controller.setStrategy(vault.address, strategy.address);
        await controller.setVault(token.address, vault.address);

        // Buy btcb to interact with
        const timestamp = await getTimestamp();
        const amount = await web3.utils.toWei('100', 'ether');
        await pancake.swapExactETHForTokens(0, [wbnbAddr, btcbAddr], user1, timestamp + 100,
                                            {from: user1, value: amount});
    });

    it("Should deposit tokens to vault, from vault to strategy, from strategy to venus", async() => {
        // Send btcb to vault
        balance = await token.balanceOf(user1);
        await token.approve(vault.address, balance, {from: user1});
        await vault.deposit(balance, {from: user1});

        expect((await token.balanceOf(vault.address)).toString()).to.equal(balance.toString());
        expect((await vault.balanceOf(user1)).toString()).to.not.equal('0');

        // Send btcb to strategy

        await vault.earn();

        const available = BigInt(balance.toString()) * BigInt(min) / BigInt(max);

        expect((await token.balanceOf(strategy.address)).toString()).to.equal('0');
        expect((BigInt(balance.toString()) - available).toString())
            .to.equal((await token.balanceOf(vault.address)).toString());

        const vTokenBalance = await vToken.balanceOf(strategy.address);
        console.log("vToken balance: ", vTokenBalance.toString());

        expect(vTokenBalance.toString()).to.not.equal('0');
    });

    it('Should execute Strategy.earn correctly', async() => {
        await strategy.setLiquidationAllowed(true, {from: strategist});
        await strategy.setHarvestOnWithdraw(true, {from: strategist});

        for(let i = 0; i < 100; i++) {
            await time.advanceBlock();
        }

        const vTokenBalBefore = BigInt((await vToken.balanceOf(strategy.address)).toString());
        await strategy.setProfitSharing(10, 100, {from: strategist});
        await strategy.earn({from: strategist});
        const vTokenBalAfter = BigInt((await vToken.balanceOf(strategy.address)).toString());

        console.log('vTokens added: ', (vTokenBalAfter - vTokenBalBefore).toString());
        expect((await token.balanceOf(controller.address)).toString()).to.not.equal('0');
        expect((await token.balanceOf(strategy.address)).toString()).to.equal('0');
        expect((vTokenBalAfter - vTokenBalBefore).toString()).to.not.equal('0');
    });

    it('Should withdraw part and than withdraw all', async() => {
        const amountWithdraw = BigInt('777');
        const shareBeforeWithdraw = await vault.balanceOf(user1);

        await vault.methods['withdraw(uint256)'](amountWithdraw, {from: user1});

        const shareAfterWithdraw = await vault.balanceOf(user1);
        expect(shareBeforeWithdraw - shareAfterWithdraw)
        .to.be.greaterThan(0);

        const balanceAfterWithdraw = await token.balanceOf(user1);
        console.log('User1 bal after withdraw: ', balanceAfterWithdraw.toString());
        expect(balanceAfterWithdraw.toString()).to.not.equal('0');

        await strategy.withdrawAll({from: strategist});

        expect((await vToken.balanceOf(strategy.address)).toString()).to.equal('0');

        const balanceAfterWithdrawAll = BigInt((await token.balanceOf(vault.address)).toString());
        console.log('Vault bal after withdrawAll: ', balanceAfterWithdrawAll.toString());

        expect(balanceAfterWithdrawAll.toString()).to.not.equal('0');
    });

    it('Should emergency withdraw all tokens', async() => {
        // Firstly, deposit some btcb
        const timestamp = await getTimestamp();
        const amount = await web3.utils.toWei('100', 'ether');
        await pancake.swapExactETHForTokens(0, [wbnbAddr, btcbAddr], user2, timestamp + 100,
                                            {from: user2, value: amount});
        balance = await token.balanceOf(user2);
        await token.approve(vault.address, balance, {from: user2});
        await vault.deposit(balance, {from: user2});
        // Send to strategy
        await vault.earn();
        await time.advanceBlock();
        // Now, emergency withdraw all
        await strategy.emergencyExit();
        const governanceBalance = await token.balanceOf(governance);

        expect((await vToken.balanceOf(strategy.address)).toString()).to.equal('0');
        expect((await token.balanceOf(strategy.address)).toString()).to.equal('0');
        expect(governanceBalance.toString()).to.not.equal('0');
    });
});