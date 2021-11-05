// SPDX-License-Identifier: None
pragma solidity 0.6.12;

import "../BaseBridge.sol";

contract BscBridge is BaseBridge {
    constructor(address _token) public BaseBridge(_token) {}

    /**
        @notice This function is called in order to send tokens from Binance Smart Chain
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
     */
    function sendTokens(
        address _to,
        uint256 _amount,
        bytes memory _signature
    ) external {
        bytes32 message = keccak256(abi.encodePacked(_msgSender(), _to, _amount, transactionId[_msgSender()]));
        require(ECDSA.recoverAddress(message, _signature) == _msgSender(), "Signature mismatch");
        emit TransferRequested(
            _msgSender(),
            _to,
            _amount,
            block.timestamp,
            transactionId[_msgSender()],
            _signature,
            Step.LOCK
        );
        transactionId[_msgSender()]++;

        token.burn(_msgSender(), _amount);
    }

    /**
        @notice This function can called only by Bridge API
        @notice Once an event is emitted on Ethereum, pointing that transaction is requested,
        some amount of tokens are locked on Ethereum and minted on BSC
        @param _from An address on Ethereum which sent a transaction. Required in order to check
        that transaction is valid
        @param _to A receiver address on Binance Smart Chain
        @param _amount Amount of tokens to be minted
        @param  ETHTransactionId Transaction nonce, required to check that transaction is valid
        @param _signature A message, signed by sender, required in order to make transaction
        secure
     */
    function unlockTokens(
        address _from,
        address _to,
        uint256 _amount,
        uint256 ETHTransactionId,
        bytes memory _signature
    ) external onlyOwner {
        require(!processedTransactions[_from][ETHTransactionId], "Transaction already processed");
        bytes32 message = keccak256(abi.encodePacked(_from, _to, _amount, ETHTransactionId));
        require(ECDSA.recoverAddress(message, _signature) == _from, "Signature mismatch");
        processedTransactions[_from][ETHTransactionId] = true;
        emit TransferRequested(_from, _to, _amount, block.timestamp, ETHTransactionId, _signature, Step.UNLOCK);
        
        token.mint(_to, _amount);
    }
}
