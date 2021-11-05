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
    let cToken;
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

    describe('Check constructor', () => {
        it(`Create contract and check initialization`, async () => {
            await deployStrategy();
            const _strategist = await strategy.strategist();
            const _governance = await strategy.governance();
            const _comptroller = await strategy.comptroller();
            const _controller = await strategy.controller();
            const _comp = await strategy.comp();
            const _underlying = await strategy.underlying();
            const _ctoken = await strategy.ctoken();
            const _vault = await strategy.vault();
            const _uniswapRouterV2 = await strategy.uniswapRouterV2();
            _strategist.should.equal(strategist);
            _governance.should.equal(governance);
            _comptroller.should.equal(comptroller.address);
            _controller.should.equal(controller.address);
            _comp.should.equal(comp.address);
            _underlying.should.equal(token.address);
            _ctoken.should.equal(cToken.address);
            _vault.should.equal(vault.address);
            _uniswapRouterV2.should.equal(uniswap.address);

            (await strategy.unsalvageableTokens(comp.address)).should.be.true;
            (await strategy.unsalvageableTokens(token.address)).should.be.true;
            (await strategy.unsalvageableTokens(cToken.address)).should.be.true;
        });
        it(`Constructor will revert if vault will not support underlying token`, async ()=>{
            controller = await Controller.new(rewards);
            uniswap = await UniswapMock.new();
            token = await ERC20Mock.new(tokenName, tokenSymbol, '1000000');
            cToken = await cERC20Mock.new("c" + tokenName, "c" + tokenSymbol, token.address);
            comp = await ERC20Mock.new("Comp", "CMP", "1000000");
            comptroller = await ComptrollerMock.new(comp.address, defaultClaimAmount);
            vault = await yVault.new(token.address, controller.address);
            await expectRevert(CompoundNoFoldStrategy.new(constants.ZERO_ADDRESS, cToken.address, vault.address, comptroller.address, comp.address, uniswap.address, controller.address, governance, strategist),"vault does not support underlying");
        });
    });

    describe('Deposit test', () => {
        beforeEach(async () => {
            await deployStrategy();
        });

        it(`Strategist can deposit`, async () => {
            const depositAmount = new BN("123456789");

            await token.mint(strategy.address, depositAmount);

            const tokenBalBefore = await token.balanceOf(strategy.address);
            const cTokenBalBefore = await cToken.balanceOf(strategy.address);

            await strategy.deposit(fromStrategist);

            const tokenBalAfter = await token.balanceOf(strategy.address);
            const cTokenBalAfter = await cToken.balanceOf(strategy.address);

            tokenBalBefore.should.bignumber.equal(depositAmount);
            cTokenBalBefore.should.bignumber.equal(zero);
            tokenBalAfter.should.bignumber.equal(zero);
            cTokenBalAfter.should.bignumber.equal(depositAmount);
        });

        it(`Deposit reverts if cToken returns error`, async () => {
            const depositAmount = new BN("123456789");

            await token.mint(strategy.address, depositAmount);
            await cToken.setFailMint(true);

            const tokenBalBefore = await token.balanceOf(strategy.address);
            const cTokenBalBefore = await cToken.balanceOf(strategy.address);

            await expectRevert(strategy.deposit(fromStrategist), "Supplying failed");

            const tokenBalAfter = await token.balanceOf(strategy.address);
            const cTokenBalAfter = await cToken.balanceOf(strategy.address);

            tokenBalBefore.should.bignumber.equal(depositAmount);
            cTokenBalBefore.should.bignumber.equal(zero);
            tokenBalAfter.should.bignumber.equal(depositAmount);
            cTokenBalAfter.should.bignumber.equal(zero);
        });

    });

    describe('Withdraw all test', () => {
        beforeEach(async () => {
            await deployStrategy();
        });

        it(`Strategist can withdrawAll when emergency liquidity shortage not allowed and liquidation allowed`, async () => {
            const depositAmount = new BN("123456789");

            await token.mint(strategy.address, depositAmount);
            await strategy.deposit(fromStrategist);

            const tokenBalBefore = await token.balanceOf(vault.address);
            const cTokenBalBefore = await cToken.balanceOf(strategy.address);

            await strategy.withdrawAll(fromStrategist);

            const tokenBalAfter = await token.balanceOf(vault.address);
            const cTokenBalAfter = await cToken.balanceOf(strategy.address);

            tokenBalBefore.should.bignumber.equal(zero);
            cTokenBalBefore.should.bignumber.equal(depositAmount);
            tokenBalAfter.should.bignumber.equal(depositAmount.add(defaultClaimAmount));
            cTokenBalAfter.should.bignumber.equal(zero);
        });
        it(`Strategist can withdrawAll when emergency liquidity shortage not allowed and liquidation not allowed`, async () => {
            const depositAmount = new BN("123456789");

            await token.mint(strategy.address, depositAmount);
            await strategy.deposit(fromStrategist);
            await strategy.setLiquidationAllowed(false, fromStrategist);

            const tokenBalBefore = await token.balanceOf(vault.address);
            const cTokenBalBefore = await cToken.balanceOf(strategy.address);

            await strategy.withdrawAll(fromStrategist);

            const tokenBalAfter = await token.balanceOf(vault.address);
            const cTokenBalAfter = await cToken.balanceOf(strategy.address);

            tokenBalBefore.should.bignumber.equal(zero);
            cTokenBalBefore.should.bignumber.equal(depositAmount);
            tokenBalAfter.should.bignumber.equal(depositAmount);
            cTokenBalAfter.should.bignumber.equal(zero);
        });
        it(`Strategist can withdrawAll when emergency liquidity shortage allowed and liquidation not allowed`, async () => {
            const depositAmount = new BN("123456789");
            const cash = new BN("777");

            await token.mint(strategy.address, depositAmount);
            await strategy.deposit(fromStrategist);
            await strategy.setLiquidationAllowed(false, fromStrategist);
            await strategy.setAllowLiquidityShortage(true, fromStrategist);
            await cToken.setCash(cash);

            const tokenBalBefore = await token.balanceOf(vault.address);
            const cTokenBalBefore = await cToken.balanceOf(strategy.address);

            await strategy.withdrawAll(fromStrategist);

            const tokenBalAfter = await token.balanceOf(vault.address);
            const cTokenBalAfter = await cToken.balanceOf(strategy.address);

            tokenBalBefore.should.bignumber.equal(zero);
            cTokenBalBefore.should.bignumber.equal(depositAmount);
            tokenBalAfter.should.bignumber.equal(cash);
            cTokenBalAfter.should.bignumber.equal(depositAmount.sub(cash));
        });
        it(`Strategist can withdrawAll when emergency liquidity shortage allowed and liquidation allowed`, async () => {
            const depositAmount = new BN("123456789");
            const cash = new BN("777");

            await token.mint(strategy.address, depositAmount);
            await strategy.deposit(fromStrategist);
            await strategy.setAllowLiquidityShortage(true, fromStrategist);
            await cToken.setCash(cash);

            const tokenBalBefore = await token.balanceOf(vault.address);
            const cTokenBalBefore = await cToken.balanceOf(strategy.address);

            await strategy.withdrawAll(fromStrategist);

            const tokenBalAfter = await token.balanceOf(vault.address);
            const cTokenBalAfter = await cToken.balanceOf(strategy.address);

            tokenBalBefore.should.bignumber.equal(zero);
            cTokenBalBefore.should.bignumber.equal(depositAmount);
            tokenBalAfter.should.bignumber.equal(cash.add(defaultClaimAmount));
            cTokenBalAfter.should.bignumber.equal(depositAmount.sub(cash));
        });
        it(`Withdraw all will revert if market cannot cover liquidity when emergency liquidity shortage not allowed `, async ()=>{
            const depositAmount = new BN("123456789");
            const cash = new BN("777");

            await token.mint(strategy.address, depositAmount);
            await strategy.deposit(fromStrategist);
            await strategy.setLiquidationAllowed(false, fromStrategist);
            await cToken.setCash(cash);

            await expectRevert(strategy.withdrawAll(fromStrategist),"market cash cannot cover liquidity");
        });
    });

    describe('Withdraw amount test', () => {
        beforeEach(async () => {
            await deployStrategy();
        });

        it(`Strategist can withdraw required amount and receive it from strategy balance`, async () => {
            const withdrawAmount = new BN("777");
            const depositAmount = new BN("123456789");

            await token.mint(strategy.address, depositAmount);
            await strategy.deposit(fromStrategist);
            await token.mint(strategy.address, withdrawAmount);

            const tokenBalBefore = await token.balanceOf(vault.address);
            const cTokenBalBefore = await cToken.balanceOf(strategy.address);

            await strategy.methods["withdraw(uint256)"](withdrawAmount, fromStrategist);

            const tokenBalAfter = await token.balanceOf(vault.address);
            const cTokenBalAfter = await cToken.balanceOf(strategy.address);

            tokenBalBefore.should.bignumber.equal(zero);
            cTokenBalBefore.should.bignumber.equal(depositAmount);
            tokenBalAfter.should.bignumber.equal(withdrawAmount);
            cTokenBalAfter.should.bignumber.equal(depositAmount);
        });
        it(`Strategist can withdraw required amount and receive it from strategy withdraw from Compound`, async () => {
            const withdrawAmount = new BN("777");
            const depositAmount = new BN("123456789");

            await token.mint(strategy.address, depositAmount);
            await strategy.deposit(fromStrategist);

            const tokenBalBefore = await token.balanceOf(vault.address);
            const cTokenBalBefore = await cToken.balanceOf(strategy.address);

            await strategy.methods["withdraw(uint256)"](withdrawAmount, fromStrategist);

            const tokenBalAfter = await token.balanceOf(vault.address);
            const cTokenBalAfter = await cToken.balanceOf(strategy.address);

            tokenBalBefore.should.bignumber.equal(zero);
            cTokenBalBefore.should.bignumber.equal(depositAmount);
            tokenBalAfter.should.bignumber.equal(withdrawAmount);
            cTokenBalAfter.should.bignumber.equal(depositAmount.sub(withdrawAmount));
        });

    });

    describe('Withdraw token test', () => {

        beforeEach(async () => {
            await deployStrategy();
        });

        it(`Strategist can withdraw salvageable token`, async () => {
            const withdrawAmount = new BN('1358398214');

            const thirdPartyToken = await ERC20Mock.new("ThirdPartyToken", "TPT", "1");
            await thirdPartyToken.mint(strategy.address, withdrawAmount);

            const tokenBalanceBefore = await thirdPartyToken.balanceOf(controller.address);

            await strategy.withdraw(thirdPartyToken.address, fromStrategist);

            const tokenBalanceAfter = await thirdPartyToken.balanceOf(controller.address);

            tokenBalanceBefore.should.bignumber.equal(zero);
            tokenBalanceAfter.should.bignumber.equal(withdrawAmount);
        });

        it(`Strategist can't withdraw unsalvageable token`, async () => {
            await expectRevert(strategy.withdraw(comp.address, fromStrategist), "!salvageable");
            await expectRevert(strategy.withdraw(token.address, fromStrategist), "!salvageable");
            await expectRevert(strategy.withdraw(cToken.address, fromStrategist), "!salvageable");
        });
    });

    describe('Emergency exit', () => {

        beforeEach(async () => {
            await deployStrategy();
        });

        it(`Governance can call emergency exit`, async ()=>{
            const depositAmount = new BN("123456789");
            const cash = new BN("777");

            await token.mint(strategy.address, depositAmount);
            await strategy.deposit(fromStrategist);
            await cToken.setCash(cash);

            const tokenBalBefore = await token.balanceOf(strategy.address);
            const cTokenBalBefore = await cToken.balanceOf(strategy.address);

            await strategy.emergencyExit({from:governance});

            const tokenBalAfter = await token.balanceOf(strategy.address);
            const cTokenBalAfter = await cToken.balanceOf(strategy.address);

            tokenBalBefore.should.bignumber.equal(zero);
            cTokenBalBefore.should.bignumber.equal(depositAmount);
            tokenBalAfter.should.bignumber.equal(cash.add(defaultClaimAmount));
            cTokenBalAfter.should.bignumber.equal(depositAmount.sub(cash));
        });
    });

    describe("Earn test", () => {
        beforeEach(async () => {
            await deployStrategy();
        });
        it(`Strategist can earn when liquidation allowed`, async () => {
            const depositAmount = new BN("123456789");

            await token.mint(strategy.address, depositAmount);

            const tokenBalBefore = await token.balanceOf(strategy.address);
            const cTokenBalBefore = await cToken.balanceOf(strategy.address);

            await strategy.earn(fromStrategist);

            const tokenBalAfter = await token.balanceOf(strategy.address);
            const cTokenBalAfter = await cToken.balanceOf(strategy.address);

            tokenBalBefore.should.bignumber.equal(depositAmount);
            cTokenBalBefore.should.bignumber.equal(zero);
            tokenBalAfter.should.bignumber.equal(zero);
            cTokenBalAfter.should.bignumber.equal(depositAmount.add(defaultClaimAmount));
        });
        it(`Strategist can earn when liquidation not allowed`, async () => {
            const depositAmount = new BN("123456789");

            await token.mint(strategy.address, depositAmount);
            await strategy.setLiquidationAllowed(false, fromStrategist);

            const tokenBalBefore = await token.balanceOf(strategy.address);
            const cTokenBalBefore = await cToken.balanceOf(strategy.address);

            await strategy.earn(fromStrategist);

            const tokenBalAfter = await token.balanceOf(strategy.address);
            const cTokenBalAfter = await cToken.balanceOf(strategy.address);

            tokenBalBefore.should.bignumber.equal(depositAmount);
            cTokenBalBefore.should.bignumber.equal(zero);
            tokenBalAfter.should.bignumber.equal(zero);
            cTokenBalAfter.should.bignumber.equal(depositAmount);
        });
    });

    describe('Test liquidate comp under sellFloor check', () => {
        beforeEach(async () => {
            await deployStrategy();
        });
        it(`Liquidate comp won't liquidate comp tokens if comp balance lower than sell floor value`, async () => {
            const depositAmount = new BN("123456789");

            await token.mint(strategy.address, depositAmount);
            const newValue = new BN("413841");
            await strategy.setSellFloor(newValue, fromStrategist);
            const tokenBalBefore = await token.balanceOf(strategy.address);
            const cTokenBalBefore = await cToken.balanceOf(strategy.address);

            await strategy.earn(fromStrategist);

            const tokenBalAfter = await token.balanceOf(strategy.address);
            const cTokenBalAfter = await cToken.balanceOf(strategy.address);

            tokenBalBefore.should.bignumber.equal(depositAmount);
            cTokenBalBefore.should.bignumber.equal(zero);
            tokenBalAfter.should.bignumber.equal(zero);
            cTokenBalAfter.should.bignumber.equal(depositAmount);
        });
    });

    describe('Miscellanous', () => {
        beforeEach(async () => {
            await deployStrategy();
        });
        it(`Allow emergency liquidity shortage`, async ()=>{
            let allowliquidityShortage = await strategy.allowEmergencyLiquidityShortage();
            allowliquidityShortage.should.be.false;
            await strategy.setAllowLiquidityShortage(true, fromStrategist);
            allowliquidityShortage = await strategy.allowEmergencyLiquidityShortage();
            allowliquidityShortage.should.be.true;
            await strategy.setAllowLiquidityShortage(false, fromStrategist);
            allowliquidityShortage = await strategy.allowEmergencyLiquidityShortage();
            allowliquidityShortage.should.be.false;
        });
        it(`Liquidation allowed`, async ()=>{
            let liquidationAllowed = await strategy.liquidationAllowed();
            liquidationAllowed.should.be.true;
            await strategy.setLiquidationAllowed(false, fromStrategist);
            liquidationAllowed = await strategy.liquidationAllowed();
            liquidationAllowed.should.be.false;
            await strategy.setLiquidationAllowed(true, fromStrategist);
            liquidationAllowed = await strategy.liquidationAllowed();
            liquidationAllowed.should.be.true;
        });

        it(`Sell floor`, async ()=>{
            let sellFloor = await strategy.sellFloor();
            sellFloor.should.bignumber.equal(zero);

            const newValue = new BN("413841");
            await strategy.setSellFloor(newValue, fromStrategist);
            sellFloor = await strategy.sellFloor();
            sellFloor.should.bignumber.equal(newValue);
        });

        it(`balanceOf`, async ()=>{
            const depositAmount = new BN("123456789");
            const underlyingBalance = new BN("5314351");
            await token.mint(strategy.address, depositAmount);
            await strategy.deposit(fromStrategist);
            await token.mint(strategy.address, underlyingBalance);
            const balance = await strategy.balanceOf();
            balance.should.bignumber.equal(depositAmount.add(underlyingBalance));
        });

        it(`want`, async ()=>{
            (await strategy.want()).should.equal(token.address);
        });

        it(`skim`, async ()=>{
            await expectRevert(strategy.skim(), "Can't skim");
        });

        it(`convert`, async ()=>{
            await expectRevert(strategy.convert(token.address), "Can't convert");
        });

        it(`Get strategy name`, async ()=>{
            (await strategy.getNameStrategy()).should.equal("CompoundNoFoldStrategy");
        });

        it(`Governance address`, async ()=>{
            await strategy.setGovernance(constants.ZERO_ADDRESS, { from: governance });
            (await strategy.governance()).should.equal(constants.ZERO_ADDRESS);
        });

        it(`Controller address`, async ()=>{
            await strategy.setController(constants.ZERO_ADDRESS, { from: governance });
            (await strategy.controller()).should.equal(constants.ZERO_ADDRESS);
        });

        it(`Strategist address`, async () => {
            await strategy.setStrategist(constants.ZERO_ADDRESS,fromStrategist);
            (await strategy.strategist()).should.equal(constants.ZERO_ADDRESS);
        });

        it(`Only governance`, async ()=>{
            await expectRevert(strategy.setGovernance(constants.ZERO_ADDRESS,{from:thirdParty}), "!governance");
            await strategy.setGovernance(constants.ZERO_ADDRESS, { from: governance });
        });

        it(`restricted`, async ()=>{
            await expectRevert(strategy.setStrategist(constants.ZERO_ADDRESS, { from: thirdParty }), "Sender must be privileged");
            await strategy.setStrategist(constants.ZERO_ADDRESS, fromStrategist);
            await strategy.setStrategist(constants.ZERO_ADDRESS, { from: governance });
        });
    });

    async function deployStrategy() {
        controller = await Controller.new(rewards);
        uniswap = await UniswapMock.new();
        token = await ERC20Mock.new(tokenName, tokenSymbol, '1000000');
        cToken = await cERC20Mock.new("c" + tokenName, "c" + tokenSymbol, token.address);
        comp = await ERC20Mock.new("Comp", "CMP", "1000000");
        comptroller = await ComptrollerMock.new(comp.address, defaultClaimAmount);
        vault = await yVault.new(token.address, controller.address);
        strategy = await CompoundNoFoldStrategy.new(token.address, cToken.address, vault.address, comptroller.address, comp.address, uniswap.address, controller.address, governance, strategist);
        await controller.approveStrategy(vault.address, strategy.address);
        await controller.setStrategy(vault.address, strategy.address);
        await controller.setVault(token.address, vault.address);
    }
});