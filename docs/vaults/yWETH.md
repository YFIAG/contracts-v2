# yWETH
**


## Table of contents:
- [Functions:](#functions)
  - [`constructor(address _token, address _controller)` (public) ](#yweth-constructor-address-address-)
  - [`depositETH()` (public) ](#yweth-depositeth--)
  - [`withdrawAllETH()` (external) ](#yweth-withdrawalleth--)
  - [`withdrawETH(uint256 _shares)` (public) ](#yweth-withdraweth-uint256-)
  - [`receive()` (external) ](#yweth-receive--)


## Functions <a name="functions"></a>

### `constructor(address _token, address _controller)` (public) <a name="yweth-constructor-address-address-"></a>


### `depositETH()` (public) <a name="yweth-depositeth--"></a>

*Description*: Wraps sent amount of Eth into the WETH ERC20 and performs regular deposit.

### `withdrawAllETH()` (external) <a name="yweth-withdrawalleth--"></a>

*Description*: Withdraws the sender's shares in a form of Eth.

### `withdrawETH(uint256 _shares)` (public) <a name="yweth-withdraweth-uint256-"></a>

*Description*: Wraps sent amount of Eth into the WETH ERC20 and performs regular deposit.


#### Params
 - `_shares`: Vault shares which will be withdraw in a form of Eth

### `receive()` (external) <a name="yweth-receive--"></a>

*Description*: Payable function to receive Eth directly from the user (insted of depositETH)
