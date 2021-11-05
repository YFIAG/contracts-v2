# BscBridge
**


## Table of contents:
- [Functions:](#functions)
  - [`constructor(address _token)` (public) ](#bscbridge-constructor-address-)
  - [`sendTokens(address _to, uint256 _amount, bytes _signature)` (external) ](#bscbridge-sendtokens-address-uint256-bytes-)
  - [`unlockTokens(address _from, address _to, uint256 _amount, uint256 ETHTransactionId, bytes _signature)` (external) ](#bscbridge-unlocktokens-address-address-uint256-uint256-bytes-)


## Functions <a name="functions"></a>

### `constructor(address _token)` (public) <a name="bscbridge-constructor-address-"></a>


### `sendTokens(address _to, uint256 _amount, bytes _signature)` (external) <a name="bscbridge-sendtokens-address-uint256-bytes-"></a>

*Description*: This function is called in order to send tokens from Binance Smart Chain
        to Ethereum
        @notice Sender doesn't need to approve tokens to contract in order to send them, but
        a valid amount of tokens must be on user's account
        @notice If function call is successful, an event is emitted and bridge API
        sends tokens on Ethereum
        @notice Can be called by anyone
        @param _to A receiver address on Ethereum
        @param _amount Amount of tokens to burn on BSC and unlock on Ethereum
        @param _signature A message, signed by sender, required in order to make transaction
        secure

### `unlockTokens(address _from, address _to, uint256 _amount, uint256 ETHTransactionId, bytes _signature)` (external) <a name="bscbridge-unlocktokens-address-address-uint256-uint256-bytes-"></a>

*Description*: This function can called only by Bridge API
        @notice Once an event is emitted on Ethereum, pointing that transaction is requested,
        some amount of tokens are locked on Ethereum and minted on BSC
        @param _from An address on Ethereum which sent a transaction. Required in order to check
        that transaction is valid
        @param _to A receiver address on Binance Smart Chain
        @param _amount Amount of tokens to be minted
        @param  ETHTransactionId Transaction nonce, required to check that transaction is valid
        @param _signature A message, signed by sender, required in order to make transaction
        secure
