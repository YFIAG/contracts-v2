const truffleAssert = require('truffle-assertions');
const { expect } = require('chai');
const timeMachine = require('ganache-time-traveler');
const bigNumber = require('bignumber.js');

const {
  constants,
  randomNumber,
  randomAddress,
  web3
} = require('../../utils/test');

const YVault = artifacts.require('yVault');
const Controller = artifacts.require("Controller");
const StrategyStub = artifacts.require("YTestStrategy");
const ERC20Mock = artifacts.require('ERC20Mock');
const OneSplit = artifacts.require('OneSplitAudit');

describe('Basic test (controller)', () => {

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
  let newonesplit;
  let oneslpl;

  before(async() => {
    [
      addr.sender,
      addr.owner,
      addr.rewards,
      addr.governance,
      addr.arbitrary3,
      addr.otheruser,
      addr.newgovernance,
      addr.converter,
    ] = await web3.eth.getAccounts();
    controller = await Controller.new(addr.rewards, { from: addr.sender });
    erc20 = await ERC20Mock.new(tokenName, tokenSymbol, '1000000', { from: addr.sender });
    yVault = await YVault.new(erc20.address, controller.address,{ from: addr.sender });
    yVault2 = await YVault.new(erc20.address, controller.address,{ from: addr.sender });
    erc20test = await ERC20Mock.new("TestName", "TTN", '2000000', { from: addr.sender });
    strategyStub = await StrategyStub.new(erc20.address, controller.address, yVault.address, "name", { from: addr.sender });
    await controller.approveStrategy(yVault.address, strategyStub.address, { from: addr.sender });
    await controller.setStrategy(yVault.address, strategyStub.address, { from: addr.sender });
    await controller.setVault(erc20.address,yVault.address,{ from: addr.sender });
    await erc20test.transfer(strategyStub.address, '1000000',{ from: addr.sender });

    oneslpl = await OneSplit.new({ from: addr.sender });
    await oneslpl.setController(controller.address, { from: addr.sender});
    await controller.setOneSplit(oneslpl.address, { from: addr.sender});

    newonesplit = await OneSplit.new({ from: addr.sender });
    await newonesplit.setController(controller.address, { from: addr.sender});

  });

  beforeEach(async() => {
    // Create a snapshot
    const snapshot = await timeMachine.takeSnapshot();
    snapshotId = snapshot['result'];
  });

  afterEach(async() => await timeMachine.revertToSnapshot(snapshotId));

  describe('Constructor test', () => {

    it('Rewards work', async() => {
        expect((await controller.rewards()).toString()).to.equal(addr.rewards.toString());
      });
    it('Strategist work', async() => {
        expect((await controller.strategist()).toString()).to.equal(addr.sender.toString());
    });

  });

  describe('setOneSplit test', () => {

    it('setOneSplit work', async() => {
        await controller.setOneSplit(newonesplit.address, { from: addr.sender});
        expect((await controller.onesplit()).toString()).to.equal(newonesplit.address);
    });
  });

  describe('setSplit test', () => {

    it('setSplit work', async() => {
        await controller.setSplit("1000", { from: addr.sender});
        expect((await controller.split()).toString()).to.equal("1000");
    });
  });

  describe('setRewards test', () => {

    it('setRewards work', async() => {
      await controller.setRewards(addr.arbitrary3, { from: addr.sender});
      expect((await controller.rewards()).toString()).to.equal(addr.arbitrary3.toString());
    });
  });


    describe('setStrategist test', () => {

        it('setStrategist work', async() => {
            await controller.setStrategist(addr.arbitrary3, { from: addr.sender});
            expect((await controller.strategist({ from: addr.sender})).toString()).to.equal(addr.arbitrary3.toString());
        });

        it('setVault work after setStrategist', async() => {
            await controller.setStrategist(addr.arbitrary3, { from: addr.sender});
            expect((await controller.strategist()).toString()).to.equal(addr.arbitrary3.toString());
            await controller.setGovernance(addr.newgovernance, { from: addr.sender});
            expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());

            await truffleAssert.reverts(
                controller.setVault(erc20test.address, yVault.address, { from: addr.sender}),
            'Not a governance or strategist'
            );
            await truffleAssert.reverts(
                controller.setVault(erc20test.address, yVault.address, { from: addr.governance}),
            'Not a governance or strategist'
            );

        });

    });

    describe('setGovernance test', () => {

        it('setGovernance work', async() => {
            await controller.setGovernance(addr.newgovernance, { from: addr.sender});
            expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());
        });

        it('setRewards work', async() => {
            await controller.setGovernance(addr.newgovernance, { from: addr.sender});
            expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());
            await truffleAssert.reverts(
                controller.setRewards(addr.arbitrary3, { from: addr.sender}),
            'Not the governance'
            );
        });

        it('setSplit work', async() => {
            await controller.setGovernance(addr.newgovernance, { from: addr.sender});
            expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());
            await truffleAssert.reverts(
                controller.setSplit("1000", { from: addr.sender}),
            'Not the governance'
            );
        });

        it('setGovernance work', async() => {
            await controller.setGovernance(addr.newgovernance, { from: addr.sender});
            expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());
            await truffleAssert.reverts(
                controller.setGovernance(addr.governance, { from: addr.sender}),
            'Not the governance'
            );
        });

        it('setVault work', async() => {
            await controller.setStrategist(addr.arbitrary3, { from: addr.sender});
            expect((await controller.strategist()).toString()).to.equal(addr.arbitrary3.toString());
            await controller.setGovernance(addr.newgovernance, { from: addr.sender});
            expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());

            await truffleAssert.reverts(
                controller.setVault(erc20test.address, yVault.address, { from: addr.sender}),
            'Not a governance or strategist'
            );
            await truffleAssert.reverts(
                controller.setVault(erc20test.address, yVault.address, { from: addr.governance}),
            'Not a governance or strategist'
            );
        });
        it('approveStrategy work', async() => {
            await controller.setGovernance(addr.newgovernance, { from: addr.sender});
            expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());
            await truffleAssert.reverts(
                controller.approveStrategy(erc20.address, strategyStub.address, { from: addr.sender }),
            'Not the governance'
            );
        });

        it('revokeStrategy work', async() => {
            await controller.setGovernance(addr.newgovernance, { from: addr.sender});
            expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());
            await truffleAssert.reverts(
                controller.revokeStrategy(erc20.address, strategyStub.address, { from: addr.sender }),
            'Not the governance'
            );
        });
        //@vitalii under these conditions it is useless and never used - need to delete
        // it('setConverter work', async() => {
        //     await controller.setStrategist(addr.arbitrary3, { from: addr.sender});
        //     expect((await controller.strategist()).toString()).to.equal(addr.arbitrary3.toString());
        //     await controller.setGovernance(addr.newgovernance, { from: addr.sender});
        //     expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());
        //     await truffleAssert.reverts(
        //         controller.setConverter(erc20.address, yVault.address, addr.arbitrary3, { from: addr.sender }),
        //     '!strategist'
        //     );
        // });
        it('setStrategy work', async() => {
            await controller.setStrategist(addr.arbitrary3, { from: addr.sender});
            expect((await controller.strategist()).toString()).to.equal(addr.arbitrary3.toString());
            await controller.setGovernance(addr.newgovernance, { from: addr.sender});
            expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());
            await truffleAssert.reverts(
                controller.setStrategy(yVault.address, strategyStub.address, { from: addr.sender }),
            'Not a governance or strategist'
            );
        });
        it('withdrawAll work', async() => {
            await controller.setStrategist(addr.arbitrary3, { from: addr.sender});
            expect((await controller.strategist()).toString()).to.equal(addr.arbitrary3.toString());
            await controller.setGovernance(addr.newgovernance, { from: addr.sender});
            expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());
            await truffleAssert.reverts(
                controller.withdrawAll(erc20.address, { from: addr.sender }),
            'Not a governance or strategist'
            );
        });
        it('inCaseTokensGetStuck work', async() => {
            await controller.setStrategist(addr.arbitrary3, { from: addr.sender});
            expect((await controller.strategist()).toString()).to.equal(addr.arbitrary3.toString());
            await controller.setGovernance(addr.newgovernance, { from: addr.sender});
            expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());
            await truffleAssert.reverts(
                controller.inCaseTokensGetStuck(erc20.address, "1", { from: addr.sender }),
            'Not a governance or strategist'
            );
        });
        it('inCaseStrategyTokenGetStuck work', async() => {
            await controller.setStrategist(addr.arbitrary3, { from: addr.sender});
            expect((await controller.strategist()).toString()).to.equal(addr.arbitrary3.toString());
            await controller.setGovernance(addr.newgovernance, { from: addr.sender});
            expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());
            await truffleAssert.reverts(
                controller.inCaseStrategyTokenGetStuck(strategyStub.address ,erc20.address, { from: addr.sender }),
            'Not a governance or strategist'
            );
        });
        it('yearn work', async() => {
            await controller.setStrategist(addr.arbitrary3, { from: addr.sender});
            expect((await controller.strategist()).toString()).to.equal(addr.arbitrary3.toString());
            await controller.setGovernance(addr.newgovernance, { from: addr.sender});
            expect((await controller.governance()).toString()).to.equal(addr.newgovernance.toString());
            await truffleAssert.reverts(
                controller.yearn(yVault.address, erc20test.address, 0,{ from: addr.sender}),
            'Not a governance or strategist'
            );
        });

    });
    describe('setVault test', () => {

        it('setVault work', async() => {
            await controller.setVault(erc20.address, yVault.address, { from: addr.sender})
            expect((await controller.tokens(yVault.address)).toString()).to.equal(erc20.address.toString());
        });

        it('withdraw work', async() => {
            await controller.setVault(erc20test.address, yVault.address, { from: addr.sender})
            expect((await controller.tokens(yVault.address)).toString()).to.equal(erc20test.address.toString());
            await truffleAssert.reverts(
                controller.withdraw(1, { from: addr.sender }),
            'Caller is not a vault'
            );
        });

    });
    describe('approveStrategy test', () => {

        it('approveStrategy and setStrategy work', async() => {
            strategyStub2 = await StrategyStub.new(erc20.address, controller.address, yVault.address, "name", { from: addr.sender });
            await truffleAssert.reverts(
                controller.setStrategy(yVault.address, strategyStub2.address, { from: addr.sender }),
            '!approved'
            );
            await controller.approveStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            await controller.setStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            expect((await controller.strategies(yVault2.address)).toString()).to.equal(strategyStub2.address.toString());
        });

    });
    describe('revokeStrategy test', () => {

        it('setStrategy, approveStrategy and revokeStrategy work', async() => {
            strategyStub2 = await StrategyStub.new(erc20.address, controller.address,yVault.address, "name", { from: addr.sender });
            await controller.approveStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            await controller.setStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            expect((await controller.strategies(yVault2.address)).toString()).to.equal(strategyStub2.address.toString());
            await controller.revokeStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            await truffleAssert.reverts(
                controller.setStrategy(yVault2.address, strategyStub2.address, { from: addr.sender }),
            '!approved'
            );
        });

    });

    describe('setStrategy test', () => {

        it('setStrategy work', async() => {
            strategyStub2 = await StrategyStub.new(erc20.address, controller.address,yVault.address, "name", { from: addr.sender });
            await controller.approveStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            await controller.setStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            expect((await controller.strategies(yVault2.address)).toString()).to.equal(strategyStub2.address.toString());
            await controller.approveStrategy(yVault.address, strategyStub2.address, { from: addr.sender });
            await controller.setStrategy(yVault.address, strategyStub2.address, { from: addr.sender });
        });

        it('earn work', async() => {
            strategyStub2 = await StrategyStub.new(erc20.address, controller.address,yVault.address, "name", { from: addr.sender });
            await controller.approveStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            await controller.setStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            expect((await controller.strategies(yVault2.address)).toString()).to.equal(strategyStub2.address.toString());
            await controller.approveStrategy(yVault.address, strategyStub2.address, { from: addr.sender });
            await controller.setStrategy(yVault.address, strategyStub2.address, { from: addr.sender });

            await erc20.mint(controller.address, 1000);
            expect((await erc20.balanceOf(controller.address)).toString()).to.equal("1000");
            await controller.earn(yVault.address, erc20.address, 10,{ from: addr.sender});
            expect((await erc20.balanceOf(controller.address)).toString()).to.equal("990");
            expect((await erc20.balanceOf(strategyStub2.address)).toString()).to.equal("10");
        });

        it('balanceOf work', async() => {
            strategyStub2 = await StrategyStub.new(erc20.address, controller.address,yVault.address, "name", { from: addr.sender });
            await controller.approveStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            await controller.setStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            expect((await controller.strategies(yVault2.address)).toString()).to.equal(strategyStub2.address.toString());
            await controller.approveStrategy(yVault.address, strategyStub2.address, { from: addr.sender });
            await controller.setStrategy(yVault.address, strategyStub2.address, { from: addr.sender });

            await erc20.mint(controller.address, 1000);
            expect((await erc20.balanceOf(controller.address)).toString()).to.equal("1000");
            await controller.earn(yVault.address, erc20.address, 10,{ from: addr.sender});
            expect((await erc20.balanceOf(controller.address)).toString()).to.equal("990");
            expect((await erc20.balanceOf(strategyStub2.address)).toString()).to.equal("10");

            expect((await controller.balanceOf(yVault.address, { from: addr.sender })).toString()).to.equal("10");
        });

        it('withdrawAll work', async() => {
            strategyStub2 = await StrategyStub.new(erc20.address, controller.address,yVault.address, "name", { from: addr.sender });
            await controller.approveStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            await controller.setStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            expect((await controller.strategies(yVault2.address)).toString()).to.equal(strategyStub2.address.toString());
            await controller.approveStrategy(yVault.address, strategyStub2.address, { from: addr.sender });
            await controller.setStrategy(yVault.address, strategyStub2.address, { from: addr.sender });
            expect((await erc20.balanceOf(yVault.address)).toString()).to.equal("1000");//here 1000 because of withdraw with set strategy
            await controller.withdrawAll(yVault.address, { from: addr.sender});
            expect((await erc20.balanceOf(yVault.address)).toString()).to.equal("2000");

        });

        it('withdrawAll work whith bal != 0', async() => {
            strategyStub2 = await StrategyStub.new(erc20.address, controller.address,yVault.address, "name", { from: addr.sender });
            await controller.approveStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            await controller.setStrategy(yVault2.address, strategyStub2.address, { from: addr.sender });
            expect((await controller.strategies(yVault2.address)).toString()).to.equal(strategyStub2.address.toString());
            await controller.approveStrategy(yVault.address, strategyStub2.address, { from: addr.sender });
            await controller.setStrategy(yVault.address, strategyStub2.address, { from: addr.sender });

            await erc20.mint(controller.address, 1000);
            expect((await erc20.balanceOf(controller.address)).toString()).to.equal("1000");
            await controller.earn(yVault.address, erc20.address, 10,{ from: addr.sender});
            expect((await erc20.balanceOf(controller.address)).toString()).to.equal("990");
            expect((await erc20.balanceOf(strategyStub2.address)).toString()).to.equal("10");

            expect((await controller.balanceOf(yVault.address, { from: addr.sender })).toString()).to.equal("10");

            await controller.withdrawAll(yVault.address, { from: addr.sender});
            expect((await erc20.balanceOf(yVault.address)).toString()).to.equal("2010");
        });

    });

    describe('earn test', () => {

        it('earn work', async() => {
            await erc20.mint(controller.address, 1000);
            expect((await erc20.balanceOf(controller.address)).toString()).to.equal("1000");
            await controller.earn(yVault.address, erc20.address, 10,{ from: addr.sender});
            expect((await erc20.balanceOf(controller.address)).toString()).to.equal("990");
            expect((await erc20.balanceOf(strategyStub.address)).toString()).to.equal("10");
        });
    });

    describe('balanceOf test', () => {

        it('balanceOf work', async() => {
            await erc20.mint(controller.address, 1000);
            expect((await erc20.balanceOf(controller.address)).toString()).to.equal("1000");
            await controller.earn(yVault.address, erc20.address, 10,{ from: addr.sender});
            expect((await erc20.balanceOf(controller.address)).toString()).to.equal("990");
            expect((await erc20.balanceOf(strategyStub.address)).toString()).to.equal("10");
            expect((await controller.balanceOf(yVault.address, { from: addr.sender })).toString()).to.equal("10");
        });

    });

    describe('withdrawAll test', () => {

        it('withdrawAll work', async() => {
            await erc20.mint(controller.address, 1000);
            expect((await erc20.balanceOf(controller.address)).toString()).to.equal("1000");
            await controller.earn(yVault.address, erc20.address, 10,{ from: addr.sender});
            expect((await erc20.balanceOf(controller.address)).toString()).to.equal("990");
            expect((await erc20.balanceOf(strategyStub.address)).toString()).to.equal("10");

            expect((await controller.balanceOf(yVault.address, { from: addr.sender })).toString()).to.equal("10");

            await controller.withdrawAll(yVault.address, { from: addr.sender});
            expect((await erc20.balanceOf(yVault.address)).toString()).to.equal("1010");
        });

    });

    describe('inCaseTokensGetStuck test', () => {

        it('inCaseTokensGetStuck work', async() => {
            await erc20.mint(controller.address, 1000);
            await controller.inCaseTokensGetStuck(erc20.address, 1, { from: addr.sender});
            expect((await erc20.balanceOf(addr.sender)).toString()).to.equal("1000001");
        });

    });

    describe('inCaseStrategyTokenGetStuck test', () => {

        it('inCaseStrategyTokenGetStuck work', async() => {
            await erc20.mint(controller.address, 1000);
            expect((await erc20.balanceOf(controller.address)).toString()).to.equal("1000");
            await controller.earn(yVault.address, erc20.address, 10,{ from: addr.sender});
            expect((await erc20.balanceOf(controller.address)).toString()).to.equal("990");
            expect((await erc20.balanceOf(strategyStub.address)).toString()).to.equal("10");
            expect((await controller.balanceOf(yVault.address, { from: addr.sender })).toString()).to.equal("10");

            await controller.inCaseStrategyTokenGetStuck(strategyStub.address, erc20.address, { from: addr.sender});
            expect((await erc20.balanceOf(yVault.address)).toString()).to.equal("1010");
        });

    });
    describe('withdraw test', () => {

        it('withdraw work', async() => {
            await truffleAssert.reverts(
                controller.withdraw( 0, { from: addr.sender }),
            'Caller is not a vault'
            );
        });

    });

    describe('yearn test', () => {

        it('yearn work', async() => {
            console.log((await erc20test.balanceOf(controller.address)).toString());
            const one = await OneSplit.new({ from: addr.sender });
            await erc20test.mint(strategyStub.address,1000,{ from: addr.sender });
            // await one.swap(erc20test.address, erc20.address, 10, 0, {}, 0);
            await controller.setOneSplit(one.address);
            await one.setController(controller.address);
            await controller.yearn(yVault.address, erc20test.address, 1, { from: addr.sender });
            console.log((await erc20test.balanceOf(controller.address)).toString());
            console.log((await erc20.balanceOf(controller.address)).toString());

        });

    });



});

