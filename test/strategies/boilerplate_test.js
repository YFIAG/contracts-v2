const {
    constants,
    expectEvent,
    expectRevert,
    balance,
    time,
    ether
} = require('@openzeppelin/test-helpers');
const timeMachine = require('ganache-time-traveler');
const fromWei = web3.utils.fromWei;
const duration = time.duration;
const BN = web3.utils.BN;
const zero = new BN('0');
/* Chai */
const chai = require('chai');
chai.use(require('chai-bn')(BN));
const should = require('chai').should();
/* Artifacts imports */
const CompoundNoFoldStrategy = artifacts.require('CompoundNoFoldStrategy');
const cERC20Mock = artifacts.require('cERC20Mock');
const ComptrollerMock = artifacts.require('ComptrollerMock');
const UniswapMock = artifacts.require('UniswapMock');
const Controller = artifacts.require('Controller');
const yVault = artifacts.require('yVault');
const ERC20Mock = artifacts.require('ERC20Mock');

contract('CompoundNoFoldStrategy test', accounts => {
    let strategy;
    let LPToken;
    let token;
    let comp;
    const defaultClaimAmount = new BN('100000');
    let comptroller;
    let controller;
    let vault;
    let uniswap;
    let tokenName = "Token";
    let tokenSymbol = "TKN";
    let [sender, governance, strategist, thirdParty, rewards] = accounts;
    const fromStrategist = {
        from: strategist
    };

    let stub;
    let snapshotId;

    // before(async () => {
    //     await deployStrategy();
    //     let snapshot = await timeMachine.takeSnapshot();
    //     snapshotId = snapshot['result'];
    // });

    beforeEach(async () => {
        await deployStrategy();
    });

    // afterEach(async () => {
    //     await timeMachine.revertToSnapshot(snapshotId);
    // });


    it(`Deposit test`, async () => {
        const depositAmount = new BN("123456789");

        await token.mint(vault.address, depositAmount);
        const available = await vault.available();

        const tokenBalBefore = await token.balanceOf(vault.address);
        const LPTokenBalBefore = await LPToken.balanceOf(strategy.address);
        const stubBalanceBefore = await token.balanceOf(stub.address)

        await vault.earn();

        const tokenBalAfter = await token.balanceOf(vault.address);
        const LPTokenBalAfter = await LPToken.balanceOf(strategy.address);
        const stubBalanceAfter = await token.balanceOf(stub.address)

        // tokenBalBefore.should.bignumber.equal(depositAmount);
        // LPTokenBalBefore.should.bignumber.equal(zero);
        // stubBalanceBefore.should.bignumber.equal(zero);

        // tokenBalAfter.should.bignumber.equal(depositAmount.sub(available));
        // @todo there should be check for accurate lp-tokens check
        // LPTokenBalAfter.should.bignumber.be.above(zero);
        // stubBalanceAfter.should.bignumber.equal(available);
    });


    it(`User can withdraw required amount through vault`, async () => {
        const withdrawAmount = new BN("777");
        let depositAmount = new BN("123456789");

        await token.mint(thirdParty, depositAmount);
        await token.approve(vault.address, depositAmount, {
            from: thirdParty
        });
        await vault.depositAll({
            from: thirdParty
        });

        const available = await vault.available();

        await vault.earn();
        await token.mint(strategy.address, withdrawAmount);

        const tokenBalBefore = await token.balanceOf(vault.address);
        const LPTokenBalBefore = await LPToken.balanceOf(strategy.address);

        await vault.methods["withdraw(uint256)"](withdrawAmount, {
            from: thirdParty
        });

        const tokenBalAfter = await token.balanceOf(vault.address);
        const LPTokenBalAfter = await LPToken.balanceOf(strategy.address);

        // tokenBalBefore.should.bignumber.equal(depositAmount.sub(available));
        // LPTokenBalBefore.should.bignumber.equal(available);
        // tokenBalAfter.should.bignumber.equal(depositAmount.sub(available).sub(withdrawAmount));
        // LPTokenBalAfter.should.bignumber.equal(available);
    });

    it(`Strategist can withdraw required amount and receive it from strategy balance`, async () => {
        const withdrawAmount = new BN("777");
        const depositAmount = new BN("123456789");

        await token.mint(strategy.address, depositAmount);
        await strategy.deposit(fromStrategist);
        await token.mint(strategy.address, withdrawAmount);

        const tokenBalBefore = await token.balanceOf(strategy.address);
        const LPTokenBalBefore = await LPToken.balanceOf(strategy.address);

        await strategy.methods["withdraw(uint256)"](withdrawAmount, fromStrategist);

        const tokenBalAfter = await token.balanceOf(strategy.address);
        const LPTokenBalAfter = await LPToken.balanceOf(strategy.address);

        // tokenBalBefore.should.bignumber.equal(withdrawAmount);
        // LPTokenBalBefore.should.bignumber.equal(depositAmount);
        // tokenBalAfter.should.bignumber.equal(zero);
        // LPTokenBalAfter.should.bignumber.equal(depositAmount);
    });

    it(`Strategist can withdraw required amount and receive it from strategy withdraw from platform`, async () => {
        const withdrawAmount = new BN("777");
        const depositAmount = new BN("123456789");

        await token.mint(strategy.address, depositAmount);
        await strategy.deposit(fromStrategist);

        const tokenBalBefore = await token.balanceOf(thirdParty);
        const LPTokenBalBefore = await LPToken.balanceOf(strategy.address);

        await strategy.methods["withdraw(uint256)"](withdrawAmount, fromStrategist);

        const tokenBalAfter = await token.balanceOf(thirdParty);
        const LPTokenBalAfter = await LPToken.balanceOf(strategy.address);

        // tokenBalBefore.should.bignumber.equal(zero);
        // LPTokenBalBefore.should.bignumber.equal(depositAmount);
        // tokenBalAfter.should.bignumber.equal(withdrawAmount);
        // LPTokenBalAfter.should.bignumber.equal(depositAmount.sub(withdrawAmount));
    });

    it(`Strategist can withdrawAll when emergency liquidity shortage not allowed and liquidation allowed`, async () => {

        let depositAmount = new BN("123456789");

        await token.mint(vault.address, depositAmount);
        const available = await vault.available();
        await vault.earn();

        const tokenBalBefore = await token.balanceOf(strategy.address);
        const cTokenBalBefore = await LPToken.balanceOf(strategy.address);

        await strategy.withdrawAll(fromStrategist);

        const tokenBalAfter = await token.balanceOf(strategy.address);
        const cTokenBalAfter = await LPToken.balanceOf(strategy.address);

        // tokenBalBefore.should.bignumber.equal(zero);
        // cTokenBalBefore.should.bignumber.equal(depositAmount);
        // tokenBalAfter.should.bignumber.equal(depositAmount.add(defaultClaimAmount));
        // cTokenBalAfter.should.bignumber.equal(zero);
    });

    it(`Check harvest`, async ()=>{
        let depositAmount = new BN("123456789");

        await token.mint(thirdParty, depositAmount);
        await token.approve(vault.address, constants.MAX_INT256, {
            from: thirdParty
        });
        await vault.depositAll({
            from: thirdParty
        });
        const available = await vault.available();

        await timeMachine.advanceBlock();
        await timeMachine.advanceBlock();
        await timeMachine.advanceBlock();

        const tokenBalBefore = await token.balanceOf(vault.address);
        const LPTokenBalBefore = await LPToken.balanceOf(strategy.address);
        const stubBalanceBefore = await token.balanceOf(stub.address)

        await vault.earn();

        const tokenBalAfter = await token.balanceOf(vault.address);
        const LPTokenBalAfter = await LPToken.balanceOf(strategy.address);
        const stubBalanceAfter = await token.balanceOf(stub.address)

        // tokenBalBefore.should.bignumber.equal(depositAmount);
        // LPTokenBalBefore.should.bignumber.equal(zero);
        // stubBalanceBefore.should.bignumber.equal(zero);

        // tokenBalAfter.should.bignumber.equal(depositAmount.sub(available));
        // @todo there should be check for accurate lp-tokens check
        // LPTokenBalAfter.should.bignumber.be.above(zero);
        // stubBalanceAfter.should.bignumber.equal(available);

        await vault.withdrawAll({ from: thirdParty });

        const userTokenBalAfter = await token.balanceOf(thirdParty);

        // userTokenBalAfter.should.bignumber.equal(depositAmount.add(defaultClaimAmount));

    });

    async function deployStrategy() {
        controller = await Controller.new(rewards);
        uniswap = await UniswapMock.new();
        token = await ERC20Mock.new(tokenName, tokenSymbol, '1000000');
        comp = await ERC20Mock.new("Comp", "CMP", "1000000");
        comptroller = await ComptrollerMock.new(comp.address, defaultClaimAmount);
        LPToken = await cERC20Mock.new("c" + tokenName, "c" + tokenSymbol, token.address,comptroller.address);
        stub = LPToken;
        vault = await yVault.new(token.address, controller.address);
        strategy = await CompoundNoFoldStrategy.new(vault.address, token.address,strategist, LPToken.address, uniswap.address);
        await controller.approveStrategy(vault.address, strategy.address);
        await controller.setStrategy(vault.address, strategy.address);
        await controller.setVault(token.address, vault.address);
    }
});