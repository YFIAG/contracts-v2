# Controller
*Controller yAgnostic.*

*Description*: Main point of management of all contracts yAgnostic.

## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`constructor(address _rewards)` (public) ](#controller-constructor-address-)
  - [`setRewards(address _rewards)` (external) ](#controller-setrewards-address-)
  - [`setStrategist(address _strategist)` (external) ](#controller-setstrategist-address-)
  - [`setSplit(uint256 _split)` (external) ](#controller-setsplit-uint256-)
  - [`setOneSplit(address _onesplit)` (external) ](#controller-setonesplit-address-)
  - [`setGovernance(address _governance)` (external) ](#controller-setgovernance-address-)
  - [`setVault(address _token, address _vault)` (external) ](#controller-setvault-address-address-)
  - [`approveStrategy(address _vault, address _strategy)` (external) ](#controller-approvestrategy-address-address-)
  - [`revokeStrategy(address _vault, address _strategy)` (external) ](#controller-revokestrategy-address-address-)
  - [`setStrategy(address _vault, address _strategy)` (external) ](#controller-setstrategy-address-address-)
  - [`earn(address _vault, address _token, uint256 _amount)` (public) ](#controller-earn-address-address-uint256-)
  - [`balanceOf(address _vault) → uint256` (external) ](#controller-balanceof-address-)
  - [`want(address _vault) → address` (external) ](#controller-want-address-)
  - [`withdrawAll(address _vault)` (external) ](#controller-withdrawall-address-)
  - [`inCaseTokensGetStuck(address _token, uint256 _amount)` (external) ](#controller-incasetokensgetstuck-address-uint256-)
  - [`inCaseStrategyTokenGetStuck(address _strategy, address _token)` (external) ](#controller-incasestrategytokengetstuck-address-address-)
  - [`getExpectedReturn(address _strategy, address _token, uint256 parts) → uint256 expected` (external) ](#controller-getexpectedreturn-address-address-uint256-)
  - [`yearn(address _vault, address _token, uint256 parts)` (external) ](#controller-yearn-address-address-uint256-)
  - [`withdraw(uint256 _amount)` (external) ](#controller-withdraw-uint256-)

## Variables <a name="variables"></a>
- `address governance`
- `address strategist`
- `address onesplit`
- `address rewards`
- `mapping(address => address) tokens`
- `mapping(address => address) strategies`
- `mapping(address => mapping(address => bool)) approvedStrategies`
- `uint256 split`
- `uint256 MAX`

## Functions <a name="functions"></a>

### `constructor(address _rewards)` (public) <a name="controller-constructor-address-"></a>

*Description*: Executed when the contract is deployed.

**Dev doc**: Sets the governance address and strategist address equal to the deployer. onesplit fixed address.


#### Params
 - `_rewards`: The address of the rewards.

### `setRewards(address _rewards)` (external) <a name="controller-setrewards-address-"></a>

*Description*: Installs a new rewards address.

**Dev doc**: Can only be called by governance. By default, it is equal to the address specified during deployment.


#### Params
 - `_rewards`: The address of the new rewards.

### `setStrategist(address _strategist)` (external) <a name="controller-setstrategist-address-"></a>

*Description*: Installs a new strategist.

**Dev doc**: Can only be called by governance. By default it is equal to the deployer of the controller.


#### Params
 - `_strategist`: The address of the new strategist.

### `setSplit(uint256 _split)` (external) <a name="controller-setsplit-uint256-"></a>

*Description*: Set split.

**Dev doc**: Can only be called by governance. The maximum value is 10000(100%).


#### Params
 - `_split`: Part of the split.

### `setOneSplit(address _onesplit)` (external) <a name="controller-setonesplit-address-"></a>

*Description*: Sets DEX (1Inch by default) split address.

**Dev doc**: Can only be called by governance.


#### Params
 - `_onesplit`: Address of the DEX split.

### `setGovernance(address _governance)` (external) <a name="controller-setgovernance-address-"></a>

*Description*: Specifies a new governance address.

**Dev doc**: Can only be called by governance.


#### Params
 - `_governance`: Address of the new governance.

### `setVault(address _token, address _vault)` (external) <a name="controller-setvault-address-address-"></a>

*Description*: Binds a token to a vault.

**Dev doc**: Can only be called by governance or strategist.


#### Params
 - `_token`: Address of the token.

 - `_vault`: Address of the vault.

### `approveStrategy(address _vault, address _strategy)` (external) <a name="controller-approvestrategy-address-address-"></a>

*Description*: Approves strategy for binding to vault.

**Dev doc**: Can only be called by governance.


#### Params
 - `_vault`: Address of the vault.

 - `_strategy`: Address of the strategy.

### `revokeStrategy(address _vault, address _strategy)` (external) <a name="controller-revokestrategy-address-address-"></a>

*Description*: Revokes strategy approval for vault.

**Dev doc**: Can only be called by governance.


#### Params
 - `_vault`: Address of the vault.

 - `_strategy`: Address of the strategy.

### `setStrategy(address _vault, address _strategy)` (external) <a name="controller-setstrategy-address-address-"></a>

*Description*: Sets the strategy for the vault.

**Dev doc**: Can only be called by governance or strategist.
Before calling, you need to call the approveStrategy method.


#### Params
 - `_vault`: Address of the vault.

 - `_strategy`: Address of the strategy.

### `earn(address _vault, address _token, uint256 _amount)` (public) <a name="controller-earn-address-address-uint256-"></a>

*Description*: Method transferring tokens to a strategy.

**Dev doc**: Then the strategy transfers tokens to earn.


#### Params
 - `_vault`: Address of the vault.

 - `_token`: Address of the token to earn in.

 - `_amount`: Amount of the tokens.

### `balanceOf(address _vault) → uint256` (external) <a name="controller-balanceof-address-"></a>

*Description*: Сalls the strategy balanceOf.


#### Params
 - `_vault`: Address of the vault.

#### Returns
 - Balance of the strategy related to vault.

### `want(address _vault) → address` (external) <a name="controller-want-address-"></a>

*Description*: // @notice Returns strategy's want token.


#### Params
 - `_vault`: Address of the vault.

#### Returns
 - want token for the strategy.

### `withdrawAll(address _vault)` (external) <a name="controller-withdrawall-address-"></a>

*Description*: // @notice Сalls the strategy withdrawAll.

**Dev doc**: Can only be called by governance or strategist.


#### Params
 - `_vault`: Address of the vault.

### `inCaseTokensGetStuck(address _token, uint256 _amount)` (external) <a name="controller-incasetokensgetstuck-address-uint256-"></a>

*Description*: / @notice Sends the required amount of token to the sender

**Dev doc**: Can only be called by governance or strategist.


#### Params
 - `_token`: Address of the token.

 - `_amount`: Amount of the tokens.

### `inCaseStrategyTokenGetStuck(address _strategy, address _token)` (external) <a name="controller-incasestrategytokengetstuck-address-address-"></a>

*Description*: / @notice Calls withdraw of the strategy token.

**Dev doc**: Can only be called by governance or strategist.


#### Params
 - `_token`: Address of the token.

 - `_strategy`: Address of the strategy.

### `getExpectedReturn(address _strategy, address _token, uint256 parts) → uint256 expected` (external) <a name="controller-getexpectedreturn-address-address-uint256-"></a>

*Description*: / @notice Returns the amount if want token in exchange for token.

**Dev doc**: Call the appropriate method of OneSplit (1Inch by default) DEX


#### Params
 - `_strategy`: Address of the strategy.

 - `_token`: Address of the token.

 - `parts`: Amount of token.

### `yearn(address _vault, address _token, uint256 parts)` (external) <a name="controller-yearn-address-address-uint256-"></a>

*Description*: / @notice Calls earn and transfer rewords

**Dev doc**: Can only be called by governance or strategist.
This contract should never have value in it, but just incase since this is a public call.


#### Params
 - `_vault`: Address of the vault.

 - `parts`: Need for IOneSplitAudit.

### `withdraw(uint256 _amount)` (external) <a name="controller-withdraw-uint256-"></a>

*Description*: / @notice Сalls the strategy withdraw.

**Dev doc**: Can only be called by vault.


#### Params
 - `_amount`: Amount of the tokens.
