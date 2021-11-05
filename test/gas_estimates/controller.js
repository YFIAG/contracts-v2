const {
    expect
} = require('chai');
const timeMachine = require('ganache-time-traveler');
const {
    web3
} = require('../../utils/test');
const createGasEstimateDoc = require("../../utils/create_gas_estimate_doc");

const YVault = artifacts.require('yVault');
const Controller = artifacts.require("Controller");
const StrategyStub = artifacts.require("YTestStrategy");
const ERC20Mock = artifacts.require('ERC20Mock');
const OneSplit = artifacts.require('OneSplitAudit');
let gas = {};
gas.Controller = {};

describe('Controller gas estimate', () => {

    let erc20;
    let erc20test;
    let yVault;
    let yVault2;
    let controller;
    let strategyStub;
    let strategyStub2;
    const addr = [];
    let tokenName = "Token";
    let tokenSymbol = "TKN";
    let snapshotId;

    before(async () => {
        [
            addr.sender,
            addr.owner,
            addr.rewards,
            addr.governance,
            addr.arbitrary3,
            addr.otheruser,
            addr.newgovernance,
            addr.newonesplit,
            addr.converter,
        ] = await web3.eth.getAccounts();
        controller = await Controller.new(addr.rewards, {
            from: addr.sender
        });
        erc20 = await ERC20Mock.new(tokenName, tokenSymbol, '1000000', {
            from: addr.sender
        });
        yVault = await YVault.new(erc20.address, controller.address, {
            from: addr.sender
        });
        yVault2 = await YVault.new(erc20.address, controller.address, {
            from: addr.sender
        });
        erc20test = await ERC20Mock.new("TestName", "TTN", '2000000', {
            from: addr.sender
        });

        strategyStub = await StrategyStub.new(erc20.address, controller.address, yVault.address, "name", {
            from: addr.sender
        });
        await controller.approveStrategy(yVault.address, strategyStub.address, {
            from: addr.sender
        });
        await controller.setStrategy(yVault.address, strategyStub.address, {
            from: addr.sender
        });
        await controller.setVault(erc20.address, yVault.address, {
            from: addr.sender
        });

        strategyStub2 = await StrategyStub.new(erc20.address, controller.address, yVault2.address, "name", {
            from: addr.sender
        });
        await controller.approveStrategy(yVault2.address, strategyStub2.address, {
            from: addr.sender
        });
        await controller.setStrategy(yVault2.address, strategyStub2.address, {
            from: addr.sender
        });
        await controller.setVault(erc20.address, yVault2.address, {
            from: addr.sender
        });

        await erc20test.transfer(strategyStub.address, '1000000',{ from: addr.sender });

        let oneslpl = await OneSplit.new({ from: addr.sender });
        await oneslpl.setController(controller.address, { from: addr.sender});
        await controller.setOneSplit(oneslpl.address, { from: addr.sender});
    });

    beforeEach(async () => {
        // Create a snapshot
        const snapshot = await timeMachine.takeSnapshot();
        snapshotId = snapshot['result'];
    });

    afterEach(async () => await timeMachine.revertToSnapshot(snapshotId));

    describe('', () => {

        it('setRewards', async () => {
            gas.Controller.setRewards = await controller.setRewards.estimateGas(addr.arbitrary3, {
                from: addr.sender
            });
            await controller.setRewards(addr.arbitrary3, {
                from: addr.sender
            });
        });

        it('yearn', async () => {
            gas.Controller.yearn = await controller.yearn.estimateGas(yVault.address, erc20test.address, 0, {
                from: addr.sender
            });
        });

    });


    describe('', () => {

        it('setStrategist', async () => {
            gas.Controller.setStrategist = await controller.setStrategist.estimateGas(addr.arbitrary3, {
                from: addr.sender
            });
            await controller.setStrategist(addr.arbitrary3, {
                from: addr.sender
            });
        });

        it('setGovernance', async () => {
            await controller.setStrategist(addr.arbitrary3, {
                from: addr.sender
            });
            gas.Controller.setGovernance = await controller.setGovernance.estimateGas(addr.newgovernance, {
                from: addr.sender
            });

        });

    });
    describe('', () => {

        it('setSplit', async () => {
            gas.Controller.setSplit = await controller.setSplit.estimateGas("1000", {
                from: addr.sender
            });
        });
        it('yearn', async () => {
            await controller.setSplit("1000", {
                from: addr.sender
            });
            gas.Controller.yearn = await controller.yearn.estimateGas(yVault.address, erc20test.address, 0,{
                from: addr.sender
            });
        });

    });

    describe('', () => {

        it('setOneSplit', async () => {
            gas.Controller.setOneSplit = await controller.setOneSplit.estimateGas(addr.newonesplit, {
                from: addr.sender
            });
        });

    });

    describe('', () => {

        it('', async () => {
            await controller.setGovernance(addr.newgovernance, {
                from: addr.sender
            });
            expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());
        });

        it('setGovernance', async () => {
            gas.Controller.setGovernance = await controller.setGovernance.estimateGas(addr.newgovernance, {
                from: addr.sender
            });
        });

    });
    describe('setVault', () => {
        it('', async () => {
            gas.Controller.setVault = await controller.setVault.estimateGas(erc20.address, yVault.address, {
                from: addr.sender
            })
        });
    });

    describe('', () => {
        it('approveStrategy', async () => {
            strategyStub2 = await StrategyStub.new(erc20.address, controller.address, yVault.address, "name", {
                from: addr.sender
            });
            gas.Controller.approveStrategy = await controller.approveStrategy.estimateGas(yVault2.address, strategyStub2.address, {
                from: addr.sender
            });
            await controller.approveStrategy(yVault2.address, strategyStub2.address, {
                from: addr.sender
            });
            gas.Controller.setStrategy = await controller.setStrategy.estimateGas(yVault2.address, strategyStub2.address, {
                from: addr.sender
            });
        });

    });
    describe('revokeStrategy', () => {

        it('', async () => {
            strategyStub2 = await StrategyStub.new(erc20.address, controller.address, yVault.address, "name", {
                from: addr.sender
            });
            await controller.approveStrategy(yVault2.address, strategyStub2.address, {
                from: addr.sender
            });
            await controller.setStrategy(yVault2.address, strategyStub2.address, {
                from: addr.sender
            });
            gas.Controller.revokeStrategy = await controller.revokeStrategy.estimateGas(yVault2.address, strategyStub2.address, {
                from: addr.sender
            });
        });

    });

    describe('', () => {

        it('earn', async () => {
            await erc20.mint(controller.address, 1000);
            gas.Controller.earn = await controller.earn.estimateGas(yVault.address, erc20test.address, 0, {
                from: addr.sender
            });
        });

        it('withdrawAll', async () => {
            gas.Controller.withdrawAll = await controller.withdrawAll.estimateGas(yVault.address, {
                from: addr.sender
            });


        });

    });


    describe('', () => {

        it('inCaseTokensGetStuck', async () => {
            await erc20.mint(controller.address, 1000);
            gas.Controller.inCaseTokensGetStuck = await controller.inCaseTokensGetStuck.estimateGas(erc20.address, 1, {
                from: addr.sender
            });
        });

    });

    describe('', () => {

        it('inCaseStrategyTokenGetStuck', async () => {
            await erc20.mint(controller.address, 1000);
            await controller.earn(yVault.address, erc20test.address, 0, {
                from: addr.sender
            });
            gas.Controller.inCaseStrategyTokenGetStuck = await controller.inCaseStrategyTokenGetStuck.estimateGas(strategyStub.address, erc20.address, {
                from: addr.sender
            });
        });

    });

    describe('Write results', () => {
        it(``, async () => {
            console.dir(gas);
            createGasEstimateDoc(gas);
        });
    });

});