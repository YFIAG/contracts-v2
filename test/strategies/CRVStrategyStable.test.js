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

const ERC20 = artifacts.require('Stub_ERC20');
const YERC20 = artifacts.require('Stub_YERC20');


const CurveDeposit = artifacts.require('Stub_CurveFi_DepositY');
const CurveSwap = artifacts.require('Stub_CurveFi_SwapY');
const CurveLPToken = artifacts.require('Stub_CurveFi_LPTokenY');
const CurveCRVMinter = artifacts.require('Stub_CurveFi_Minter');
const CurveGauge = artifacts.require('Stub_CurveFi_Gauge');

const CRVStrategyYCRV = artifacts.require('CRVStrategyYCRV');
const UniswapMock = artifacts.require('UniswapMock');
const Controller = artifacts.require('Controller');
const yVault = artifacts.require('yVault');
const ERC20Mock = artifacts.require('ERC20Mock');

contract('CRVStrategyYCRV test', accounts => {
    let strategy;
    let cToken;
    let token;
    let comp;
    const defaultClaimAmount = new BN('100000');
    let comptroller;
    let controller;
    let vault;
    let uniswap;
    let [owner, governance, strategist, thirdParty, rewards] = accounts;
    const fromStrategist = {
        from: strategist
    };

    let dai;
    let usdc;
    let tusd;
    let usdt;

    let ydai;
    // let yusdc;
    let ytusd;
    let yusdt;

    let curveLPToken;
    let curveSwap;
    let curveDeposit;

    let crvToken;
    let curveMinter;
    let curveGauge;

    let moneyToCurve;

    const supplies = {
        dai: new BN('1000000000000000000000000'),
        usdc: new BN('1000000000000'),
        tusd: new BN('1000000000000'),
        usdt: new BN('1000000000000000000000000')
    };


    describe('Check constructor', () => {
        it(`Create contract and check initialization`, async () => {
            await deployStrategy();
            const _strategist = await strategy.strategist();
            const _governance = await strategy.governance();
            const _controller = await strategy.controller();
            const _underlying = await strategy.underlying();
            const _vault = await strategy.vault();
            const _uni = await strategy.uni();
            _strategist.should.equal(strategist);
            _governance.should.equal(governance);
            _controller.should.equal(controller.address);
            _underlying.should.equal(token.address);
            _vault.should.equal(vault.address);
            _uni.should.equal(uniswap.address);

            (await strategy.unsalvageableTokens(token.address)).should.be.true;
            (await strategy.unsalvageableTokens(crvToken.address)).should.be.true;
        });
        it(`Constructor will revert if vault will not support underlying token`, async () => {
            await deployStrategy();
            const thirdPartyToken = await ERC20Mock.new("srs","sadas",1);
            vault = await yVault.new(thirdPartyToken.address, controller.address);
            await expectRevert( CRVStrategyYCRV.new(vault.address, token.address, controller.address, governance,strategist,curveGauge.address,curveMinter.address, crvToken.address, curveSwap.address, constants.ZERO_ADDRESS,dai.address,ydai.address,uniswap.address), "vault does not support underlying");
        });
    });

    describe.only('Deposit test', () => {
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
        it(`Withdraw all will revert if market cannot cover liquidity when emergency liquidity shortage not allowed `, async () => {
            const depositAmount = new BN("123456789");
            const cash = new BN("777");

            await token.mint(strategy.address, depositAmount);
            await strategy.deposit(fromStrategist);
            await strategy.setLiquidationAllowed(false, fromStrategist);
            await cToken.setCash(cash);

            await expectRevert(strategy.withdrawAll(fromStrategist), "market cash cannot cover liquidity");
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

        it(`Governance can call emergency exit`, async () => {
            const depositAmount = new BN("123456789");
            const cash = new BN("777");

            await token.mint(strategy.address, depositAmount);
            await strategy.deposit(fromStrategist);
            await cToken.setCash(cash);

            const tokenBalBefore = await token.balanceOf(strategy.address);
            const cTokenBalBefore = await cToken.balanceOf(strategy.address);

            await strategy.emergencyExit({
                from: governance
            });

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
        it(`Allow emergency liquidity shortage`, async () => {
            let allowliquidityShortage = await strategy.allowEmergencyLiquidityShortage();
            allowliquidityShortage.should.be.false;
            await strategy.setAllowLiquidityShortage(true, fromStrategist);
            allowliquidityShortage = await strategy.allowEmergencyLiquidityShortage();
            allowliquidityShortage.should.be.true;
            await strategy.setAllowLiquidityShortage(false, fromStrategist);
            allowliquidityShortage = await strategy.allowEmergencyLiquidityShortage();
            allowliquidityShortage.should.be.false;
        });
        it(`Liquidation allowed`, async () => {
            let liquidationAllowed = await strategy.liquidationAllowed();
            liquidationAllowed.should.be.true;
            await strategy.setLiquidationAllowed(false, fromStrategist);
            liquidationAllowed = await strategy.liquidationAllowed();
            liquidationAllowed.should.be.false;
            await strategy.setLiquidationAllowed(true, fromStrategist);
            liquidationAllowed = await strategy.liquidationAllowed();
            liquidationAllowed.should.be.true;
        });

        it(`Sell floor`, async () => {
            let sellFloor = await strategy.sellFloor();
            sellFloor.should.bignumber.equal(zero);

            const newValue = new BN("413841");
            await strategy.setSellFloor(newValue, fromStrategist);
            sellFloor = await strategy.sellFloor();
            sellFloor.should.bignumber.equal(newValue);
        });

        it(`balanceOf`, async () => {
            const depositAmount = new BN("123456789");
            const underlyingBalance = new BN("5314351");
            await token.mint(strategy.address, depositAmount);
            await strategy.deposit(fromStrategist);
            await token.mint(strategy.address, underlyingBalance);
            const balance = await strategy.balanceOf();
            balance.should.bignumber.equal(depositAmount.add(underlyingBalance));
        });

        it(`want`, async () => {
            (await strategy.want()).should.equal(token.address);
        });

        it(`skim`, async () => {
            await expectRevert(strategy.skim(), "Can't skim");
        });

        it(`convert`, async () => {
            await expectRevert(strategy.convert(token.address), "Can't convert");
        });

        it(`Get strategy name`, async () => {
            (await strategy.getNameStrategy()).should.equal("CRVStrategyYCRV");
        });

        it(`Governance address`, async () => {
            await strategy.setGovernance(constants.ZERO_ADDRESS, {
                from: governance
            });
            (await strategy.governance()).should.equal(constants.ZERO_ADDRESS);
        });

        it(`Controller address`, async () => {
            await strategy.setController(constants.ZERO_ADDRESS, {
                from: governance
            });
            (await strategy.controller()).should.equal(constants.ZERO_ADDRESS);
        });

        it(`Strategist address`, async () => {
            await strategy.setStrategist(constants.ZERO_ADDRESS, fromStrategist);
            (await strategy.strategist()).should.equal(constants.ZERO_ADDRESS);
        });

        it(`Only governance`, async () => {
            await expectRevert(strategy.setGovernance(constants.ZERO_ADDRESS, {
                from: thirdParty
            }), "!governance");
            await strategy.setGovernance(constants.ZERO_ADDRESS, {
                from: governance
            });
        });

        it(`restricted`, async () => {
            await expectRevert(strategy.setStrategist(constants.ZERO_ADDRESS, {
                from: thirdParty
            }), "Sender must be privileged");
            await strategy.setStrategist(constants.ZERO_ADDRESS, fromStrategist);
            await strategy.setStrategist(constants.ZERO_ADDRESS, {
                from: governance
            });
        });
    });

    async function deployCurve() {
        // Prepare stablecoins stubs
        dai = await ERC20.new({
            from: owner
        });
        await dai.methods['initialize(string,string,uint8,uint256)']('DAI', 'DAI', 18, supplies.dai, {
            from: owner
        });

        usdc = await ERC20.new({
            from: owner
        });
        await usdc.methods['initialize(string,string,uint8,uint256)']('USDC', 'USDC', 6, supplies.usdc, {
            from: owner
        });

        tusd = await ERC20.new({
            from: owner
        });
        await tusd.methods['initialize(string,string,uint8,uint256)']('TUSD', 'TUSD', 6, supplies.dai, {
            from: owner
        });

        usdt = await ERC20.new({
            from: owner
        });
        await usdt.methods['initialize(string,string,uint8,uint256)']('USDT', 'USDT', 18, supplies.dai, {
            from: owner
        });

        //Prepare Y-token wrappers
        ydai = await YERC20.new({
            from: owner
        });
        await ydai.initialize(dai.address, 'yDAI', 18, {
            from: owner
        });
        token = await YERC20.new({
            from: owner
        });
        await token.initialize(usdc.address, 'yUSDC', 6, {
            from: owner
        });
        ytusd = await YERC20.new({
            from: owner
        });
        await ytusd.initialize(tusd.address, 'yTUSD', 6, {
            from: owner
        });
        yusdt = await YERC20.new({
            from: owner
        });
        await yusdt.initialize(usdt.address, 'yUSDT', 18, {
            from: owner
        });


        //Prepare stubs of Curve.Fi
        curveLPToken = await CurveLPToken.new({
            from: owner
        });
        await curveLPToken.methods['initialize()']({
            from: owner
        });

        curveSwap = await CurveSwap.new({
            from: owner
        });
        await curveSwap.initialize(
            [ydai.address, token.address, ytusd.address, yusdt.address],
            [dai.address, usdc.address, tusd.address, usdt.address],
            curveLPToken.address, 10, {
                from: owner
            });
        await curveLPToken.addMinter(curveSwap.address, {
            from: owner
        });

        curveDeposit = await CurveDeposit.new({
            from: owner
        });
        await curveDeposit.initialize(
            [ydai.address, token.address, ytusd.address, yusdt.address],
            [dai.address, usdc.address, tusd.address, usdt.address],
            curveSwap.address, curveLPToken.address, {
                from: owner
            });
        await curveLPToken.addMinter(curveDeposit.address, {
            from: owner
        });

        crvToken = await ERC20.new({
            from: owner
        });
        await crvToken.methods['initialize(string,string,uint8,uint256)']('CRV', 'CRV', 18, 0, {
            from: owner
        });

        curveMinter = await CurveCRVMinter.new({
            from: owner
        });
        await curveMinter.initialize(crvToken.address, {
            from: owner
        });
        await crvToken.addMinter(curveMinter.address, {
            from: owner
        });

        curveGauge = await CurveGauge.new({
            from: owner
        });
        await curveGauge.initialize(curveLPToken.address, curveMinter.address, {
            from: owner
        });
        await crvToken.addMinter(curveGauge.address, {
            from: owner
        });

    }

    async function deployStrategy() {
        await deployCurve();
        controller = await Controller.new(rewards);
        uniswap = await UniswapMock.new();
        vault = await yVault.new(token.address, controller.address);

        strategy = await CRVStrategyYCRV.new(vault.address, token.address, controller.address, governance,strategist,curveGauge.address,curveMinter.address, crvToken.address, curveSwap.address, constants.ZERO_ADDRESS,dai.address,ydai.address,uniswap.address);

        await controller.approveStrategy(vault.address, strategy.address);
        await controller.setStrategy(vault.address, strategy.address);
        await controller.setVault(token.address, vault.address);
    }
});