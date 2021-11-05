# CRVStrategyStable
**

*Description*: The goal of this strategy is to take a stable asset (DAI, USDC, USDT), turn it into ycrv using
the curve mechanisms, and supply ycrv into the ycrv vault. The ycrv vault will likely not have
a reward token distribution pool to avoid double dipping. All the calls to functions from this
strategy will be routed to the controller which should then call the respective methods on the
ycrv vault. This strategy will not be liquidating any yield crops (CRV), because the strategy
of the ycrv vault will do that for us.

## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`constructor(address _vault, address _underlying, address _strategist, address _curve, address _swap, address _ycrv, address _yycrv, address _yToken, uint256 _tokenIndex)` (public) ](#crvstrategystable-constructor-address-address-address-address-address-address-address-address-uint256-)
  - [`getNameStrategy() → string` (external) ](#crvstrategystable-getnamestrategy--)
  - [`want() → address` (external) ](#crvstrategystable-want--)
  - [`balanceOf() → uint256` (public) ](#crvstrategystable-balanceof--)
  - [`balanceOfUnderlying() → uint256` (public) ](#crvstrategystable-balanceofunderlying--)
  - [`deposit()` (public) ](#crvstrategystable-deposit--)
  - [`withdraw(uint256 amountUnderlying)` (public) ](#crvstrategystable-withdraw-uint256-)
  - [`withdrawAll()` (external) ](#crvstrategystable-withdrawall--)
  - [`emergencyExit()` (external) ](#crvstrategystable-emergencyexit--)
  - [`earn()` (public) ](#crvstrategystable-earn--)
  - [`convert(address) → uint256` (external) ](#crvstrategystable-convert-address-)
  - [`skim()` (external) ](#crvstrategystable-skim--)

## Variables <a name="variables"></a>
- `enum CRVStrategyStable.TokenIndex tokenIndex`
- `address yToken`
- `address ycrv`
- `address yycrv`
- `address curve`
- `address swap`

## Functions <a name="functions"></a>

### `constructor(address _vault, address _underlying, address _strategist, address _curve, address _swap, address _ycrv, address _yycrv, address _yToken, uint256 _tokenIndex)` (public) <a name="crvstrategystable-constructor-address-address-address-address-address-address-address-address-uint256-"></a>


### `getNameStrategy() → string` (external) <a name="crvstrategystable-getnamestrategy--"></a>


### `want() → address` (external) <a name="crvstrategystable-want--"></a>


### `balanceOf() → uint256` (public) <a name="crvstrategystable-balanceof--"></a>

*Description*: Returns the underlying invested balance. This is the amount of yCRV that we are entitled to
from the yCRV vault (based on the number of shares we currently have), converted to the
underlying assets by the Curve protocol, plus the current balance of the underlying assets.

### `balanceOfUnderlying() → uint256` (public) <a name="crvstrategystable-balanceofunderlying--"></a>


### `deposit()` (public) <a name="crvstrategystable-deposit--"></a>

*Description*: Invests all underlying assets into our yCRV vault.

### `withdraw(uint256 amountUnderlying)` (public) <a name="crvstrategystable-withdraw-uint256-"></a>

*Description*: Withdraws an underlying asset from the strategy to the vault in the specified amount by asking
the yCRV vault for yCRV (currently all of it), and then removing imbalanced liquidity from
the Curve protocol. The rest is deposited back to the yCRV vault. If the amount requested cannot
be obtained, the method will get as much as we have.

### `withdrawAll()` (external) <a name="crvstrategystable-withdrawall--"></a>

*Description*: Withdraws all the yCRV tokens to the pool.

### `emergencyExit()` (external) <a name="crvstrategystable-emergencyexit--"></a>


### `earn()` (public) <a name="crvstrategystable-earn--"></a>

*Description*: Claims and liquidates CRV into yCRV, and then invests all underlying.

### `yCurveFromUnderlying()` (internal) <a name="crvstrategystable-ycurvefromunderlying--"></a>

*Description*: Uses the Curve protocol to convert the underlying asset into yAsset and then to yCRV.

### `_withdrawSome(uint256 _amount) → uint256` (internal) <a name="crvstrategystable-_withdrawsome-uint256-"></a>


### `_withdrawAll() → uint256` (internal) <a name="crvstrategystable-_withdrawall--"></a>


### `withdrawUnderlying(uint256 _amount) → uint256` (internal) <a name="crvstrategystable-withdrawunderlying-uint256-"></a>


### `wrapCoinAmount(uint256 amount) → uint256[4]` (internal) <a name="crvstrategystable-wrapcoinamount-uint256-"></a>

*Description*: Wraps the coin amount in the array for interacting with the Curve protocol

### `convert(address) → uint256` (external) <a name="crvstrategystable-convert-address-"></a>


### `skim()` (external) <a name="crvstrategystable-skim--"></a>

