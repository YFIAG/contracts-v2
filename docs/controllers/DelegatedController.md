# DelegatedController
**


## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`constructor(address _rewards)` (public) ](#delegatedcontroller-constructor-address-)
  - [`setSplit(uint256 _split)` (external) ](#delegatedcontroller-setsplit-uint256-)
  - [`setOneSplit(address _onesplit)` (external) ](#delegatedcontroller-setonesplit-address-)
  - [`setGovernance(address _governance)` (external) ](#delegatedcontroller-setgovernance-address-)
  - [`setStrategy(address _vault, address _strategy)` (external) ](#delegatedcontroller-setstrategy-address-address-)
  - [`want(address _vault) → address` (external) ](#delegatedcontroller-want-address-)
  - [`earn(address _vault, uint256 _amount)` (public) ](#delegatedcontroller-earn-address-uint256-)
  - [`balanceOf(address _vault) → uint256` (external) ](#delegatedcontroller-balanceof-address-)
  - [`withdrawAll(address _strategy)` (external) ](#delegatedcontroller-withdrawall-address-)
  - [`inCaseTokensGetStuck(address _token, uint256 _amount)` (external) ](#delegatedcontroller-incasetokensgetstuck-address-uint256-)
  - [`inCaseStrategyGetStruck(address _strategy, address _token)` (external) ](#delegatedcontroller-incasestrategygetstruck-address-address-)
  - [`claimInsurance(address _vault)` (external) ](#delegatedcontroller-claiminsurance-address-)
  - [`delegatedHarvest(address _strategy, uint256 parts)` (external) ](#delegatedcontroller-delegatedharvest-address-uint256-)
  - [`harvest(address _strategy, address _token, uint256 parts)` (external) ](#delegatedcontroller-harvest-address-address-uint256-)
  - [`withdraw(address _vault, uint256 _amount)` (external) ](#delegatedcontroller-withdraw-address-uint256-)

## Variables <a name="variables"></a>
- `address governance`
- `address onesplit`
- `address rewards`
- `mapping(address => address) vaults`
- `mapping(address => address) strategies`
- `mapping(address => bool) isVault`
- `mapping(address => bool) isStrategy`
- `uint256 split`
- `uint256 max`

## Functions <a name="functions"></a>

### `constructor(address _rewards)` (public) <a name="delegatedcontroller-constructor-address-"></a>


### `setSplit(uint256 _split)` (external) <a name="delegatedcontroller-setsplit-uint256-"></a>


### `setOneSplit(address _onesplit)` (external) <a name="delegatedcontroller-setonesplit-address-"></a>


### `setGovernance(address _governance)` (external) <a name="delegatedcontroller-setgovernance-address-"></a>


### `setStrategy(address _vault, address _strategy)` (external) <a name="delegatedcontroller-setstrategy-address-address-"></a>


### `want(address _vault) → address` (external) <a name="delegatedcontroller-want-address-"></a>


### `earn(address _vault, uint256 _amount)` (public) <a name="delegatedcontroller-earn-address-uint256-"></a>


### `balanceOf(address _vault) → uint256` (external) <a name="delegatedcontroller-balanceof-address-"></a>


### `withdrawAll(address _strategy)` (external) <a name="delegatedcontroller-withdrawall-address-"></a>


### `inCaseTokensGetStuck(address _token, uint256 _amount)` (external) <a name="delegatedcontroller-incasetokensgetstuck-address-uint256-"></a>


### `inCaseStrategyGetStruck(address _strategy, address _token)` (external) <a name="delegatedcontroller-incasestrategygetstruck-address-address-"></a>


### `claimInsurance(address _vault)` (external) <a name="delegatedcontroller-claiminsurance-address-"></a>


### `delegatedHarvest(address _strategy, uint256 parts)` (external) <a name="delegatedcontroller-delegatedharvest-address-uint256-"></a>


### `harvest(address _strategy, address _token, uint256 parts)` (external) <a name="delegatedcontroller-harvest-address-address-uint256-"></a>


### `withdraw(address _vault, uint256 _amount)` (external) <a name="delegatedcontroller-withdraw-address-uint256-"></a>

