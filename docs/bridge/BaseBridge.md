# BaseBridge
**


## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`constructor(address _token)` (public) ](#basebridge-constructor-address-)
  - [`GetTransactionId() → uint256` (external) ](#basebridge-gettransactionid--)
- [Events:](#events)

## Variables <a name="variables"></a>
- `contract IERC20Mint token`
- `mapping(address => uint256) transactionId`
- `mapping(address => mapping(uint256 => bool)) processedTransactions`

## Functions <a name="functions"></a>

### `constructor(address _token)` (public) <a name="basebridge-constructor-address-"></a>

*Description*: Constructor sets address for DAO token interface
        @param _token Address of DAO token

### `GetTransactionId() → uint256` (external) <a name="basebridge-gettransactionid--"></a>

*Description*: Function for getting caller's actual transaction nonce
        @notice This nonce must be used in order to make transaction
        @return Caller's actual nonce
## Events <a name="events"></a>
### event `TransferRequested(address from, address to, uint256 amount, uint256 date, uint256 transactionId, bytes signature, enum BaseBridge.Step step)` <a name="basebridge-transferrequested-address-address-uint256-uint256-uint256-bytes-enum-basebridge-step-"></a>

*Description*: This event will be listened by API bridge

