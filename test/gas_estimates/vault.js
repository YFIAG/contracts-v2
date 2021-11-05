const timeMachine = require('ganache-time-traveler');
const bigNumber = require('bignumber.js');
const createGasEstimateDoc = require("../../utils/create_gas_estimate_doc");
const {
    web3
} = require('../../utils/test');

const YVault = artifacts.require('yVault');
const Controller = artifacts.require("Controller");
const StrategyStub = artifacts.require("YTestStrategy");
const ERC20Mock = artifacts.require('ERC20Mock');

describe('Vault gas estimate', () => {

    let erc20;
    let yVault;
    let controller;
    let strategyStub;
    const addr = [];
    let tokenName = "Token";
    let tokenSymbol = "TKN";
    let min = 9000;
    let snapshotId;
    let gas = {};
    gas.ERC20 = {};
    gas.Vault = {};

    before(async () => {
        [
            addr.sender,
            addr.owner,
            addr.rewards,
            addr.governance,
            addr.arbitrary3,
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



    });
    beforeEach(async () => {
        // Create a snapshot
        const snapshot = await timeMachine.takeSnapshot();
        snapshotId = snapshot['result'];
    });

    afterEach(async () => await timeMachine.revertToSnapshot(snapshotId));

    describe('', () => {

        it('', async () => {
            let testdeposit = new bigNumber(10);
            gas.ERC20.approve = await erc20.approve.estimateGas(yVault.address, testdeposit, {
                from: addr.sender
            });
            await erc20.approve(yVault.address, testdeposit, {
                from: addr.sender
            });
            gas.Vault.deposit = await yVault.deposit.estimateGas(testdeposit, {
                from: addr.sender
            });
            await yVault.deposit(testdeposit, {
                from: addr.sender
            });
        });


    });

    describe('', () => {

        it('', async () => {
            await erc20.approve(yVault.address, (await erc20.balanceOf(addr.sender)).toString(), {
                from: addr.sender
            });
            gas.Vault.depositAll = await yVault.depositAll.estimateGas({
                from: addr.sender
            });
            await yVault.depositAll({
                from: addr.sender
            });
        });


    });

    describe('', () => {

        it('', async () => {
            let testdeposit = new bigNumber(10);
            let testwithdraw = new bigNumber(4);
            await erc20.approve(yVault.address, testdeposit, {
                from: addr.sender
            });
            await yVault.deposit(testdeposit, {
                from: addr.sender
            });
            gas.Vault.withdraw = await yVault.withdraw.estimateGas(testwithdraw, {
                from: addr.sender
            });
        });

        it('', async () => {
            let testdeposit = new bigNumber(10);

            await erc20.approve(yVault.address, testdeposit, {
                from: addr.sender
            });
            await yVault.deposit(testdeposit, {
                from: addr.sender
            });
            gas.Vault.withdrawAll = await yVault.withdrawAll.estimateGas({
                from: addr.sender
            });
        });

    });
    describe('', () => {
        it('', async () => {
            gas.Vault.setMin = await yVault.setMin.estimateGas("1");
        });
    });
    describe('', () => {

        it('', async () => {
            gas.Vault.setGovernance = await yVault.setGovernance.estimateGas(addr.governance, {
                from: addr.sender
            });
        });

    });

    describe('', () => {

        it('', async () => {
            gas.Vault.setController = await yVault.setController.estimateGas(controller.address);
        });

    });


    describe('', () => {

        it('', async () => {
            await erc20.mint(yVault.address, 1000);
            gas.Vault.earn = await yVault.earn.estimateGas();
        });

    });

    describe('Write results', () => {
        it(``, async ()=>{
            console.dir(gas);
            createGasEstimateDoc(gas);
        });
    });

});