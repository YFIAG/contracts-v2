# CRVStrategyYCRV
**

*Description*: This strategy is for the yCRV vault, i.e., the underlying token is yCRV. It is not to accept
stable coins. It will farm the CRV crop. For liquidation, it swaps CRV into DAI and uses DAI
to produce yCRV.

## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`constructor(address _vault, address _underlying, address _strategist, address _pool, address _curve, address _dai, address _uniswap)` (public) ](#crvstrategyycrv-constructor-address-address-address-address-address-address-address-)
  - [`getNameStrategy() → string` (external) ](#crvstrategyycrv-getnamestrategy--)
  - [`want() → address` (external) ](#crvstrategyycrv-want--)
  - [`balanceOf() → uint256` (public) ](#crvstrategyycrv-balanceof--)
  - [`deposit()` (public) ](#crvstrategyycrv-deposit--)
  - [`withdraw(uint256 amountUnderlying)` (public) ](#crvstrategyycrv-withdraw-uint256-)
  - [`withdrawAll()` (external) ](#crvstrategyycrv-withdrawall--)
  - [`emergencyExit()` (external) ](#crvstrategyycrv-emergencyexit--)
  - [`earn()` (public) ](#crvstrategyycrv-earn--)
  - [`convert(address) → uint256` (external) ](#crvstrategyycrv-convert-address-)
  - [`skim()` (external) ](#crvstrategyycrv-skim--)
  - [`claimAndLiquidateCrv()` (public) ](#crvstrategyycrv-claimandliquidatecrv--)

## Variables <a name="variables"></a>
- `address pool`
- `address mintr`
- `address crv`
- `address curve`
- `address dai`
- `address uniswapRouter`
- `address[] uniswap_CRV2DAI`

## Functions <a name="functions"></a>

### `constructor(address _vault, address _underlying, address _strategist, address _pool, address _curve, address _dai, address _uniswap)` (public) <a name="crvstrategyycrv-constructor-address-address-address-address-address-address-address-"></a>


### `getNameStrategy() → string` (external) <a name="crvstrategyycrv-getnamestrategy--"></a>


### `want() → address` (external) <a name="crvstrategyycrv-want--"></a>


### `balanceOf() → uint256` (public) <a name="crvstrategyycrv-balanceof--"></a>

*Description*: Balance of invested.

### `deposit()` (public) <a name="crvstrategyycrv-deposit--"></a>

*Description*: Invests all the underlying yCRV into the pool that mints crops (CRV_.

### `withdraw(uint256 amountUnderlying)` (public) <a name="crvstrategyycrv-withdraw-uint256-"></a>

*Description*: Withdraws the yCRV tokens from the pool in the specified amount.

### `withdrawAll()` (external) <a name="crvstrategyycrv-withdrawall--"></a>

*Description*: Withdraws all the yCRV tokens to the pool.

### `emergencyExit()` (external) <a name="crvstrategyycrv-emergencyexit--"></a>


### `earn()` (public) <a name="crvstrategyycrv-earn--"></a>

*Description*: Claims and liquidates CRV into yCRV, and then invests all underlying.

### `convert(address) → uint256` (external) <a name="crvstrategyycrv-convert-address-"></a>


### `skim()` (external) <a name="crvstrategyycrv-skim--"></a>


### `claimAndLiquidateCrv()` (public) <a name="crvstrategyycrv-claimandliquidatecrv--"></a>

*Description*: Claims the CRV crop, converts it to DAI on Uniswap, and then uses DAI to mint yCRV using the
Curve protocol.

### `withdrawYCrvFromPool(uint256 amount)` (internal) <a name="crvstrategyycrv-withdrawycrvfrompool-uint256-"></a>

*Description*: Withdraws yCRV from the investment pool that mints crops.

### `yCurveFromDai()` (internal) <a name="crvstrategyycrv-ycurvefromdai--"></a>

*Description*: Converts all DAI to yCRV using the CRV protocol.

### `_profitSharing(uint256 amount)` (internal) <a name="crvstrategyycrv-_profitsharing-uint256-"></a>

