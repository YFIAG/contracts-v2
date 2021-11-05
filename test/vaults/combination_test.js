const truffleAssert = require('truffle-assertions');
const {
  expect
} = require('chai');
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

describe('Сombination test (vaults)', () => {

  let erc20;
  let yVault;
  let controller;
  let strategyStub;
  const addr = [];
  let tokenName = "Token";
  let tokenSymbol = "TKN";
  let min = 9000;
  let snapshotId;

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

  describe('Deposit test', () => {

    it('Deposit work', async () => {
      let testdeposit = new bigNumber(10);
      let def_balance_sender = new bigNumber(await erc20.balanceOf(addr.sender));
      let def_yVault_balance = new bigNumber(await yVault.balance());
      let def_yVault_balance_erc = new bigNumber(await erc20.balanceOf(yVault.address));
      await erc20.approve(yVault.address, testdeposit, {
        from: addr.sender
      });
      await yVault.deposit(testdeposit, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(testdeposit)).toString());
      expect((await yVault.balance()).toString()).to.equal((def_yVault_balance.plus(testdeposit)).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_yVault_balance_erc.plus(testdeposit)).toString());
    });

    it('Deposit work if totalSuply != 0', async () => {
      let testdeposit = new bigNumber(10);
      let def_balance_sender = new bigNumber(await erc20.balanceOf(addr.sender));
      let def_yVault_balance = new bigNumber(await yVault.balance());
      let def_yVault_balance_erc = new bigNumber(await erc20.balanceOf(yVault.address));
      await erc20.approve(yVault.address, testdeposit, {
        from: addr.sender
      });
      await yVault.deposit(testdeposit, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(testdeposit)).toString());
      expect((await yVault.balance()).toString()).to.equal((def_yVault_balance.plus(testdeposit)).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_yVault_balance_erc.plus(testdeposit)).toString());

      await erc20.approve(yVault.address, testdeposit, {
        from: addr.sender
      });
      await yVault.deposit(testdeposit, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(testdeposit).minus(testdeposit)).toString());
      expect((await yVault.balance()).toString()).to.equal((def_yVault_balance.plus(testdeposit).plus(testdeposit)).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_yVault_balance_erc.plus(testdeposit).plus(testdeposit)).toString());
    });

    it('Deposit 0 ecr20', async () => {
      let testdeposit = new bigNumber(0);
      let def_balance_sender = new bigNumber(await erc20.balanceOf(addr.sender));
      let def_yVault_balance = new bigNumber(await yVault.balance());
      let def_yVault_balance_erc = new bigNumber(await erc20.balanceOf(yVault.address));
      await erc20.approve(yVault.address, testdeposit, {
        from: addr.sender
      });
      await yVault.deposit(testdeposit, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(testdeposit)).toString());
      expect((await yVault.balance()).toString()).to.equal((def_yVault_balance.plus(testdeposit)).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_yVault_balance_erc.plus(testdeposit)).toString());
    });

    it('Deposit 0 ecr20 if not approve', async () => {
      let testdeposit = new bigNumber(0);
      let def_balance_sender = new bigNumber(await erc20.balanceOf(addr.sender));
      let def_yVault_balance = new bigNumber(await yVault.balance());
      let def_yVault_balance_erc = new bigNumber(await erc20.balanceOf(yVault.address));

      await yVault.deposit(testdeposit, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(testdeposit)).toString());
      expect((await yVault.balance()).toString()).to.equal((def_yVault_balance.plus(testdeposit)).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_yVault_balance_erc.plus(testdeposit)).toString());
    });

    it('Deposit in depositAll', async () => {
      let def_balance_sender = new bigNumber(await erc20.balanceOf(addr.sender));
      await erc20.approve(yVault.address, (await erc20.balanceOf(addr.sender)).toString(), {
        from: addr.sender
      });
      await yVault.depositAll({
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal("0");
      expect((await yVault.balance()).toString()).to.equal((def_balance_sender).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_balance_sender).toString());
    });

  });

  describe('DepositAll test', () => {

    it('DepositAll work', async () => {
      let def_balance_sender = new bigNumber(await erc20.balanceOf(addr.sender));
      await erc20.approve(yVault.address, (await erc20.balanceOf(addr.sender)).toString(), {
        from: addr.sender
      });
      await yVault.depositAll({
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal("0");
      expect((await yVault.balance()).toString()).to.equal((def_balance_sender).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_balance_sender).toString());
    });

    it('DepositAll if 0 erc20', async () => {
      let def_balance_sender = new bigNumber(await erc20.balanceOf(addr.arbitrary3));
      await erc20.approve(yVault.address, (await erc20.balanceOf(addr.arbitrary3)).toString(), {
        from: addr.sender
      });
      await yVault.depositAll({
        from: addr.arbitrary3
      });
      expect((await erc20.balanceOf(addr.arbitrary3)).toString()).to.equal("0");
      expect((await yVault.balance()).toString()).to.equal((def_balance_sender).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_balance_sender).toString());
    });

    it('DepositAll if 0 erc20 and not approve', async () => {
      let def_balance_sender = new bigNumber(await erc20.balanceOf(addr.arbitrary3));
      await yVault.depositAll({
        from: addr.arbitrary3
      });
      expect((await erc20.balanceOf(addr.arbitrary3)).toString()).to.equal("0");
      expect((await yVault.balance()).toString()).to.equal((def_balance_sender).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_balance_sender).toString());
    });

  });

  describe('Withdraw test', () => {

    it('Withdraw work', async () => {
      let testdeposit = new bigNumber(10);
      let testwithdraw = new bigNumber(4);
      let test_fin_bal = testdeposit.minus(testwithdraw);
      let def_balance_sender = new bigNumber(await erc20.balanceOf(addr.sender));
      let def_yVault_balance = new bigNumber(await yVault.balance());
      let def_yVault_balance_erc = new bigNumber(await erc20.balanceOf(yVault.address));

      await erc20.approve(yVault.address, testdeposit, {
        from: addr.sender
      });
      await yVault.deposit(testdeposit, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(testdeposit)).toString());
      expect((await yVault.balance()).toString()).to.equal((def_yVault_balance.plus(testdeposit)).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_yVault_balance_erc.plus(testdeposit)).toString());

      await yVault.withdraw(testwithdraw, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(test_fin_bal)).toString());
      expect((await yVault.balance()).toString()).to.equal((test_fin_bal).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((test_fin_bal).toString());

    });

    it('Withdraw work balance < _shares', async () => {
      let testdeposit = new bigNumber(1000);
      let testwithdraw = new bigNumber(1000);
      let test_fin_bal = testdeposit.minus(testwithdraw);
      let def_balance_sender = new bigNumber(await erc20.balanceOf(addr.sender));
      let def_yVault_balance = new bigNumber(await yVault.balance());
      let def_yVault_balance_erc = new bigNumber(await erc20.balanceOf(yVault.address));

      await erc20.approve(yVault.address, testdeposit, {
        from: addr.sender
      });
      await yVault.deposit(testdeposit, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(testdeposit)).toString());
      expect((await yVault.balance()).toString()).to.equal((def_yVault_balance.plus(testdeposit)).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_yVault_balance_erc.plus(testdeposit)).toString());
      await yVault.earn({
        from: addr.sender
      });
      expect((await erc20.balanceOf(controller.address)).toString()).to.equal("0");
      expect((await erc20.balanceOf(strategyStub.address)).toString()).to.equal("950");
      expect((await controller.balanceOf(yVault.address, {
        from: addr.sender
      })).toString()).to.equal("950");

      await yVault.withdraw(testwithdraw, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(test_fin_bal)).toString());
      expect((await yVault.balance()).toString()).to.equal((test_fin_bal).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((test_fin_bal).toString());

    });

    it('WithdrawAll work', async () => {
      let testdeposit = new bigNumber(10);
      let def_balance_sender = new bigNumber(await erc20.balanceOf(addr.sender));
      let def_yVault_balance = new bigNumber(await yVault.balance());
      let def_yVault_balance_erc = new bigNumber(await erc20.balanceOf(yVault.address));

      await erc20.approve(yVault.address, testdeposit, {
        from: addr.sender
      });
      await yVault.deposit(testdeposit, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(testdeposit)).toString());
      expect((await yVault.balance()).toString()).to.equal((def_yVault_balance.plus(testdeposit)).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_yVault_balance_erc.plus(testdeposit)).toString());

      await yVault.withdrawAll({
        from: addr.sender
      });

      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender).toString());
      expect((await yVault.balance()).toString()).to.equal((def_yVault_balance).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_yVault_balance_erc).toString());

    });

  });
  describe('Balance test', () => {

    it('Vault balance is 0', async () => {
      let a = await yVault.balance();
      expect(a.toString()).to.equal("0");
    });

    it('Deposit and balance', async () => {
      let testdeposit = new bigNumber(10);
      let def_balance_sender = new bigNumber(await erc20.balanceOf(addr.sender));
      let def_yVault_balance = new bigNumber(await yVault.balance());
      let def_yVault_balance_erc = new bigNumber(await erc20.balanceOf(yVault.address));

      await erc20.approve(yVault.address, testdeposit, {
        from: addr.sender
      });
      await yVault.deposit(testdeposit, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(testdeposit)).toString());
      expect((await yVault.balance()).toString()).to.equal((def_yVault_balance.plus(testdeposit)).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_yVault_balance_erc.plus(testdeposit)).toString());

      expect((await yVault.balance()).toString()).to.equal("10");

    });

    it('Balance in withdraw', async () => {
      let testdeposit = new bigNumber(10);
      let testwithdraw = new bigNumber(4);
      let test_fin_bal = testdeposit.minus(testwithdraw);
      let def_balance_sender = new bigNumber(await erc20.balanceOf(addr.sender));
      let def_yVault_balance = new bigNumber(await yVault.balance());
      let def_yVault_balance_erc = new bigNumber(await erc20.balanceOf(yVault.address));

      await erc20.approve(yVault.address, testdeposit, {
        from: addr.sender
      });
      await yVault.deposit(testdeposit, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(testdeposit)).toString());
      expect((await yVault.balance()).toString()).to.equal((def_yVault_balance.plus(testdeposit)).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_yVault_balance_erc.plus(testdeposit)).toString());

      await yVault.withdraw(testwithdraw, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(test_fin_bal)).toString());
      expect((await yVault.balance()).toString()).to.equal((test_fin_bal).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((test_fin_bal).toString());

    });

  });
  describe('setMin test', () => {
    it('Setter setMin', async () => {
      await yVault.setMin(min);
      expect(((await yVault.min()).toString())).to.equal(min.toString());

    });
    it('Available after setMin', async () => {
      await yVault.setMin(min);
      expect(((await yVault.min()).toString())).to.equal(min.toString());
      let testdeposit = new bigNumber(10);
      await erc20.approve(yVault.address, testdeposit, {
        from: addr.sender
      });
      await yVault.deposit(testdeposit, {
        from: addr.sender
      });
      let x = bigNumber(await erc20.balanceOf(yVault.address));
      x = x.multipliedBy(await yVault.min());
      x = x.idiv(await yVault.MAX());
      expect((await yVault.available()).toString()).to.equal(x.toString());
    });
  });
  describe('setGovernance test', () => {

    it('Setter setGovernance', async () => {
      await yVault.setGovernance(addr.governance, {
        from: addr.sender
      });
      expect((await yVault.governance()).toString()).to.equal(addr.governance.toString());
    });
    it('setMin after setGovernance', async () => {
      await yVault.setGovernance(addr.governance, {
        from: addr.sender
      });
      expect((await yVault.governance()).toString()).to.equal(addr.governance.toString());
      await truffleAssert.reverts(
        yVault.setMin(min, {
          from: addr.sender
        }),
        'Not the governance'
      );
    });
    it('setGovernance after setGovernance', async () => {
      await yVault.setGovernance(addr.governance, {
        from: addr.sender
      });
      expect((await yVault.governance()).toString()).to.equal(addr.governance.toString());
      await truffleAssert.reverts(
        yVault.setGovernance(addr.sender, {
          from: addr.sender
        }),
        'Not the governance'
      );
    });
    it('setController after setGovernance', async () => {
      await yVault.setGovernance(addr.governance, {
        from: addr.sender
      });
      expect((await yVault.governance()).toString()).to.equal(addr.governance.toString());
      await truffleAssert.reverts(
        yVault.setController(controller.address, {
          from: addr.sender
        }),
        'Not the governance'
      );
    });
    it('pause and unpause after setGovernance', async () => {
      await yVault.setGovernance(addr.governance, {
        from: addr.sender
      });
      expect((await yVault.governance()).toString()).to.equal(addr.governance.toString());
      await truffleAssert.reverts(
        yVault.pause({
          from: addr.sender
        }),
        'Not the governance'
      );
      yVault.pause({
        from: addr.governance
      });
      await truffleAssert.reverts(
        yVault.unpause({
          from: addr.sender
        }),
        'Not the governance'
      );
    });

  });

  describe('setController test', () => {

    it('Setter setController', async () => {
      await yVault.setController(controller.address);
      expect((await yVault.controller()).toString()).to.equal(controller.address.toString());
    });

    it('Withdraw after setController', async () => {

      await yVault.setController(controller.address);
      expect((await yVault.controller()).toString()).to.equal(controller.address.toString());

      let testdeposit = new bigNumber(10);
      let testwithdraw = new bigNumber(4);
      let test_fin_bal = testdeposit.minus(testwithdraw);
      let def_balance_sender = new bigNumber(await erc20.balanceOf(addr.sender));
      let def_yVault_balance = new bigNumber(await yVault.balance());
      let def_yVault_balance_erc = new bigNumber(await erc20.balanceOf(yVault.address));

      await erc20.approve(yVault.address, testdeposit, {
        from: addr.sender
      });
      await yVault.deposit(testdeposit, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(testdeposit)).toString());
      expect((await yVault.balance()).toString()).to.equal((def_yVault_balance.plus(testdeposit)).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((def_yVault_balance_erc.plus(testdeposit)).toString());

      await yVault.withdraw(testwithdraw, {
        from: addr.sender
      });
      expect((await erc20.balanceOf(addr.sender)).toString()).to.equal((def_balance_sender.minus(test_fin_bal)).toString());
      expect((await yVault.balance()).toString()).to.equal((test_fin_bal).toString());
      expect((await erc20.balanceOf(yVault.address)).toString()).to.equal((test_fin_bal).toString());

    });
  });

  describe('Available test', () => {

    it('ERC20-standart available', async () => {
      let testdeposit = new bigNumber(10);
      await erc20.approve(yVault.address, testdeposit, {
        from: addr.sender
      });
      await yVault.deposit(testdeposit, {
        from: addr.sender
      });
      let x = bigNumber(await erc20.balanceOf(yVault.address));
      x = x.multipliedBy(await yVault.min());
      x = x.idiv(await yVault.MAX());
      expect((await yVault.available()).toString()).to.equal(x.toString());
    });

  });

  describe('getPricePerFullShare', () => {

    it('Getter getPricePerFullShare', async () => {
      let testdeposit = new bigNumber(10);
      await erc20.approve(yVault.address, testdeposit, {
        from: addr.sender
      });
      await yVault.deposit(testdeposit, {
        from: addr.sender
      });
      let x = bigNumber(await yVault.balance());
      x = x.multipliedBy('1e+18');
      x = x.idiv(await yVault.totalSupply());
      expect((await yVault.getPricePerFullShare()).toString()).to.equal(x.toString());
    });

  });
  describe('Constructor test', () => {

    it('Define Addresses(constructors)', async () => {
      expect((await controller.rewards()).toString()).to.equal(addr.rewards.toString());
    });

    it('Define Governance(constructors)', async () => {
      expect((await yVault.governance()).toString()).to.equal(addr.sender.toString());
    });

    it('Define UI Stuff(constructors)', async () => {
      expect((await erc20.name()).toString()).to.equal(tokenName);
      expect((await erc20.symbol()).toString()).to.equal(tokenSymbol);
    });

  });
  describe('Harvest test', () => {

    it('Harvest work', async () => {

      let testdeposit = new bigNumber(9700);
      await erc20.approve(yVault.address, testdeposit, {
        from: addr.sender
      });
      await yVault.deposit(testdeposit, {
        from: addr.sender
      });


      // console.log((await erc20.safeTransfer(controller.address,"10", { from: addr.sender})).toString());

      // await erc20.balanceOf(controller.address);
    });
  });

  describe('Earn test', () => {

    it('Earn work', async () => {
      await erc20.mint(yVault.address, 1000);
      await yVault.earn();
      expect((await erc20.balanceOf(controller.address)).toString()).to.equal("0");
      expect((await erc20.balanceOf(strategyStub.address)).toString()).to.equal("950");
      expect((await controller.balanceOf(yVault.address, {
        from: addr.sender
      })).toString()).to.equal("950");
    });

  });

  describe('Pause test', () => {

    it('pause work', async () => {
      await yVault.pause({
        from: addr.sender
      });
      await truffleAssert.reverts(
        yVault.pause({
          from: addr.sender
        }),
        'Pausable: paused'
      );
      await truffleAssert.reverts(
        yVault.earn({
          from: addr.sender
        }),
        'Pausable: paused'
      );
      await truffleAssert.reverts(
        yVault.depositAll({
          from: addr.sender
        }),
        'Pausable: paused'
      );
      await truffleAssert.reverts(
        yVault.deposit("0", {
          from: addr.sender
        }),
        'Pausable: paused'
      );
      await truffleAssert.reverts(
        yVault.withdrawAll({
          from: addr.sender
        }),
        'Pausable: paused'
      );
      await truffleAssert.reverts(
        yVault.withdraw("0", {
          from: addr.sender
        }),
        'Pausable: paused'
      );
      await yVault.unpause({
        from: addr.sender
      });
      await truffleAssert.reverts(
        yVault.unpause({
          from: addr.sender
        }),
        'paused'
      );
    });

  });

});
