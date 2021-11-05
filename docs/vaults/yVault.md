# yVault
*yVault yAgnostic.*

**Dev doc**: yVault inherits ERC20.

## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`constructor(address _token, address _controller)` (public) ](#yvault-constructor-address-address-)
  - [`pause()` (external) ](#yvault-pause--)
  - [`unpause()` (external) ](#yvault-unpause--)
  - [`setMin(uint256 _min)` (external) ](#yvault-setmin-uint256-)
  - [`setGovernance(address _governance)` (external) ](#yvault-setgovernance-address-)
  - [`setController(address _controller)` (external) ](#yvault-setcontroller-address-)
  - [`earn()` (external) ](#yvault-earn--)
  - [`harvest(address reserve, uint256 amount)` (external) ](#yvault-harvest-address-uint256-)
  - [`depositAll()` (external) ](#yvault-depositall--)
  - [`deposit(uint256 _amount)` (public) ](#yvault-deposit-uint256-)
  - [`withdrawAll()` (external) ](#yvault-withdrawall--)
  - [`withdraw(uint256 _shares)` (public) ](#yvault-withdraw-uint256-)
  - [`getPricePerFullShare() → uint256` (external) ](#yvault-getpriceperfullshare--)
  - [`balance() → uint256` (public) ](#yvault-balance--)
  - [`available() → uint256` (public) ](#yvault-available--)

## Variables <a name="variables"></a>
- `address token`
- `uint256 min`
- `uint256 MAX`
- `address governance`
- `address controller`

## Functions <a name="functions"></a>

### `constructor(address _token, address _controller)` (public) <a name="yvault-constructor-address-address-"></a>

*Description*: Sets token name: yfiag + name, token symbol: y + symbol.
Sets the governance address equal to the deployer.


#### Params
 - `_token`: Address of the token the vault work with.

 - `_controller`: Address of the controller.

### `pause()` (external) <a name="yvault-pause--"></a>

*Description*: called by the owner to pause, triggers stopped state

### `unpause()` (external) <a name="yvault-unpause--"></a>

*Description*: called by the owner to unpause, returns to normal state

### `setMin(uint256 _min)` (external) <a name="yvault-setmin-uint256-"></a>

*Description*: Set percentage of tokens allowed for the strategy.

**Dev doc**: Can only be called by governance. The maximum value is 10000(100%).


#### Params
 - `_min`: Percentage to calculate available.

### `setGovernance(address _governance)` (external) <a name="yvault-setgovernance-address-"></a>

*Description*: Specifies a new governance address.

**Dev doc**: Can only be called by governance.


#### Params
 - `_governance`: Address of the new governance.

### `setController(address _controller)` (external) <a name="yvault-setcontroller-address-"></a>

*Description*: Specifies a new controller address.

**Dev doc**: Can only be called by governance.


#### Params
 - `_controller`: Address of the new controller.

### `earn()` (external) <a name="yvault-earn--"></a>

*Description*: Method transferring tokens to a strategy through controller.

### `harvest(address reserve, uint256 amount)` (external) <a name="yvault-harvest-address-uint256-"></a>

*Description*: Used to swap any borrowed reserve over the debt limit to liquidate to underlying 'token'


#### Params
 - `reserve`: Address of the reserve token.

 - `amount`: Amount of the tokens.

### `depositAll()` (external) <a name="yvault-depositall--"></a>

*Description*: Causes the deposit of all available sender tokens.

### `deposit(uint256 _amount)` (public) <a name="yvault-deposit-uint256-"></a>

*Description*: Causes the deposit of amount sender tokens.


#### Params
 - `_amount`: Amount of the tokens.

### `withdrawAll()` (external) <a name="yvault-withdrawall--"></a>

*Description*: Causes the withdraw of all available sender shares.

### `withdraw(uint256 _shares)` (public) <a name="yvault-withdraw-uint256-"></a>

*Description*: Causes the withdraw of amount sender shares.


#### Params
 - `_shares`: Amount of the shares.

### `getPricePerFullShare() → uint256` (external) <a name="yvault-getpriceperfullshare--"></a>

*Description*: Сalculates the price per full share.

#### Returns
 - Returns the price per full share.

### `balance() → uint256` (public) <a name="yvault-balance--"></a>

*Description*: // @notice Shows how many tokens are available (in total in the volt and deposited to the strategy).

### `available() → uint256` (public) <a name="yvault-available--"></a>

*Description*: // @notice Сalculates the available amount that can be transferred to the strategy.

**Dev doc**: Custom logic in here for how much the vault allows to be borrowed
Sets minimum required on-hand to keep small withdrawals cheap

#### Returns
 - Returns the available vault.
