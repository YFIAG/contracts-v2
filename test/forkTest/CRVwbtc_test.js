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
const zero = new BN('0');
/* Chai */
const chai = require('chai');
const {
    expect
} = require('chai');
chai.use(require('chai-bn')(BN));
const should = require('chai').should();
/* Artifacts imports */
const Controller = artifacts.require('Controller');
const yVault = artifacts.require('yVault');
const CRVStrategyWRenBTC = artifacts.require('CRVStrategyWRenBTCMix');

// Interafaces for fork
const ICurve_DepositY = artifacts.require('ICurveFi_DepositY');
const ICurve_SwapY = artifacts.require('ICurveFiWbtc');
const ICurve_Minter = artifacts.require('ICurveFi_Minter');
const ICurve_Gauge = artifacts.require('ICurveFi_Gauge');
const IRouter = artifacts.require('IUniswapV2Router02');
const IERC20 = artifacts.require('IERC20');

// Mainnet addresses
const uniswapAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const wbtcAddr = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
const wethAddr = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const crvSwap = '0x93054188d876f558f4a66B2EF1d97d16eDf0895B';
const crvGauge = '0xB1F2cdeC61db658F091671F5f199635aEF202CAC';
const renBTCAddr = '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D';
const lpTokenAddr = '0x49849C98ae39Fff122806C06791Fa73784FB3675';

// Constants
const min = 9500;
const max = 10000;

const getTimestamp = async() => {
    let blocknum = await web3.eth.getBlockNumber();
    let block = await web3.eth.getBlock(blocknum);
    let time = block.timestamp;
    return time;
}

describe('Fork test CRV wBTC', () => {
    let strategy, vault, controller;
    let uniswap, token, secondToken, mixedToken;
    let governance, strategist, user1, rewards;
    let curveSwap, curveGauge;
    let balance;
    before(async() => {
        [
            governance, strategist, user1, rewards
        ] = await web3.eth.getAccounts();

        controller = await Controller.new(rewards);
        uniswap = await IRouter.at(uniswapAddr);
        token = await IERC20.at(wbtcAddr);
        secondToken = await IERC20.at(renBTCAddr);
        mixedToken = await IERC20.at(lpTokenAddr);
        curveSwap = await ICurve_SwapY.at(crvSwap);
        curveGauge = await ICurve_Gauge.at(crvGauge);
        vault = await yVault.new(token.address, controller.address);
        strategy = await CRVStrategyWRenBTC.new(vault.address, token.address, strategist, 1, curveSwap.address, curveGauge.address, uniswap.address, secondToken.address);
        
        await controller.approveStrategy(vault.address, strategy.address);
        await controller.setStrategy(vault.address, strategy.address);
        await controller.setVault(token.address, vault.address);

        // Buy wbtc to interact with
        const timestamp = await getTimestamp();
        const amount = await web3.utils.toWei('100', 'ether');
        await uniswap.swapExactETHForTokens(0, [wethAddr, wbtcAddr], user1, timestamp + 100,
                                    {from: user1, value: amount});
    });
   /* it("kek", async() => {
        balance = await token.balanceOf(user1);
        balance = balance.div(new BN('2'));
        await token.approve(curveSwap.address, balance, {from: user1});
        await curveSwap.exchange(1, 0, balance, 0, {from: user1});

        balance = await token.balanceOf(user1);
        let balance0 = await secondToken.balanceOf(user1);
        console.log("renBTC bal: ", balance0.toString());
        console.log("wBTC bal: ", balance.toString());

        await token.approve(curveSwap.address, balance, {from: user1});
        await secondToken.approve(curveSwap.address, balance0, {from: user1});

        await curveSwap.add_liquidity([balance0, balance], 0, {from: user1});

        let mixedBal = await mixedToken.balanceOf(user1);
        await mixedToken.approve(curveGauge.address, mixedBal, {from: user1});

        await curveGauge.deposit(mixedBal, {from: user1});
        console.log(await curveGauge.balanceOf(user1));
    }); */

    it('Should deposit tokens to vault, from vault to strategy, from strategy to curve gauge', async() => {
        balance = (await token.balanceOf(user1)).toString();
        await token.approve(vault.address, balance, {from: user1});
        await vault.deposit(balance, {from: user1});

        expect((await token.balanceOf(vault.address)).toString()).to.equal(balance.toString());
        expect((await vault.balanceOf(user1)).toString()).to.not.equal('0');

        // send wbtc to strategy
        await vault.earn();

        let available = BigInt(balance.toString()) * BigInt(min) / BigInt(max);
        expect((BigInt(balance.toString()) - available).toString())
            .to.equal((await token.balanceOf(vault.address)).toString());


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

        expect((await token.balanceOf(controller.address)).toString()).to.not.equal('0');
        expect((await token.balanceOf(strategy.address)).toString()).to.equal('0');
        expect((gaugeSharesAfter - gaugeSharesBefore).toString()).to.not.equal('0');
    });

    it('Should withdraw part and than withdraw all', async() => {
        await strategy.setHarvestOnWithdraw(true, {from: strategist});
        let amountWithdraw = BigInt('777');
        let shareBeforeWithdraw = await vault.balanceOf(user1);
        console.log('share before: ', shareBeforeWithdraw.toString());
        await vault.methods['withdraw(uint256)'](amountWithdraw, {from: user1});

        let shareAfterWithdraw = await vault.balanceOf(user1);
        console.log('share after: ', shareAfterWithdraw.toString());
        expect(shareBeforeWithdraw - shareAfterWithdraw)
        .to.be.greaterThan(0);

        let balanceAfterWithdraw = BigInt((await token.balanceOf(user1)).toString());
        console.log('User1 bal after withdraw: ', balanceAfterWithdraw.toString());
        expect(balanceAfterWithdraw.toString()).to.not.equal('0');

        await strategy.withdrawAll({from: strategist});

        expect((await curveGauge.balanceOf(strategy.address)).toString()).to.equal('0');

        let balanceAfterWithdrawAll = BigInt((await token.balanceOf(vault.address)).toString());
        console.log('Vault bal after withdrawAll: ', balanceAfterWithdrawAll.toString());
        expect(balanceAfterWithdrawAll.toString())
            .to.not.equal('0');
    });
});