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
const IPFS = require("ipfs");
const {
    logBN
} = require("../../utils/test");
const zero = new BN('0');
/* Chai */
const chai = require('chai');
chai.use(require('chai-bn')(BN));
const should = require('chai').should();
/* Artifacts imports */
const TokenYFIAG = artifacts.require("TestTokenYFIAG");
const Governance = artifacts.require("Governance");
const ERC20Mock = artifacts.require('ERC20Mock');

contract('DAO voting test', accounts => {
    let stakingToken;
    let feesToken;
    let rewardsToken;
    let DAO;
    let [sender, governance, thirdParty] = accounts;
    const defaultIpfsText = "TestTextNick";
    let cid;
    let node;

    before(async () => {
        node = await IPFS.create();
        cid = await addProposalText(defaultIpfsText);
    });

    beforeEach(async () => {
        await deployDAO();
    });

    describe('Proposals creation', () => {
        it(`User can create proposal if he has enough voting power`, async () => {
            const minimum = await DAO.getMinimum();
            const period = await DAO.getPeriod();
            const stakeAmount = minimum;

            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);

            const balanceBefore = await stakingToken.balanceOf(sender);
            const totalSupplyBefore = await DAO.totalSupply();
            const votingPowerBefore = await DAO.balanceOf(sender);
            const proposalCountBefore = await DAO.getProposalCount();
            const voteLockBefore = await DAO.getVoteLock(sender);
            const timestampBefore = await time.latest();

            await DAO.propose(cid);

            const timestampAfter = await time.latest();
            const proposalCountAfter = await DAO.getProposalCount();
            const voteLockAfter = await DAO.getVoteLock(sender);
            const totalSupplyAfter = await DAO.totalSupply();
            const balanceAfter = await stakingToken.balanceOf(sender);
            const votingPowerAfter = await DAO.balanceOf(sender);

            proposalCountBefore.should.bignumber.equal(zero)
            proposalCountAfter.should.bignumber.equal(proposalCountBefore.addn(1));
            voteLockBefore.should.bignumber.equal(zero);
            voteLockAfter.should.bignumber.equal(period.add(timestampAfter));
            totalSupplyBefore.should.bignumber.equal(totalSupplyAfter);
            balanceAfter.should.bignumber.equal(balanceBefore);
            votingPowerBefore.should.bignumber.equal(votingPowerAfter);

            // Check proposal
            const proposal = await DAO.getProposal(zero);

            proposal.proposer.should.equal(sender);
            proposal.ipfsCid.should.equal(cid);
            proposal.id.should.bignumber.equal(zero);
            proposal.totalForVotes.should.bignumber.equal(zero);
            proposal.totalAgainstVotes.should.bignumber.equal(zero);
            proposal.start.should.bignumber.equal(new BN(timestampAfter));
            proposal.end.should.bignumber.equal(period.add(timestampAfter));

            //Check ipfs
            const proposalText = await getProposalText(proposal.ipfsCid);
            proposalText.should.equal(proposalText);
        });

        it(`User can create several proposals and get them`, async () => {
            const minimum = await DAO.getMinimum();
            const period = await DAO.getPeriod();
            const stakeAmount = minimum;

            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);
            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);
            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);

            const text2 = "Proposal 2 some textsome textsome textsome textsome textsome textsome textsome textsome textsome textsome textsome textsome textsome textsome text";
            const text3 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec elementum ante. Aliquam vitae ultrices lacus. Nullam lobortis mi viverra est iaculis iaculis. Nullam eget felis odio. Sed efficitur diam et ex elementum, eget maximus orci consectetur. Aliquam sed sagittis felis. Sed in velit bibendum, scelerisque mi eu, malesuada quam. Vivamus sit amet ante eget lectus accumsan viverra a quis magna. Etiam a maximus elit, id pellentesque purus.";
            const cid2 = await addProposalText(text2);
            const cid3 = await addProposalText(text3);

            const balanceBefore = await stakingToken.balanceOf(sender);
            const totalSupplyBefore = await DAO.totalSupply();
            const votingPowerBefore = await DAO.balanceOf(sender);
            const proposalCountBefore = await DAO.getProposalCount();
            const voteLockBefore = await DAO.getVoteLock(sender);
            const timestampBefore = await time.latest();


            await DAO.propose(cid);
            await DAO.propose(cid2);
            await DAO.propose(cid3);

            const timestampAfter = await time.latest();
            const proposalCountAfter = await DAO.getProposalCount();
            const voteLockAfter = await DAO.getVoteLock(sender);
            const totalSupplyAfter = await DAO.totalSupply();
            const balanceAfter = await stakingToken.balanceOf(sender);
            const votingPowerAfter = await DAO.balanceOf(sender);

            proposalCountBefore.should.bignumber.equal(zero)
            proposalCountAfter.should.bignumber.equal(proposalCountBefore.addn(3));
            voteLockBefore.should.bignumber.equal(zero);
            voteLockAfter.should.bignumber.equal(period.add(timestampAfter));
            totalSupplyBefore.should.bignumber.equal(totalSupplyAfter);
            balanceAfter.should.bignumber.equal(balanceBefore);
            votingPowerBefore.should.bignumber.equal(votingPowerAfter);

            // Check proposals
            const proposals = await DAO.getProposals(zero, 3);
            const cids = [cid, cid2, cid3];
            const texts = [defaultIpfsText, text2, text3];
            for (let i = 0; i < proposals.proposer.length; i++) {
                proposals.proposer[i].should.equal(sender);
                proposals.ipfsCid[i].should.equal(cids[i]);
                proposals.id[i].should.bignumber.equal(new BN(`${i}`));
                proposals.totalForVotes[i].should.bignumber.equal(zero);
                proposals.totalAgainstVotes[i].should.bignumber.equal(zero);
                // proposals.start[i].should.bignumber.equal(timestampAfter);
                // proposals.end[i].should.bignumber.equal(period.add(timestampAfter));
                const proposalText = await getProposalText(proposals.ipfsCid[i]);
                proposalText.should.equal(texts[i]);
            }


            //Check ipfs
        });

        it(`User can't create proposal if he hasn't enough voting power`, async () => {
            const minimum = await DAO.getMinimum();
            const period = await DAO.getPeriod();
            const stakeAmount = 1;

            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);

            const balanceBefore = await stakingToken.balanceOf(sender);
            const totalSupplyBefore = await DAO.totalSupply();
            const votingPowerBefore = await DAO.balanceOf(sender);
            const proposalCountBefore = await DAO.getProposalCount();
            const voteLockBefore = await DAO.getVoteLock(sender);
            const timestampBefore = await time.latest();

            await expectRevert(DAO.propose(cid), "<minimum");

            const timestampAfter = await time.latest();
            const proposalCountAfter = await DAO.getProposalCount();
            const voteLockAfter = await DAO.getVoteLock(sender);
            const totalSupplyAfter = await DAO.totalSupply();
            const balanceAfter = await stakingToken.balanceOf(sender);
            const votingPowerAfter = await DAO.balanceOf(sender);

            proposalCountBefore.should.bignumber.equal(zero)
            proposalCountAfter.should.bignumber.equal(zero);
            voteLockBefore.should.bignumber.equal(zero);
            voteLockAfter.should.bignumber.equal(zero);
            totalSupplyBefore.should.bignumber.equal(totalSupplyAfter);
            balanceAfter.should.bignumber.equal(balanceBefore);
            votingPowerBefore.should.bignumber.equal(votingPowerAfter);

            // Check proposal
            const proposal = await DAO.getProposal(zero);

            proposal.proposer.should.equal(constants.ZERO_ADDRESS);
            proposal.id.should.bignumber.equal(zero);
            proposal.totalForVotes.should.bignumber.equal(zero);
            proposal.totalAgainstVotes.should.bignumber.equal(zero);
            proposal.start.should.bignumber.equal(zero);
            proposal.end.should.bignumber.equal(zero);
        });
        it(`User can revoke proposal `, async () => {
            const minimum = await DAO.getMinimum();
            const period = await DAO.getPeriod();
            const stakeAmount = minimum;

            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);
            await DAO.propose(cid);

            const balanceBefore = await stakingToken.balanceOf(sender);
            const totalSupplyBefore = await DAO.totalSupply();
            const votingPowerBefore = await DAO.balanceOf(sender);
            const proposalCountBefore = await DAO.getProposalCount();
            const voteLockBefore = await DAO.getVoteLock(sender);
            const timestampBefore = await time.latest();

            await DAO.revokeProposal(zero);

            const timestampAfter = await time.latest();
            const proposalCountAfter = await DAO.getProposalCount();
            const voteLockAfter = await DAO.getVoteLock(sender);
            const totalSupplyAfter = await DAO.totalSupply();
            const balanceAfter = await stakingToken.balanceOf(sender);
            const votingPowerAfter = await DAO.balanceOf(sender);

            proposalCountBefore.should.bignumber.equal("1")
            proposalCountAfter.should.bignumber.equal("1");
            voteLockBefore.should.bignumber.equal(period.add(timestampBefore));
            voteLockAfter.should.bignumber.equal(period.add(timestampBefore));
            totalSupplyBefore.should.bignumber.equal(totalSupplyAfter);
            balanceAfter.should.bignumber.equal(balanceBefore);
            votingPowerBefore.should.bignumber.equal(votingPowerAfter);

            // Check proposal
            const proposal = await DAO.getProposal(zero);

            proposal.proposer.should.equal(sender);
            proposal.ipfsCid.should.equal(cid);
            proposal.id.should.bignumber.equal(zero);
            proposal.totalForVotes.should.bignumber.equal(zero);
            proposal.totalAgainstVotes.should.bignumber.equal(zero);
            proposal.start.should.bignumber.equal(new BN(timestampBefore));
            proposal.end.should.bignumber.equal(zero);

            //Check ipfs
            const proposalText = await getProposalText(proposal.ipfsCid);
            proposalText.should.equal(proposalText);

        });
        it(`User can't revoke proposal if he isn't the author of the proposal`, async () => {
            const minimum = await DAO.getMinimum();
            const stakeAmount = minimum;

            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);
            await DAO.propose(cid);
            await time.increase(duration.seconds(10));
            await expectRevert(DAO.revokeProposal(zero, {
                from: thirdParty
            }), "!proposer");
        });
    });

    describe('Voting', () => {
        it(`User can vote for`, async () => {
            const minimum = await DAO.getMinimum();
            const period = await DAO.getPeriod();
            const stakeAmount = minimum;

            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);
            await DAO.propose(cid);
            await time.increase(duration.seconds(10));

            const votingPower = new BN(ether('100'));

            await stakingToken.transfer(thirdParty, votingPower);
            await stakingToken.approve(DAO.address, votingPower, {
                from: thirdParty
            });
            await DAO.stake(votingPower, {
                from: thirdParty
            });

            const balanceBefore = await stakingToken.balanceOf(thirdParty);
            const totalSupplyBefore = await DAO.totalSupply();
            const votingPowerBefore = await DAO.balanceOf(thirdParty);
            const proposalId = (await DAO.getProposalCount()) - 1;
            const voteLockBefore = await DAO.getVoteLock(thirdParty);

            await DAO.voteFor(proposalId, {
                from: thirdParty
            })

            const timestampAfter = await time.latest();
            const voteLockAfter = await DAO.getVoteLock(thirdParty);
            const totalSupplyAfter = await DAO.totalSupply();
            const balanceAfter = await stakingToken.balanceOf(thirdParty);
            const votingPowerAfter = await DAO.balanceOf(thirdParty);

            voteLockBefore.should.bignumber.equal(zero);
            totalSupplyBefore.should.bignumber.equal(totalSupplyAfter);
            balanceAfter.should.bignumber.equal(balanceBefore);
            votingPowerBefore.should.bignumber.equal(votingPowerAfter);

            // Check votes
            const proposal = await DAO.getProposal(proposalId);
            const userForVotes = await DAO.getProposalForVotes(proposalId, thirdParty);
            const userAgainstVotes = await DAO.getProposalAgainstVotes(proposalId, thirdParty);

            voteLockAfter.should.bignumber.equal(proposal.end);
            proposal.totalForVotes.should.bignumber.equal(votingPower);
            userForVotes.should.bignumber.equal(votingPower);

            proposal.totalAgainstVotes.should.bignumber.equal(zero);
            userAgainstVotes.should.bignumber.equal(zero);
        });

        it(`TODO: User can't vote for proposal before start`, async () => {
            /* ?! */
        });

        it(`User can't vote for proposal after end`, async () => {
            const minimum = await DAO.getMinimum();
            const stakeAmount = minimum;

            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);
            await DAO.setPeriod(5, {
                from: governance
            });
            await DAO.propose(cid);
            await time.increase(duration.seconds(10));

            const period = await DAO.getPeriod();

            await time.increase(period);
            await time.increase(duration.days(1)); //for sure

            const votingPower = new BN(ether('10'));

            await stakingToken.transfer(thirdParty, votingPower);
            await stakingToken.approve(DAO.address, votingPower, {
                from: thirdParty
            });
            await DAO.stake(votingPower, {
                from: thirdParty
            });

            const balanceBefore = await stakingToken.balanceOf(thirdParty);
            const totalSupplyBefore = await DAO.totalSupply();
            const votingPowerBefore = await DAO.balanceOf(thirdParty);
            const proposalId = (await DAO.getProposalCount()) - 1;
            const voteLockBefore = await DAO.getVoteLock(thirdParty);

            await expectRevert(DAO.voteFor(proposalId, {
                from: thirdParty
            }), ">end");

            const timestampAfter = await time.latest();
            const voteLockAfter = await DAO.getVoteLock(thirdParty);
            const totalSupplyAfter = await DAO.totalSupply();
            const balanceAfter = await stakingToken.balanceOf(thirdParty);
            const votingPowerAfter = await DAO.balanceOf(thirdParty);

            voteLockBefore.should.bignumber.equal(zero);
            voteLockAfter.should.bignumber.equal(zero);
            totalSupplyBefore.should.bignumber.equal(totalSupplyAfter);
            balanceAfter.should.bignumber.equal(balanceBefore);
            votingPowerBefore.should.bignumber.equal(votingPowerAfter);

            // Check votes
            const proposal = await DAO.getProposal(proposalId);
            const userForVotes = await DAO.getProposalForVotes(proposalId, thirdParty);
            const userAgainstVotes = await DAO.getProposalAgainstVotes(proposalId, thirdParty);

            proposal.totalForVotes.should.bignumber.equal(zero);
            userForVotes.should.bignumber.equal(zero);

            proposal.totalAgainstVotes.should.bignumber.equal(zero);
            userAgainstVotes.should.bignumber.equal(zero);
        });

        it(`User can vote against`, async () => {
            const minimum = await DAO.getMinimum();
            const period = await DAO.getPeriod();
            const stakeAmount = minimum;

            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);
            await DAO.propose(cid);
            await time.increase(duration.seconds(10));
            await time.increase(duration.seconds(10));

            const votingPower = new BN(ether('100'));

            await stakingToken.transfer(thirdParty, votingPower);
            await stakingToken.approve(DAO.address, votingPower, {
                from: thirdParty
            });
            await DAO.stake(votingPower, {
                from: thirdParty
            });

            const balanceBefore = await stakingToken.balanceOf(thirdParty);
            const totalSupplyBefore = await DAO.totalSupply();
            const votingPowerBefore = await DAO.balanceOf(thirdParty);
            const proposalId = (await DAO.getProposalCount()) - 1;
            const voteLockBefore = await DAO.getVoteLock(thirdParty);

            await DAO.voteAgainst(proposalId, {
                from: thirdParty
            })

            const timestampAfter = await time.latest();
            const voteLockAfter = await DAO.getVoteLock(thirdParty);
            const totalSupplyAfter = await DAO.totalSupply();
            const balanceAfter = await stakingToken.balanceOf(thirdParty);
            const votingPowerAfter = await DAO.balanceOf(thirdParty);

            voteLockBefore.should.bignumber.equal(zero);
            totalSupplyBefore.should.bignumber.equal(totalSupplyAfter);
            balanceAfter.should.bignumber.equal(balanceBefore);
            votingPowerBefore.should.bignumber.equal(votingPowerAfter);

            // Check votes
            const proposal = await DAO.getProposal(proposalId);
            const userForVotes = await DAO.getProposalForVotes(proposalId, thirdParty);
            const userAgainstVotes = await DAO.getProposalAgainstVotes(proposalId, thirdParty);

            voteLockAfter.should.bignumber.equal(proposal.end);
            proposal.totalForVotes.should.bignumber.equal(zero);
            userForVotes.should.bignumber.equal(zero);

            proposal.totalAgainstVotes.should.bignumber.equal(votingPower);
            userAgainstVotes.should.bignumber.equal(votingPower);
        });

        it(`TODO: User can't vote against proposal before start`, async () => {
            /* ?! */
        });

        it(`User can't vote against proposal after end`, async () => {
            const minimum = await DAO.getMinimum();
            const stakeAmount = minimum;

            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);
            await DAO.setPeriod(5, {
                from: governance
            });
            await DAO.propose(cid);
            await time.increase(duration.seconds(10));
            await time.increase(duration.seconds(10));

            const period = await DAO.getPeriod();

            await time.increase(period);
            await time.increase(duration.days(1)); //for sure

            const votingPower = new BN(ether('10'));

            await stakingToken.transfer(thirdParty, votingPower);
            await stakingToken.approve(DAO.address, votingPower, {
                from: thirdParty
            });
            await DAO.stake(votingPower, {
                from: thirdParty
            });

            const balanceBefore = await stakingToken.balanceOf(thirdParty);
            const totalSupplyBefore = await DAO.totalSupply();
            const votingPowerBefore = await DAO.balanceOf(thirdParty);
            const proposalId = (await DAO.getProposalCount()) - 1;
            const voteLockBefore = await DAO.getVoteLock(thirdParty);

            await expectRevert(DAO.voteAgainst(proposalId, {
                from: thirdParty
            }), ">end");

            const timestampAfter = await time.latest();
            const voteLockAfter = await DAO.getVoteLock(thirdParty);
            const totalSupplyAfter = await DAO.totalSupply();
            const balanceAfter = await stakingToken.balanceOf(thirdParty);
            const votingPowerAfter = await DAO.balanceOf(thirdParty);

            voteLockBefore.should.bignumber.equal(zero);
            voteLockAfter.should.bignumber.equal(zero);
            totalSupplyBefore.should.bignumber.equal(totalSupplyAfter);
            balanceAfter.should.bignumber.equal(balanceBefore);
            votingPowerBefore.should.bignumber.equal(votingPowerAfter);

            // Check votes
            const proposal = await DAO.getProposal(proposalId);
            const userForVotes = await DAO.getProposalForVotes(proposalId, thirdParty);
            const userAgainstVotes = await DAO.getProposalAgainstVotes(proposalId, thirdParty);

            proposal.totalForVotes.should.bignumber.equal(zero);
            userForVotes.should.bignumber.equal(zero);

            proposal.totalAgainstVotes.should.bignumber.equal(zero);
            userAgainstVotes.should.bignumber.equal(zero);
        });

        it(`User can't vote for not started proposal`, async () => {
            const votingPower = new BN(ether('10'));
            const minimum = await DAO.getMinimum();
            const period = await DAO.getPeriod();
            const stakeAmount = minimum;
            await stakingToken.transfer(thirdParty, votingPower);
            await stakingToken.approve(DAO.address, votingPower, {
                from: thirdParty
            });
            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);
            // await DAO.propose(cid);
            await expectRevert(DAO.voteFor(zero, {
                from: thirdParty
            }), ">end");
        });

        it(`User can't vote against not started proposal`, async () => {
            const votingPower = new BN(ether('10'));
            const minimum = await DAO.getMinimum();
            const period = await DAO.getPeriod();
            const stakeAmount = minimum;
            await stakingToken.transfer(thirdParty, votingPower);
            await stakingToken.approve(DAO.address, votingPower, {
                from: thirdParty
            });
            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);
            // await DAO.propose(cid);
            await expectRevert(DAO.voteAgainst(zero, {
                from: thirdParty
            }), ">end");
        });

        it(`User's lock can't be reduced by voting for`, async () => {
            const minimum = await DAO.getMinimum();
            const period = await DAO.getPeriod();
            const stakeAmount = minimum;

            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);
            await DAO.propose(cid);
            await time.increase(duration.seconds(10));

            const votingPower = new BN(ether('100'));

            await stakingToken.transfer(thirdParty, votingPower);
            await stakingToken.approve(DAO.address, votingPower, {
                from: thirdParty
            });
            await DAO.stake(votingPower, {
                from: thirdParty
            });
            const proposalId = (await DAO.getProposalCount()) - 1;
            await stakingToken.transfer(thirdParty, votingPower);
            await stakingToken.approve(DAO.address, votingPower, {
                from: thirdParty
            });
            await DAO.stake(votingPower, {
                from: thirdParty
            });
            const proposalId2 = (await DAO.getProposalCount()) - 1;
            await DAO.voteFor(proposalId2, {
                from: thirdParty
            })
            const voteLockBefore = await DAO.getVoteLock(thirdParty);
            await DAO.voteFor(proposalId, {
                from: thirdParty
            })
            const voteLockAfter = await DAO.getVoteLock(thirdParty);
            voteLockAfter.should.bignumber.equal(voteLockBefore);
        });

        it(`User's lock can't be reduced by voting against`, async () => {
            const minimum = await DAO.getMinimum();
            const period = await DAO.getPeriod();
            const stakeAmount = minimum;

            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);
            await DAO.propose(cid);
            await time.increase(duration.seconds(10));

            const votingPower = new BN(ether('100'));

            await stakingToken.transfer(thirdParty, votingPower);
            await stakingToken.approve(DAO.address, votingPower, {
                from: thirdParty
            });
            await DAO.stake(votingPower, {
                from: thirdParty
            });
            const proposalId = (await DAO.getProposalCount()) - 1;
            await stakingToken.transfer(thirdParty, votingPower);
            await stakingToken.approve(DAO.address, votingPower, {
                from: thirdParty
            });
            await DAO.stake(votingPower, {
                from: thirdParty
            });
            const proposalId2 = (await DAO.getProposalCount()) - 1;
            await DAO.voteFor(proposalId2, {
                from: thirdParty
            })
            const voteLockBefore = await DAO.getVoteLock(thirdParty);
            await DAO.voteAgainst(proposalId, {
                from: thirdParty
            })
            const voteLockAfter = await DAO.getVoteLock(thirdParty);
            voteLockAfter.should.bignumber.equal(voteLockBefore);
        });

    });

    describe('Getters and setters', () => {
        it(`Governance`, async () => {
            (await DAO.getGovernance()).should.equal(governance);
            let res = await DAO.setGovernance(constants.ZERO_ADDRESS, {
                from: governance
            });
            expectEvent(res, "NewGovernanceAddress", { newGovernance: constants.ZERO_ADDRESS });
            (await DAO.getGovernance()).should.equal(constants.ZERO_ADDRESS)
        });
        it(`Minimum`, async () => {
            (await DAO.getMinimum()).should.bignumber.equal(ether('1'));
            let res = await DAO.setMinimum(ether('2'), {
                from: governance
            });
            expectEvent(res, "NewMinimumValue", { newMinimum: ether('2') });
            (await DAO.getMinimum()).should.bignumber.equal(ether('2'));
        });
        it(`Period`, async () => {
            (await DAO.getPeriod()).should.bignumber.equal(duration.days(3));
            let res = await DAO.setPeriod(ether('2'), {
                from: governance
            });
            expectEvent(res, "NewPeriodValue", { newPeriod: ether('2') });
            (await DAO.getPeriod()).should.bignumber.equal(ether('2'));
        });

        it(`Get proposals`, async () => {
            const minimum = await DAO.getMinimum();
            const period = await DAO.getPeriod();
            const stakeAmount = minimum;

            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);
            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);
            await stakingToken.approve(DAO.address, stakeAmount);
            await DAO.stake(stakeAmount);

            const text2 = "Proposal 2 some textsome textsome textsome textsome textsome textsome textsome textsome textsome textsome textsome textsome textsome textsome text";
            const text3 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque nec elementum ante. Aliquam vitae ultrices lacus. Nullam lobortis mi viverra est iaculis iaculis. Nullam eget felis odio. Sed efficitur diam et ex elementum, eget maximus orci consectetur. Aliquam sed sagittis felis. Sed in velit bibendum, scelerisque mi eu, malesuada quam. Vivamus sit amet ante eget lectus accumsan viverra a quis magna. Etiam a maximus elit, id pellentesque purus.";
            const cid2 = await addProposalText(text2);
            const cid3 = await addProposalText(text3);

            await DAO.propose(cid);
            await DAO.propose(cid2);
            await DAO.propose(cid3);
            await time.increase(duration.seconds(10));

            await expectRevert(DAO.getProposals(3, zero), "invalid range");

        });
        it(`Staking token`, async () => {
            (await DAO.getStakingToken()).should.equal(stakingToken.address);
            await DAO.setStakingToken(constants.ZERO_ADDRESS, {
                from: governance
            });
            (await DAO.getStakingToken()).should.equal(constants.ZERO_ADDRESS)
        });
    });

    describe('Miscellaneous', () => {
        it(`OnlyGovernance modifier`, async () => {
            await expectRevert(DAO.setGovernance(constants.ZERO_ADDRESS), "!governance");
        });
        it(`Seize function`, async () => {
            let erc20Mock = await ERC20Mock.new("Token", "TKN", ether('1000000'));
            await erc20Mock.transfer(DAO.address, ether('777'));
            (await erc20Mock.balanceOf(DAO.address)).should.bignumber.equal(ether('777'));

            await expectRevert(DAO.seize(stakingToken.address, 1, {
                from: governance
            }), "stakingToken");
            await expectRevert(DAO.seize(feesToken.address, 1, {
                from: governance
            }), "feesToken");
            await expectRevert(DAO.seize(rewardsToken.address, 1, {
                from: governance
            }), "rewardsToken");

            await DAO.seize(erc20Mock.address, ether('777'), {
                from: governance
            });

            (await erc20Mock.balanceOf(governance)).should.bignumber.equal(ether('777'));
        });
    });

    async function deployDAO() {
        stakingToken = await TokenYFIAG.new(sender);
        feesToken = await ERC20Mock.new("FeesToken", "FT", ether("1000000"));
        rewardsToken = await ERC20Mock.new("RewardsToken", "RT", ether("1000000"));
        DAO = await Governance.new(stakingToken.address, feesToken.address, rewardsToken.address, governance);
    }

    async function addProposalText(proposalText) {
        const results = await node.add(proposalText);
        return results.cid.toString();
    }

    async function getProposalText(cid) {

        const stream = node.cat(cid);
        let proposalText = '';

        for await (const chunk of stream) {
            // chunks of data are returned as a Buffer, convert it back to a string
            proposalText += chunk.toString();
        }
        return proposalText;

    }
});