// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./test/ITokenMock.sol";
import "./ECDSA.sol";

abstract contract BaseBridge is Ownable {
    /**
       @dev Interface for DAO token
        Since tokens are going to be minted and burned on BSC,
        Interface is expended with burn and mint functions
        @notice an interface for dao token
     */
    IERC20Mint public token;
    //address public otherChainBridgeAddress;

    /**
        @notice Mapping for storing addresses transaction nonce
        @notice Each nonce count is personal for each address
     */
    mapping(address => uint256) public transactionId;

    /**
        @notice Mapping for storing processed nonces
        @notice Required for contract in order not to process the same transaction twice
     */
    mapping(address => mapping(uint256 => bool)) public processedTransactions;

    /**
        @notice Enum for checking transaction step in an event
        @notice LOCK for sending tokens to contract
        @notice UNLOCK for sending tokens from contract
     */
    enum Step {LOCK, UNLOCK}

    /**
        @notice This event will be listened by API bridge
     */
    event TransferRequested(
        address indexed from,
        address to,
        uint256 amount,
        uint256 date,
        uint256 indexed transactionId,
        bytes signature,
        Step indexed step
    );

    /**
        @notice Constructor sets address for DAO token interface
        @param _token Address of DAO token
     */
    constructor(address _token) public {
        token = IERC20Mint(_token);
    }

    /**
        @notice Function for getting caller's actual transaction nonce
        @notice This nonce must be used in order to make transaction
        @return Caller's actual nonce
     */
    function GetTransactionId() external view returns (uint256) {
        return transactionId[_msgSender()];
    }
}
