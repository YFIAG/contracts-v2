const truffleAssert = require('truffle-assertions');
const { expect } = require('chai');
const timeMachine = require('ganache-time-traveler');
const { default: BigNumber } = require('bignumber.js');
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
const YVault = artifacts.require('yVault');
const Controller = artifacts.require("Controller");
const StrategyStub = artifacts.require("YTestStrategy");
const ERC20Mock = artifacts.require('ERC20Mock');

describe('yVault: getPricePerFullShare', () => {
    let erc20, yVault, controller, strategyStub;
    let deployer, user, rewards;
    let snapshotId;
    before(async () => {
        [
            deployer, user, rewards
        ] = await web3.eth.getAccounts();
        erc20 = await ERC20Mock.new('Token', 'TT', '1000000', {
            from: deployer
        });
        controller = await Controller.new(rewards, {
            from: deployer
          });
        yVault = await YVault.new(erc20.address, controller.address, {
            from: deployer
        });
        strategyStub = await StrategyStub.new(erc20.address, controller.address, yVault.address, "name", {
            from: deployer
        });
        await controller.approveStrategy(yVault.address, strategyStub.address, {
            from: deployer
        });
        await controller.setStrategy(yVault.address, strategyStub.address, {
            from: deployer
        });
        await controller.setVault(erc20.address, yVault.address, {
            from: deployer
        });
    });

    beforeEach(async () => {
    // Create a snapshot
    const snapshot = await timeMachine.takeSnapshot();
    snapshotId = snapshot['result'];
    });
    
    afterEach(async () => await timeMachine.revertToSnapshot(snapshotId));

    describe('Test', () => {
        it('GetPricePerFullShare works normally if deposited before', async () => {
            let amount = '1000000000000000000';
            await erc20.mint(user, amount, {from: deployer});
            erc20.approve(yVault.address, amount, {from: user});

            console.log('Before deposit: ', (await yVault.balance()).toString());
            yVault.deposit(amount, {from: user});
            console.log('After deposit: ', (await yVault.balance()).toString());

            expect((await yVault.balanceOf(user)).toString())
                .to.equal(amount);
            expect((await yVault.getPricePerFullShare()).toString())
                .to.equal('1000000000000000000');
        });

        it('GetPricePerFullshare reverts if not deposited before(totalSupply = 0)', async () => {
            await truffleAssert.reverts(
                yVault.getPricePerFullShare(),
                "SafeMath: division by zero"
            );
        });
    });   
});