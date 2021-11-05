# BoilerplateStrategy
**


## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`constructor(address _vault, address _underlying, address _strategist)` (public) ](#boilerplatestrategy-constructor-address-address-address-)
  - [`setController(address _controller)` (external) ](#boilerplatestrategy-setcontroller-address-)
  - [`setStrategist(address _strategist)` (external) ](#boilerplatestrategy-setstrategist-address-)
  - [`setProfitSharing(uint256 _profitSharingNumerator, uint256 _profitSharingDenominator)` (external) ](#boilerplatestrategy-setprofitsharing-uint256-uint256-)
  - [`setHarvestOnWithdraw(bool _flag)` (external) ](#boilerplatestrategy-setharvestonwithdraw-bool-)
  - [`setLiquidationAllowed(bool allowed)` (external) ](#boilerplatestrategy-setliquidationallowed-bool-)
  - [`setSellFloor(uint256 value)` (external) ](#boilerplatestrategy-setsellfloor-uint256-)
  - [`withdraw(address token)` (external) ](#boilerplatestrategy-withdraw-address-)
- [Events:](#events)

## Variables <a name="variables"></a>
- `address underlying`
- `address strategist`
- `address controller`
- `address vault`
- `uint256 profitSharingNumerator`
- `uint256 profitSharingDenominator`
- `bool harvestOnWithdraw`
- `bool liquidationAllowed`
- `uint256 sellFloor`
- `mapping(address => bool) unsalvageableTokens`

## Functions <a name="functions"></a>

### `constructor(address _vault, address _underlying, address _strategist)` (public) <a name="boilerplatestrategy-constructor-address-address-address-"></a>


### `setController(address _controller)` (external) <a name="boilerplatestrategy-setcontroller-address-"></a>


### `setStrategist(address _strategist)` (external) <a name="boilerplatestrategy-setstrategist-address-"></a>


### `setProfitSharing(uint256 _profitSharingNumerator, uint256 _profitSharingDenominator)` (external) <a name="boilerplatestrategy-setprofitsharing-uint256-uint256-"></a>


### `setHarvestOnWithdraw(bool _flag)` (external) <a name="boilerplatestrategy-setharvestonwithdraw-bool-"></a>


### `setLiquidationAllowed(bool allowed)` (external) <a name="boilerplatestrategy-setliquidationallowed-bool-"></a>

*Description*: Allows liquidation

### `setSellFloor(uint256 value)` (external) <a name="boilerplatestrategy-setsellfloor-uint256-"></a>


### `withdraw(address token)` (external) <a name="boilerplatestrategy-withdraw-address-"></a>

*Description*: Withdraws a token.

### `_profitSharing(uint256 amount)` (internal) <a name="boilerplatestrategy-_profitsharing-uint256-"></a>

## Events <a name="events"></a>
### event `ProfitShared(uint256 amount, uint256 fee, uint256 timestamp)` <a name="boilerplatestrategy-profitshared-uint256-uint256-uint256-"></a>


### event `SettingChanged(enum BoilerplateStrategy.Setting setting, address initiator, uint256 timestamp)` <a name="boilerplatestrategy-settingchanged-enum-boilerplatestrategy-setting-address-uint256-"></a>


