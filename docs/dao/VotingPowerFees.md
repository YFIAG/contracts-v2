# VotingPowerFees
*Fees functionality for the voting power.*

*Description*: Fees are paid to this contracts in the erc20 token.
This contract distributes fees between voting power holders.

**Dev doc**: Fees value is claimable.

## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`getFeesToken() → contract IERC20 _feesToken` (external) ](#votingpowerfees-getfeestoken--)
  - [`getAccumulatedRatio() → uint256 _accumulatedRatio` (external) ](#votingpowerfees-getaccumulatedratio--)
  - [`getLastBal() → uint256 _lastBal` (external) ](#votingpowerfees-getlastbal--)
  - [`getUserAccumulatedRatio(address _user) → uint256 _userAccumulatedRatio` (external) ](#votingpowerfees-getuseraccumulatedratio-address-)
  - [`constructor(contract IERC20 _stakingToken, contract IERC20 _feesToken)` (public) ](#votingpowerfees-constructor-contract-ierc20-contract-ierc20-)
  - [`updateFees()` (public) ](#votingpowerfees-updatefees--)
  - [`withdrawFees()` (external) ](#votingpowerfees-withdrawfees--)

## Variables <a name="variables"></a>
- `contract IERC20 feesToken`
- `uint256 accumulatedRatio`
- `uint256 lastBal`
- `mapping(address => uint256) userAccumulatedRatio`

## Functions <a name="functions"></a>

### `getFeesToken() → contract IERC20 _feesToken` (external) <a name="votingpowerfees-getfeestoken--"></a>

*Description*: Token in which fees are paid.

### `getAccumulatedRatio() → uint256 _accumulatedRatio` (external) <a name="votingpowerfees-getaccumulatedratio--"></a>

*Description*: Accumulated ratio of the voting power to the fees. This is used to calculate

### `getLastBal() → uint256 _lastBal` (external) <a name="votingpowerfees-getlastbal--"></a>

*Description*: Fees savings amount fixed by the contract after the last claim.

### `getUserAccumulatedRatio(address _user) → uint256 _userAccumulatedRatio` (external) <a name="votingpowerfees-getuseraccumulatedratio-address-"></a>

*Description*: User => accumulated ratio fixed after the last user's claim

### `constructor(contract IERC20 _stakingToken, contract IERC20 _feesToken)` (public) <a name="votingpowerfees-constructor-contract-ierc20-contract-ierc20-"></a>

*Description*: Contract's constructor


#### Params
 - `_stakingToken`: Sets staking token

 - `_feesToken`: Sets fees token

### `updateFees()` (public) <a name="votingpowerfees-updatefees--"></a>

*Description*: Makes contract update its fee (token) balance

**Dev doc**: Updates accumulatedRatio and lastBal

### `withdrawFees()` (external) <a name="votingpowerfees-withdrawfees--"></a>

*Description*: Transfers fees part (token amount) to the user accordingly to the user's voting power share

### `_withdrawFeesFor(address recipient)` (internal) <a name="votingpowerfees-_withdrawfeesfor-address-"></a>

**Dev doc**: bug WIP: Looks like it won't work properly if all of the users
will claim their rewards (balance will be 0) and then new user will receive
voting power and try to claim (revert). Or new user will claim reward after


#### Params
 - `recipient`: User who will receive its fee part.
