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
const CRVStrategyYCRV = artifacts.require('CRVStrategyYCRV');
// Interfaces for mainnet
const IYERC20 = artifacts.require('IYERC20');
const IYToken = artifacts.require('IYToken');
const IERC20 = artifacts.require('IERC20');
const ICurve_SwapY = artifacts.require('ICurveFi_SwapY');
const ICurve_Gauge = artifacts.require('ICurveFi_Gauge');
const IRouter = artifacts.require('IUniswapV2Router02');
const CurveFi_Deposit = artifacts.require('ICurveFi_DepositY');
// Mainnet addresses
const curveLpTokenAddr = '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8';
const swapAddr = '0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51';
const gaugeAddr = '0xFA712EE4788C042e2B7BB55E6cb8ec569C4530c1';
const uniswapAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const daiAddr = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
const wethAddr = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const usdcAddr = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const yDaiAddr = '0x9D25057e62939D3408406975aD75Ffe834DA4cDd';
const curveDepositAddr = '0xbBC81d23Ea2c3ec7e56D39296F0cbB648873a5d3';

// Constants
const min = 9500;
const max = 10000;

const getTimestamp = async() => {
    let blocknum = await web3.eth.getBlockNumber();
    let block = await web3.eth.getBlock(blocknum);
    let time = block.timestamp;
    return time;
}
describe('Fork test yCRV strategy', () => {
    let strategy, vault, controller;
    let uniswap, dai, yDAI, usdc, lpToken, curveDeposit;
    let governance, strategist, user1, user2, rewards;
    let curveSwap, curveGauge;
    let balance;

    before(async() => {
        [
            governance, strategist, user1, user2, rewards
        ] = await web3.eth.getAccounts();

        controller = await Controller.new(rewards);
        uniswap = await IRouter.at(uniswapAddr);
        dai = await IERC20.at(daiAddr);
        yDAI = await IYERC20.at(yDaiAddr);
        usdc = await IERC20.at(usdcAddr);
        lpToken = await IYToken.at(curveLpTokenAddr);
        curveDeposit = await CurveFi_Deposit.at(curveDepositAddr);
        curveSwap = await ICurve_SwapY.at(swapAddr);
        curveGauge = await ICurve_Gauge.at(gaugeAddr);
        vault = await yVault.new(lpToken.address, controller.address);
        strategy = await CRVStrategyYCRV.new(vault.address, lpToken.address, strategist, curveGauge.address, curveDeposit.address, dai.address, uniswap.address);

        await controller.approveStrategy(vault.address, strategy.address);
        await controller.setStrategy(vault.address, strategy.address);
        await controller.setVault(lpToken.address, vault.address);

        const timestamp = await getTimestamp();
        const amount = await web3.utils.toWei('100', 'ether');
        await uniswap.swapExactETHForTokens(0, [wethAddr, daiAddr], user1, timestamp + 100,
                                    {from: user1, value: amount});
        balance = await dai.balanceOf(user1);
        await dai.approve(curveDeposit.address, balance, {from: user1});
        await curveDeposit.add_liquidity([balance, 0, 0, 0], 0, {from: user1});
    });

    it('Should deposit LP tokens to gauge', async() => {
        balance = await lpToken.balanceOf(user1);
        console.log('LP token balance: ', balance.toString());
        await lpToken.approve(vault.address, balance, {from: user1});
        await vault.deposit(balance, {from: user1});

        expect((await lpToken.balanceOf(vault.address)).toString()).to.equal(balance.toString());
        expect((await vault.balanceOf(user1)).toString()).to.not.equal('0');

        // send lp to strategy
        await vault.earn();

        let available = BigInt(balance.toString()) * BigInt(min) / BigInt(max);

        expect((BigInt(balance.toString()) - available).toString())
            .to.equal((await lpToken.balanceOf(vault.address)).toString());

        let gaugeSharesAmount = await curveGauge.balanceOf(strategy.address);
        console.log('curve gauge shares balance: ', gaugeSharesAmount.toString());
        expect(gaugeSharesAmount.toString()).to.not.equal('0');
    });

    it('Should execute Strategy.earn correctly', async() => {
        await strategy.setLiquidationAllowed(true, {from: strategist});
        for(let i = 0; i < 100; i++) {
            await time.advanceBlock();
        }

        await time.increase(duration.weeks(12));
        console.log('Claimable crv: ', (await curveGauge.claimable_tokens.call(strategy.address)).toString());
        // check rewards
        await strategy.setProfitSharing(10, 100, {from: strategist});
        const gaugeSharesBefore = await curveGauge.balanceOf(strategy.address);
        await strategy.earn({from: strategist});
        const gaugeSharesAfter = await curveGauge.balanceOf(strategy.address);

        console.log('Claimable crv after claim: ', (await curveGauge.claimable_tokens.call(strategy.address)).toString());
        console.log('Shares added after earn: ', (gaugeSharesAfter - gaugeSharesBefore).toString());
        expect((await dai.balanceOf(controller.address)).toString()).to.not.equal('0');
        expect((await lpToken.balanceOf(strategy.address)).toString()).to.equal('0');
        expect((gaugeSharesAfter - gaugeSharesBefore).toString()).to.not.equal('0');
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

        let balanceAfterWithdraw = BigInt((await lpToken.balanceOf(user1)).toString());
        console.log('User1 bal after withdraw: ', balanceAfterWithdraw.toString());
        expect(balanceAfterWithdraw.toString()).to.not.equal('0');

        await strategy.withdrawAll({from: strategist});

        expect((await curveGauge.balanceOf(strategy.address)).toString()).to.equal('0');

        let balanceAfterWithdrawAll = BigInt((await lpToken.balanceOf(vault.address)).toString());
        console.log('Vault bal after withdrawAll: ', balanceAfterWithdrawAll.toString());
        expect(balanceAfterWithdrawAll.toString())
            .to.not.equal('0');
    });
});