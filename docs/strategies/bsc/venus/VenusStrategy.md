# VenusStrategy
**


## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`constructor(address _vault, address _underlying, address _strategist, address _vtoken, address _venusReward, address _router)` (public) ](#venusstrategy-constructor-address-address-address-address-address-address-)
  - [`getNameStrategy() → string` (external) ](#venusstrategy-getnamestrategy--)
  - [`want() → address` (external) ](#venusstrategy-want--)
  - [`balanceOf() → uint256` (external) ](#venusstrategy-balanceof--)
  - [`deposit()` (public) ](#venusstrategy-deposit--)
  - [`withdraw(uint256 amount)` (external) ](#venusstrategy-withdraw-uint256-)
  - [`withdrawAll()` (external) ](#venusstrategy-withdrawall--)
  - [`emergencyExit()` (external) ](#venusstrategy-emergencyexit--)
  - [`earn()` (public) ](#venusstrategy-earn--)
  - [`claimVenus()` (public) ](#venusstrategy-claimvenus--)
  - [`liquidateVenus()` (public) ](#venusstrategy-liquidatevenus--)
  - [`convert(address) → uint256` (external) ](#venusstrategy-convert-address-)
  - [`skim()` (external) ](#venusstrategy-skim--)

## Variables <a name="variables"></a>
- `address router`

## Functions <a name="functions"></a>

### `constructor(address _vault, address _underlying, address _strategist, address _vtoken, address _venusReward, address _router)` (public) <a name="venusstrategy-constructor-address-address-address-address-address-address-"></a>


### `getNameStrategy() → string` (external) <a name="venusstrategy-getnamestrategy--"></a>


### `want() → address` (external) <a name="venusstrategy-want--"></a>


### `balanceOf() → uint256` (external) <a name="venusstrategy-balanceof--"></a>

*Description*: Returns the current balance. Ignores COMP/CREAM that was not liquidated and invested.

### `deposit()` (public) <a name="venusstrategy-deposit--"></a>

*Description*: The strategy invests by supplying the underlying as a collateral.

### `withdraw(uint256 amount)` (external) <a name="venusstrategy-withdraw-uint256-"></a>


### `withdrawAll()` (external) <a name="venusstrategy-withdrawall--"></a>

*Description*: Exits Compound and transfers everything to the vault.

### `emergencyExit()` (external) <a name="venusstrategy-emergencyexit--"></a>


### `earn()` (public) <a name="venusstrategy-earn--"></a>

*Description*: Withdraws all assets, liquidates Venus, and invests again in the required ratio.

### `claimVenus()` (public) <a name="venusstrategy-claimvenus--"></a>


### `liquidateVenus()` (public) <a name="venusstrategy-liquidatevenus--"></a>


### `convert(address) → uint256` (external) <a name="venusstrategy-convert-address-"></a>


### `skim()` (external) <a name="venusstrategy-skim--"></a>

