# ECDSA
**


## Table of contents:
- [Functions:](#functions)
  - [`isMessageValid(bytes message) → bool` (public) ](#ecdsa-ismessagevalid-bytes-)
  - [`formMessage(address from, address to, uint256 amount, uint256 nonce) → bytes32` (external) ](#ecdsa-formmessage-address-address-uint256-uint256-)
  - [`recoverAddress(bytes32 message, bytes signature) → address` (external) ](#ecdsa-recoveraddress-bytes32-bytes-)


## Functions <a name="functions"></a>

### `isMessageValid(bytes message) → bool` (public) <a name="ecdsa-ismessagevalid-bytes-"></a>


### `formMessage(address from, address to, uint256 amount, uint256 nonce) → bytes32` (external) <a name="ecdsa-formmessage-address-address-uint256-uint256-"></a>


### `hashMessage(bytes32 message) → bytes32` (internal) <a name="ecdsa-hashmessage-bytes32-"></a>


### `recoverAddress(bytes32 message, bytes signature) → address` (external) <a name="ecdsa-recoveraddress-bytes32-bytes-"></a>

**Dev doc**: Returns the address that signed a hashed message (`hash`) with
`signature`. This address can then be used for verification purposes.

The `ecrecover` EVM opcode allows for malleable (non-unique) signatures:
this function rejects them by requiring the `s` value to be in the lower
half order, and the `v` value to be either 27 or 28.

IMPORTANT: `hash` _must_ be the result of a hash operation for the
verification to be secure: it is possible to craft signatures that
recover to arbitrary addresses for non-hashed data. A safe way to ensure
this is by receiving a hash of the original message (which may otherwise
be too long), and then calling {toEthSignedMessageHash} on it.
/

### `parseMessage(bytes message) → address recipient, uint256 amount, uint256 txHash, uint256 nonce, address contractAddress` (internal) <a name="ecdsa-parsemessage-bytes-"></a>

