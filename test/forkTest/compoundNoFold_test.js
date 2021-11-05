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
const CompoundNoFoldStrategy = artifacts.require('CompoundNoFoldStrategy');
const Controller = artifacts.require('Controller');
const yVault = artifacts.require('yVault');

// Interafeces for fork
const IRouter = artifacts.require('IUniswapV2Router02');
const IERC20 = artifacts.require('IERC20');
const IComptroller = artifacts.require('ComptrollerInterface');
const ICToken = artifacts.require('CTokenInterface');
// MAINNET ADDRESSES
const uniswapAddr = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const wbtcAddr = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';
const wethAddr = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const compAddr = '0xc00e94Cb662C3520282E6f5717214004A7f26888';
const comptrollerAddr = '0x3d9819210A31b4961b30EF54bE2aeD79B9c9Cd3B';
const cwbtcAddr = '0xccF4429DB6322D5C611ee964527D42E5d685DD6a';
// Constants
const min = 9500;
const max = 10000;
const getTimestamp = async() => {
    let blocknum = await web3.eth.getBlockNumber();
    let block = await web3.eth.getBlock(blocknum);
    let time = block.timestamp;
    return time;
}

describe('Fork test CompoundNoFoldStrategy', () => {
    let strategy, vault;
    let token, ctoken, comp;
    let controller, comptroller;
    let uniswap;
    let balance;
    let governance, strategist, user1, user2, rewards;

    before(async() => {
        [
            governance, strategist, user1, user2, rewards
        ] = await web3.eth.getAccounts();

        controller = await Controller.new(rewards);
        uniswap = await IRouter.at(uniswapAddr); 
        comp = await IERC20.at(compAddr);
        comptroller = await IComptroller.at(comptrollerAddr);
        token = await IERC20.at(wbtcAddr);
        vault = await yVault.new(token.address, controller.address);
        ctoken = await ICToken.at(cwbtcAddr);
        strategy = await CompoundNoFoldStrategy.new(vault.address, token.address, strategist, ctoken.address, uniswap.address);
        await controller.approveStrategy(vault.address, strategy.address);
        await controller.setStrategy(vault.address, strategy.address);
        await controller.setVault(token.address, vault.address);

        // Buy wbtc to interact with
        const timestamp = await getTimestamp();
        const amount = await web3.utils.toWei('100', 'ether');
        await uniswap.swapExactETHForTokens(0, [wethAddr, wbtcAddr], user1, timestamp + 100,
                                    {from: user1, value: amount});
    });

    it('Should deposit tokens to vault, from vault to strategy, from strategy to compound', async() => {
        // Send wbtc to the vault
        balance = BigInt((await token.balanceOf(user1)).toString());
        await token.approve(vault.address, balance, {from: user1});
        await vault.deposit(balance, {from: user1});

        expect((await token.balanceOf(vault.address)).toString()).to.equal(balance.toString());
        expect((await vault.balanceOf(user1)).toString()).to.not.equal('0');

        // send wbtc to the strategy

        await vault.earn();

        let available = balance * BigInt(min) / BigInt(max);
        expect((await token.balanceOf(strategy.address)).toString()).to.equal('0');

        let cTokenBalance = await ctoken.balanceOf(strategy.address);
        console.log('cToken balance: ', cTokenBalance.toString());
        expect(cTokenBalance.toString()).to.not.equal('0');
    });

    it('Should execute Strategy.earn correctly', async() => {
        await strategy.setLiquidationAllowed(true, {from: strategist});
        await strategy.setHarvestOnWithdraw(true, {from: strategist});

        for(let i = 0; i < 100; i++) {
            await time.advanceBlock();
        }

        // Deposit more wBTC
        // const timestamp = await getTimestamp();
        // const amount = await web3.utils.toWei('100', 'ether');
        // await uniswap.swapExactETHForTokens(0, [wethAddr, wbtcAddr], user2, timestamp + 100,
        //                             {from: user2, value: amount});
        // balance = await token.balanceOf(user2);
        // await token.approve(vault.address, balance, {from: user2});
        // await vault.deposit(balance, {from: user2});
        // await vault.earn();
        // Check earn
        const cTokenBalanceBefore = BigInt((await ctoken.balanceOf(strategy.address)).toString());

        await strategy.setProfitSharing(10, 100, {from: strategist});
        await strategy.earn({from: strategist});

        const cTokenBalanceAfter = BigInt((await ctoken.balanceOf(strategy.address)).toString());
    
        console.log('cTokens added: ', (cTokenBalanceAfter - cTokenBalanceBefore).toString());
        expect((await token.balanceOf(controller.address)).toString()).to.not.equal('0');
        expect((await token.balanceOf(strategy.address)).toString()).to.equal('0');
        expect((cTokenBalanceAfter - cTokenBalanceBefore).toString()).to.not.equal('0');
    });

    it('Should withdraw part and than withdraw all', async() => {
        let amountWithdraw = BigInt('777');
        let shareBeforeWithdraw = await vault.balanceOf(user1);

        await vault.methods['withdraw(uint256)'](amountWithdraw, {from: user1});

        let shareAfterWithdraw = await vault.balanceOf(user1);
        expect(shareBeforeWithdraw - shareAfterWithdraw)
        .to.be.greaterThan(0);
        
        let balanceAfterWithdraw = BigInt((await token.balanceOf(user1)).toString());
        console.log('User1 bal after withdraw: ', balanceAfterWithdraw.toString());
        expect(balanceAfterWithdraw.toString()).to.not.equal('0');
        
        await strategy.withdrawAll({from: strategist});

        expect((await ctoken.balanceOf(strategy.address)).toString()).to.equal('0');

        let balanceAfterWithdrawAll = BigInt((await token.balanceOf(vault.address)).toString());
        console.log('Vault bal after withdrawAll: ', balanceAfterWithdrawAll.toString());
        expect(balanceAfterWithdrawAll.toString())
            .to.not.equal('0');
    });
});