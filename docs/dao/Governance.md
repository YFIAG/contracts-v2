# Governance
**


## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`getProposalCount() → uint256 _proposalCount` (external) ](#governance-getproposalcount--)
  - [`getPeriod() → uint256 _period` (external) ](#governance-getperiod--)
  - [`getMinimum() → uint256 _minimum` (external) ](#governance-getminimum--)
  - [`getGovernance() → address _governance` (external) ](#governance-getgovernance--)
  - [`getVoteLock(address _user) → uint256 _voteLock` (external) ](#governance-getvotelock-address-)
  - [`getProposal(uint256 _proposalId) → uint256 id, address proposer, string ipfsCid, uint256 totalForVotes, uint256 totalAgainstVotes, uint256 start, uint256 end` (external) ](#governance-getproposal-uint256-)
  - [`getProposals(uint256 _fromId, uint256 _toId) → uint256[] id, address[] proposer, string[] ipfsCid, uint256[] totalForVotes, uint256[] totalAgainstVotes, uint256[] start, uint256[] end` (external) ](#governance-getproposals-uint256-uint256-)
  - [`getProposalForVotes(uint256 _proposalId, address _user) → uint256 forVotes` (external) ](#governance-getproposalforvotes-uint256-address-)
  - [`getProposalAgainstVotes(uint256 _proposalId, address _user) → uint256 againstVotes` (external) ](#governance-getproposalagainstvotes-uint256-address-)
  - [`constructor(contract IERC20 _stakingToken, contract IERC20 _feesToken, contract IERC20 _rewardsToken, address _governance)` (public) ](#governance-constructor-contract-ierc20-contract-ierc20-contract-ierc20-address-)
  - [`seize(contract IERC20 _token, uint256 _amount)` (external) ](#governance-seize-contract-ierc20-uint256-)
  - [`setStakingToken(contract IERC20 _stakingToken)` (external) ](#governance-setstakingtoken-contract-ierc20-)
  - [`setGovernance(address _governance)` (external) ](#governance-setgovernance-address-)
  - [`setMinimum(uint256 _minimum)` (external) ](#governance-setminimum-uint256-)
  - [`setPeriod(uint256 _period)` (external) ](#governance-setperiod-uint256-)
  - [`propose(string _ipfsCid)` (external) ](#governance-propose-string-)
  - [`revokeProposal(uint256 _id)` (external) ](#governance-revokeproposal-uint256-)
  - [`voteFor(uint256 id)` (external) ](#governance-votefor-uint256-)
  - [`voteAgainst(uint256 id)` (external) ](#governance-voteagainst-uint256-)
  - [`stake(uint256 amount)` (public) ](#governance-stake-uint256-)
  - [`withdraw(uint256 amount)` (public) ](#governance-withdraw-uint256-)
- [Events:](#events)

## Variables <a name="variables"></a>
- `uint256 proposalCount`
- `uint256 period`
- `uint256 minimum`
- `address governance`
- `mapping(address => uint256) voteLock`
- `mapping(uint256 => struct Governance.Proposal) proposals`

## Functions <a name="functions"></a>

### `getProposalCount() → uint256 _proposalCount` (external) <a name="governance-getproposalcount--"></a>

*Description*: Returns proposalCount value.

#### Returns
 - _proposalCount - uint256 value

### `getPeriod() → uint256 _period` (external) <a name="governance-getperiod--"></a>

*Description*: Returns period value.

**Dev doc**: Voting period in seconds

#### Returns
 - _period - uint256 value

### `getMinimum() → uint256 _minimum` (external) <a name="governance-getminimum--"></a>

*Description*: Returns minimum value.

**Dev doc**: minimum value is the value of the voting power which user must have to create proposal.

#### Returns
 - _minimum - uint256 value

### `getGovernance() → address _governance` (external) <a name="governance-getgovernance--"></a>

*Description*: Returns governance address.

#### Returns
 - _governance - address value

### `getVoteLock(address _user) → uint256 _voteLock` (external) <a name="governance-getvotelock-address-"></a>

*Description*: Returns vote lockFor the specified user


#### Params
 - `_user`: user for whom to get voteLock value.

#### Returns
 - _voteLock - user's uint256 vote lock timestamp

### `getProposal(uint256 _proposalId) → uint256 id, address proposer, string ipfsCid, uint256 totalForVotes, uint256 totalAgainstVotes, uint256 start, uint256 end` (external) <a name="governance-getproposal-uint256-"></a>

*Description*: Returns proposal's data with the specified proposal id.


#### Params
 - `_proposalId`: - an index (count number) in the proposals mapping.

#### Returns
 - id - proposal id

 - proposer - proposal author address

 - ipfsCid - ipfs cid of the proposal text

 - totalForVotes - total amount of the voting power used for voting **for** proposal

 - totalAgainstVotes - total amount of the voting power used for voting **against** proposal

 - start - timestamp when proposal was created

 - end - timestamp when proposal will be ended and disabled for voting (end = start + period)

### `getProposals(uint256 _fromId, uint256 _toId) → uint256[] id, address[] proposer, string[] ipfsCid, uint256[] totalForVotes, uint256[] totalAgainstVotes, uint256[] start, uint256[] end` (external) <a name="governance-getproposals-uint256-uint256-"></a>

*Description*: Returns proposals' data in the range of ids.

**Dev doc**: Revert will be thrown if _fromId >= _toId


#### Params
 - `_fromId`: - proposal id/index at which to start extraction.

 - `_toId`: - proposal id/index *before* which to end extraction.

#### Returns
 - id - proposals ids

 - proposer - proposals authors addresses

 - ipfsCid - ipfs cids of the proposals' texts

 - totalForVotes - total amount of the voting power used for voting **for** proposals

 - totalAgainstVotes - total amount of the voting power used for voting **against** proposals

 - start - timestamps when proposals was created

 - end - timestamps when proposals will be ended and disabled for voting (end = start + period)

### `getProposalForVotes(uint256 _proposalId, address _user) → uint256 forVotes` (external) <a name="governance-getproposalforvotes-uint256-address-"></a>

*Description*: Returns user's votes for the specified proposal id.


#### Params
 - `_proposalId`: - an index (count number) in the proposals mapping.

 - `_user`: - user for which votes are requested

#### Returns
 - forVotes - uint256 value

### `getProposalAgainstVotes(uint256 _proposalId, address _user) → uint256 againstVotes` (external) <a name="governance-getproposalagainstvotes-uint256-address-"></a>

*Description*: Returns user's votes against the specified proposal id.


#### Params
 - `_proposalId`: - an index (count number) in the proposals mapping.

 - `_user`: - user for which votes are requested

#### Returns
 - againstVotes - uint256 value

### `constructor(contract IERC20 _stakingToken, contract IERC20 _feesToken, contract IERC20 _rewardsToken, address _governance)` (public) <a name="governance-constructor-contract-ierc20-contract-ierc20-contract-ierc20-address-"></a>

*Description*: Contract's constructor


#### Params
 - `_stakingToken`: Sets staking token

 - `_feesToken`: Sets fees token

 - `_rewardsToken`: Sets rewards token

 - `_governance`: Sets governance address

### `seize(contract IERC20 _token, uint256 _amount)` (external) <a name="governance-seize-contract-ierc20-uint256-"></a>

*Description*: Fee collection for any other token

**Dev doc**: Transfers token to the governance address


#### Params
 - `_token`: Token address

 - `_amount`: Amount for transferring to the governance

### `setStakingToken(contract IERC20 _stakingToken)` (external) <a name="governance-setstakingtoken-contract-ierc20-"></a>

*Description*: Sets staking token.


#### Params
 - `_stakingToken`: new staking token address.

### `setGovernance(address _governance)` (external) <a name="governance-setgovernance-address-"></a>

*Description*: Sets governance.


#### Params
 - `_governance`: new governance value.

### `setMinimum(uint256 _minimum)` (external) <a name="governance-setminimum-uint256-"></a>

*Description*: Sets minimum.


#### Params
 - `_minimum`: new minimum value.

### `setPeriod(uint256 _period)` (external) <a name="governance-setperiod-uint256-"></a>

*Description*: Sets period.


#### Params
 - `_period`: new period value.

### `propose(string _ipfsCid)` (external) <a name="governance-propose-string-"></a>

*Description*: Creates new proposal without text, proposal settings are default on the contract.

**Dev doc**: User must have voting power >= minimum in order to create proposal.
New proposal will be added to the proposals mapping.

#### Params
 - `_ipfsCid`: ipfs cid of the proposal's text


### `revokeProposal(uint256 _id)` (external) <a name="governance-revokeproposal-uint256-"></a>


### `voteFor(uint256 id)` (external) <a name="governance-votefor-uint256-"></a>

*Description*: Votes for the proposal using voting power.

**Dev doc**: After voting function withdraws fee for the user(if breaker == false).


#### Params
 - `id`: proposal's id

### `voteAgainst(uint256 id)` (external) <a name="governance-voteagainst-uint256-"></a>

*Description*: Votes against the proposal using voting power.

**Dev doc**: After voting function withdraws fee for the user.


#### Params
 - `id`: proposal's id

### `stake(uint256 amount)` (public) <a name="governance-stake-uint256-"></a>

*Description*: Stakes token and adds voting power (with a 1:1 ratio)

**Dev doc**: Token amount must be approved to this contract before staking.
Before staking contract withdraws fee for the user.


#### Params
 - `amount`: Amount to stake

### `withdraw(uint256 amount)` (public) <a name="governance-withdraw-uint256-"></a>

*Description*: Withdraws token and subtracts voting power (with a 1:1 ratio)

**Dev doc**: Tokens must be unlocked to withdraw (voteLock[msg.sender] < block.timestamp).
Before withdraw contract withdraws fee for the user.


#### Params
 - `amount`: Amount to withdraw
## Events <a name="events"></a>
### event `NewGovernanceAddress(address newGovernance)` <a name="governance-newgovernanceaddress-address-"></a>


### event `NewMinimumValue(uint256 newMinimum)` <a name="governance-newminimumvalue-uint256-"></a>


### event `NewPeriodValue(uint256 newPeriod)` <a name="governance-newperiodvalue-uint256-"></a>


