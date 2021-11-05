const {
    constants,
    expectEvent,
    expectRevert,
    balance,
    time,
    ether
} = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const fromWei = web3.utils.fromWei;
const duration = time.duration;
const BN = web3.utils.BN;
const zero = new BN('0');
/* Chai */
const chai = require('chai');
chai.use(require('chai-bn')(BN));
const should = require('chai').should();
/* Artifacts imports */
const Controller = artifacts.require('Controller');
const yVault = artifacts.require('yVault');
const CRVStrategyStable = artifacts.require('CRVStrategyStable');
// Interfaces for mainnet
const IYERC20 = artifacts.require('IYERC20');
const IYToken = artifacts.require('IYToken');
const IERC20 = artifacts.require('IERC20');
const ICurve_SwapY = artifacts.require('ICurveFi_SwapY');
const IRouter = artifacts.require('IUniswapV2Router02');
const CurveFi_Deposit = artifacts.require('ICurveFi_DepositY');
// Mainnet addresses
const curveLpTokenAddr = '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8';
const swapAddr = '0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51';
const uniswapAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const daiAddr = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const wethAddr = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const curveDepositAddr = '0xbBC81d23Ea2c3ec7e56D39296F0cbB648873a5d3';
const yycrvAddr = '0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c';
const yDaiAddr = '0x9D25057e62939D3408406975aD75Ffe834DA4cDd';

// Constants
const min = 9500;
const max = 10000;

const getTimestamp = async() => {
    let blocknum = await web3.eth.getBlockNumber();
    let block = await web3.eth.getBlock(blocknum);
    let time = block.timestamp;
    return time;
}

describe('Fork test CRVStable Strategy', () => {
    let strategy, vault, controller;
    let uniswap, dai, yDAI, curveDeposit, curveSwap, yycrv, lpToken;
    let governance, strategist, user1, user2, rewards;
    let balance;

    before(async() => {
        [
            governance, strategist, user1, user2, rewards
        ] = await web3.eth.getAccounts();

        controller = await Controller.new(rewards);
        uniswap = await IRouter.at(uniswapAddr);
        dai = await IERC20.at(daiAddr);
        lpToken = await IYToken.at(curveLpTokenAddr);
        curveDeposit = await CurveFi_Deposit.at(curveDepositAddr);
        curveSwap = await ICurve_SwapY.at(swapAddr);
        yycrv = await IYToken.at(yycrvAddr);
        yDAI = await IYERC20.at(yDaiAddr);
        vault = await yVault.new(dai.address, controller.address);
        strategy = await CRVStrategyStable.new(vault.address, dai.address, strategist, curveDeposit.address, curveSwap.address, lpToken.address, yycrv.address, yDAI.address, 0);

        await controller.approveStrategy(vault.address, strategy.address);
        await controller.setStrategy(vault.address, strategy.address);
        await controller.setVault(lpToken.address, vault.address);

        const timestamp = await getTimestamp();
        const amount = await web3.utils.toWei('100', 'ether');
        await uniswap.swapExactETHForTokens(0, [wethAddr, daiAddr], user1, timestamp + 100,
                                    {from: user1, value: amount});
    });

    it('Should deposit DAI to vault, from vault to strategy, from strategy to yycrv', async() => {
        balance = await dai.balanceOf(user1);
        console.log('DAI token balance: ', balance.toString());
        await dai.approve(vault.address, balance, {from: user1});
        await vault.deposit(balance, {from: user1});

        expect((await dai.balanceOf(vault.address)).toString()).to.equal(balance.toString());
        expect((await vault.balanceOf(user1)).toString()).to.not.equal('0');

        // send dai to strategy
        await vault.earn();

        let available = BigInt(balance.toString()) * BigInt(min) / BigInt(max);

        expect((BigInt(balance.toString()) - available).toString())
            .to.equal((await dai.balanceOf(vault.address)).toString());

        let yycrvSharesAmount = await yycrv.balanceOf(strategy.address);
        console.log('yycrv shares balance: ', yycrvSharesAmount.toString());
        expect(yycrvSharesAmount.toString()).to.not.equal('0');
    });

    it.skip('Should execute Strategy.earn correctly', async() => {
        await strategy.setLiquidationAllowed(true, {from: strategist});
        for(let i = 0; i < 100; i++) {
            await time.advanceBlock();
        }

        await time.increase(duration.weeks(12));
    })

    it('Should withdraw part and than withdraw all', async() => {
        await strategy.setHarvestOnWithdraw(true, {from: strategist});
        let amountWithdraw = BigInt('1000000000000000000');
        let shareBeforeWithdraw = await vault.balanceOf(user1);
        console.log('share before: ', shareBeforeWithdraw.toString());
        await vault.methods['withdraw(uint256)'](amountWithdraw, {from: user1});

        let shareAfterWithdraw = await vault.balanceOf(user1);
        console.log('share after: ', shareAfterWithdraw.toString());
        expect(shareBeforeWithdraw - shareAfterWithdraw)
            .to.be.greaterThan(0);
        
        let balanceAfterWithdraw = BigInt((await dai.balanceOf(user1)).toString());
        console.log('User1 bal after withdraw: ', balanceAfterWithdraw.toString());
        expect(balanceAfterWithdraw.toString()).to.not.equal('0');

        await strategy.withdrawAll({from: strategist});

        expect((await yycrv.balanceOf(strategy.address)).toString()).to.equal('0');

        let balanceAfterWithdrawAll = BigInt((await dai.balanceOf(vault.address)).toString());
        console.log('Vault bal after withdrawAll: ', balanceAfterWithdrawAll.toString());
        expect(balanceAfterWithdrawAll.toString())
            .to.not.equal('0');
    });
});