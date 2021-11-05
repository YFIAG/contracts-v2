# VotingPowerFeesAndRewards
*Rewards functionality for the voting power.*

*Description*: Rewards are paid by some centralized treasury.
Then this contract distributes rewards to the voting power holders.

## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`getDuration() → uint256 _DURATION` (external) ](#votingpowerfeesandrewards-getduration--)
  - [`getPeriodFinish() → uint256 _periodFinish` (external) ](#votingpowerfeesandrewards-getperiodfinish--)
  - [`getRewardRate() → uint256 _rewardRate` (external) ](#votingpowerfeesandrewards-getrewardrate--)
  - [`getRewardsToken() → contract IERC20 _rewardsToken` (external) ](#votingpowerfeesandrewards-getrewardstoken--)
  - [`getLastUpdateTime() → uint256 _lastUpdateTime` (external) ](#votingpowerfeesandrewards-getlastupdatetime--)
  - [`getRewardPerTokenStored() → uint256 _rewardPerTokenStored` (external) ](#votingpowerfeesandrewards-getrewardpertokenstored--)
  - [`getUserRewardPerTokenPaid(address _user) → uint256 _userRewardPerTokenPaid` (external) ](#votingpowerfeesandrewards-getuserrewardpertokenpaid-address-)
  - [`getRewards(address _user) → uint256 _rewards` (external) ](#votingpowerfeesandrewards-getrewards-address-)
  - [`constructor(contract IERC20 _stakingToken, contract IERC20 _feesToken, contract IERC20 _rewardsToken)` (public) ](#votingpowerfeesandrewards-constructor-contract-ierc20-contract-ierc20-contract-ierc20-)
  - [`lastTimeRewardApplicable() → uint256` (public) ](#votingpowerfeesandrewards-lasttimerewardapplicable--)
  - [`rewardPerToken() → uint256` (public) ](#votingpowerfeesandrewards-rewardpertoken--)
  - [`earned(address account) → uint256` (public) ](#votingpowerfeesandrewards-earned-address-)
  - [`getReward()` (external) ](#votingpowerfeesandrewards-getreward--)
  - [`notifyRewardAmount(uint256 reward)` (external) ](#votingpowerfeesandrewards-notifyrewardamount-uint256-)
- [Events:](#events)

## Variables <a name="variables"></a>
- `uint256 DURATION`
- `uint256 periodFinish`
- `uint256 rewardRate`
- `contract IERC20 rewardsToken`
- `uint256 lastUpdateTime`
- `uint256 rewardPerTokenStored`
- `mapping(address => uint256) userRewardPerTokenPaid`
- `mapping(address => uint256) rewards`

## Functions <a name="functions"></a>

### `getDuration() → uint256 _DURATION` (external) <a name="votingpowerfeesandrewards-getduration--"></a>

*Description*: Returns DURATION value

#### Returns
 - _DURATION - uint256 value

### `getPeriodFinish() → uint256 _periodFinish` (external) <a name="votingpowerfeesandrewards-getperiodfinish--"></a>

*Description*: Returns periodFinish value

#### Returns
 - _periodFinish - uint256 value

### `getRewardRate() → uint256 _rewardRate` (external) <a name="votingpowerfeesandrewards-getrewardrate--"></a>

*Description*: Returns rewardRate value

#### Returns
 - _rewardRate - uint256 value

### `getRewardsToken() → contract IERC20 _rewardsToken` (external) <a name="votingpowerfeesandrewards-getrewardstoken--"></a>

*Description*: Returns rewardsToken value

#### Returns
 - _rewardsToken - IERC20 value

### `getLastUpdateTime() → uint256 _lastUpdateTime` (external) <a name="votingpowerfeesandrewards-getlastupdatetime--"></a>

*Description*: Returns lastUpdateTime value

#### Returns
 - _lastUpdateTime - uint256 value

### `getRewardPerTokenStored() → uint256 _rewardPerTokenStored` (external) <a name="votingpowerfeesandrewards-getrewardpertokenstored--"></a>

*Description*: Returns rewardPerTokenStored value

#### Returns
 - _rewardPerTokenStored - uint256 value

### `getUserRewardPerTokenPaid(address _user) → uint256 _userRewardPerTokenPaid` (external) <a name="votingpowerfeesandrewards-getuserrewardpertokenpaid-address-"></a>

*Description*: Returns user's reward per token paid


#### Params
 - `_user`: address of the user for whom data are requested

#### Returns
 - _userRewardPerTokenPaid - uint256 value

### `getRewards(address _user) → uint256 _rewards` (external) <a name="votingpowerfeesandrewards-getrewards-address-"></a>

*Description*: Returns user's available rewards


#### Params
 - `_user`: address of the user for whom data are requested

#### Returns
 - _rewards - uint256 value

### `constructor(contract IERC20 _stakingToken, contract IERC20 _feesToken, contract IERC20 _rewardsToken)` (public) <a name="votingpowerfeesandrewards-constructor-contract-ierc20-contract-ierc20-contract-ierc20-"></a>

*Description*: Contract's constructor


#### Params
 - `_stakingToken`: Sets staking token

 - `_feesToken`: Sets fees token

 - `_rewardsToken`: Sets rewards token

### `lastTimeRewardApplicable() → uint256` (public) <a name="votingpowerfeesandrewards-lasttimerewardapplicable--"></a>

*Description*: Return timestamp last time reward applicable

#### Returns
 - lastTimeRewardApplicable - uint256

### `rewardPerToken() → uint256` (public) <a name="votingpowerfeesandrewards-rewardpertoken--"></a>

*Description*: Returns reward per full (10^18) token.

#### Returns
 - rewardPerToken - uint256

### `earned(address account) → uint256` (public) <a name="votingpowerfeesandrewards-earned-address-"></a>

*Description*: Returns earned reward fot account


#### Params
 - `account`: user for which reward amount is requested

#### Returns
 - earned - uint256

### `getReward()` (external) <a name="votingpowerfeesandrewards-getreward--"></a>

*Description*: Pays earned reward to the user

### `notifyRewardAmount(uint256 reward)` (external) <a name="votingpowerfeesandrewards-notifyrewardamount-uint256-"></a>

*Description*: Notifies contract about the reward amount


#### Params
 - `reward`: reward amount
## Events <a name="events"></a>
### event `RewardAdded(uint256 reward)` <a name="votingpowerfeesandrewards-rewardadded-uint256-"></a>


### event `Staked(address user, uint256 amount)` <a name="votingpowerfeesandrewards-staked-address-uint256-"></a>


### event `Withdrawn(address user, uint256 amount)` <a name="votingpowerfeesandrewards-withdrawn-address-uint256-"></a>


### event `RewardPaid(address user, uint256 reward)` <a name="votingpowerfeesandrewards-rewardpaid-address-uint256-"></a>


