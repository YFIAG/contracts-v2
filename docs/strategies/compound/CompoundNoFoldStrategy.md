# CompoundNoFoldStrategy
**


## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`constructor(address _vault, address _underlying, address _strategist, address _ctoken, address _uniswap)` (public) ](#compoundnofoldstrategy-constructor-address-address-address-address-address-)
  - [`getNameStrategy() → string` (external) ](#compoundnofoldstrategy-getnamestrategy--)
  - [`want() → address` (external) ](#compoundnofoldstrategy-want--)
  - [`balanceOf() → uint256` (external) ](#compoundnofoldstrategy-balanceof--)
  - [`deposit()` (public) ](#compoundnofoldstrategy-deposit--)
  - [`withdraw(uint256 amount)` (external) ](#compoundnofoldstrategy-withdraw-uint256-)
  - [`withdrawAll()` (external) ](#compoundnofoldstrategy-withdrawall--)
  - [`emergencyExit()` (external) ](#compoundnofoldstrategy-emergencyexit--)
  - [`earn()` (public) ](#compoundnofoldstrategy-earn--)
  - [`claimComp()` (public) ](#compoundnofoldstrategy-claimcomp--)
  - [`liquidateComp()` (public) ](#compoundnofoldstrategy-liquidatecomp--)
  - [`convert(address) → uint256` (external) ](#compoundnofoldstrategy-convert-address-)
  - [`skim()` (external) ](#compoundnofoldstrategy-skim--)

## Variables <a name="variables"></a>
- `address uniswapRouter`

## Functions <a name="functions"></a>

### `constructor(address _vault, address _underlying, address _strategist, address _ctoken, address _uniswap)` (public) <a name="compoundnofoldstrategy-constructor-address-address-address-address-address-"></a>


### `getNameStrategy() → string` (external) <a name="compoundnofoldstrategy-getnamestrategy--"></a>


### `want() → address` (external) <a name="compoundnofoldstrategy-want--"></a>


### `balanceOf() → uint256` (external) <a name="compoundnofoldstrategy-balanceof--"></a>

*Description*: Returns the current balance. Ignores COMP/CREAM that was not liquidated and invested.

### `deposit()` (public) <a name="compoundnofoldstrategy-deposit--"></a>

*Description*: The strategy invests by supplying the underlying as a collateral.

### `withdraw(uint256 amount)` (external) <a name="compoundnofoldstrategy-withdraw-uint256-"></a>


### `withdrawAll()` (external) <a name="compoundnofoldstrategy-withdrawall--"></a>

*Description*: Exits Compound and transfers everything to the vault.

### `emergencyExit()` (external) <a name="compoundnofoldstrategy-emergencyexit--"></a>


### `earn()` (public) <a name="compoundnofoldstrategy-earn--"></a>

*Description*: Withdraws all assets, liquidates COMP/CREAM, and invests again in the required ratio.

### `claimComp()` (public) <a name="compoundnofoldstrategy-claimcomp--"></a>


### `liquidateComp()` (public) <a name="compoundnofoldstrategy-liquidatecomp--"></a>


### `convert(address) → uint256` (external) <a name="compoundnofoldstrategy-convert-address-"></a>


### `skim()` (external) <a name="compoundnofoldstrategy-skim--"></a>

