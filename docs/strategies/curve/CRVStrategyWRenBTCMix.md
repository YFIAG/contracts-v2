# CRVStrategyWRenBTCMix
**


## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`constructor(address _vault, address _underlying, address _strategist, uint256 _tokenIndex, address _curvePool, address _gauge, address _uniswap, address _secondAsset)` (public) ](#crvstrategywrenbtcmix-constructor-address-address-address-uint256-address-address-address-address-)
  - [`getNameStrategy() → string` (external) ](#crvstrategywrenbtcmix-getnamestrategy--)
  - [`want() → address` (external) ](#crvstrategywrenbtcmix-want--)
  - [`balanceOf() → uint256` (external) ](#crvstrategywrenbtcmix-balanceof--)
  - [`deposit()` (public) ](#crvstrategywrenbtcmix-deposit--)
  - [`withdraw(uint256 amountUnderlying)` (public) ](#crvstrategywrenbtcmix-withdraw-uint256-)
  - [`withdrawAll()` (external) ](#crvstrategywrenbtcmix-withdrawall--)
  - [`emergencyExit()` (external) ](#crvstrategywrenbtcmix-emergencyexit--)
  - [`earn()` (public) ](#crvstrategywrenbtcmix-earn--)
  - [`claimAndLiquidateCrv()` (public) ](#crvstrategywrenbtcmix-claimandliquidatecrv--)
  - [`convert(address) → uint256` (external) ](#crvstrategywrenbtcmix-convert-address-)
  - [`skim()` (external) ](#crvstrategywrenbtcmix-skim--)
- [Events:](#events)

## Variables <a name="variables"></a>
- `enum CRVStrategyWRenBTCMix.TokenIndex tokenIndex`
- `address curve`
- `address gauge`
- `address mintr`
- `address crv`
- `address uniswapRouter`
- `address secondAsset`
- `address[] uniswap_CRV2WBTC`

## Functions <a name="functions"></a>

### `constructor(address _vault, address _underlying, address _strategist, uint256 _tokenIndex, address _curvePool, address _gauge, address _uniswap, address _secondAsset)` (public) <a name="crvstrategywrenbtcmix-constructor-address-address-address-uint256-address-address-address-address-"></a>


### `getNameStrategy() → string` (external) <a name="crvstrategywrenbtcmix-getnamestrategy--"></a>

*Description*: Returns the name of the strategy

**Dev doc**: The name is set when the strategy is deployed

#### Returns
 - Returns the name of the strategy

### `want() → address` (external) <a name="crvstrategywrenbtcmix-want--"></a>

*Description*: Returns the want address of the strategy

**Dev doc**: The want is set when the strategy is deployed

#### Returns
 - Returns the name of the strategy

### `balanceOf() → uint256` (external) <a name="crvstrategywrenbtcmix-balanceof--"></a>

*Description*: Shows the balance of the strategy.

### `deposit()` (public) <a name="crvstrategywrenbtcmix-deposit--"></a>

*Description*: Transfers tokens for earnings

### `withdraw(uint256 amountUnderlying)` (public) <a name="crvstrategywrenbtcmix-withdraw-uint256-"></a>

*Description*: Withdraws the yCRV tokens from the pool in the specified amount.

### `withdrawAll()` (external) <a name="crvstrategywrenbtcmix-withdrawall--"></a>

*Description*: Controller | Vault role - withdraw should always return to Vault

### `emergencyExit()` (external) <a name="crvstrategywrenbtcmix-emergencyexit--"></a>


### `earn()` (public) <a name="crvstrategywrenbtcmix-earn--"></a>

*Description*: Claims and liquidates CRV into yCRV, and then invests all underlying.

### `mixFromWBTC()` (internal) <a name="crvstrategywrenbtcmix-mixfromwbtc--"></a>

*Description*: Uses the Curve protocol to convert the wbtc asset into to mixed renwbtc token.

### `investMixedCoin()` (internal) <a name="crvstrategywrenbtcmix-investmixedcoin--"></a>

*Description*: Invests all wbtc-pool LP-tokens into our underlying vault.

### `withdrawMixTokens(uint256 lpAmount)` (internal) <a name="crvstrategywrenbtcmix-withdrawmixtokens-uint256-"></a>

*Description*: Withdraws an wbtc asset from the strategy to the vault in the specified amount by asking
by removing imbalanced liquidity from the Curve protocol. The rest is deposited back to the
Curve protocol pool. If the amount requested cannot be obtained, the method will get as much
as we have.

### `investedUnderlyingBalance() → uint256` (internal) <a name="crvstrategywrenbtcmix-investedunderlyingbalance--"></a>

*Description*: Returns the wbtc invested balance. The is the wbtc amount in this stragey, plus the gauge
amount of the mixed token converted back to wbtc.

### `wrapCoinAmount(uint256 underlyingAmount, uint256 secondAssetAmount) → uint256[2]` (internal) <a name="crvstrategywrenbtcmix-wrapcoinamount-uint256-uint256-"></a>

*Description*: Wraps the coin amount in the array for interacting with the Curve protocol

### `claimAndLiquidateCrv()` (public) <a name="crvstrategywrenbtcmix-claimandliquidatecrv--"></a>

*Description*: Claims the CRV crop, converts it to DAI on Uniswap, and then uses DAI to mint yCRV using the
Curve protocol.

### `calcLPAmount(uint256 amountUnderlying) → uint256` (internal) <a name="crvstrategywrenbtcmix-calclpamount-uint256-"></a>


### `convert(address) → uint256` (external) <a name="crvstrategywrenbtcmix-convert-address-"></a>


### `skim()` (external) <a name="crvstrategywrenbtcmix-skim--"></a>

## Events <a name="events"></a>
### event `Liquidating(uint256 amount)` <a name="crvstrategywrenbtcmix-liquidating-uint256-"></a>


### event `NotLiquidating(uint256 amount)` <a name="crvstrategywrenbtcmix-notliquidating-uint256-"></a>


### event `ProfitsNotCollected()` <a name="crvstrategywrenbtcmix-profitsnotcollected--"></a>


