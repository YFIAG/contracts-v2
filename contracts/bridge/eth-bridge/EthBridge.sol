//SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "../BaseBridge.sol";

contract EthBridge is BaseBridge {
    constructor(address _token) public BaseBridge(_token) {}

    /**
        @notice This function is called in order to send tokens from Ethereum to BSC
        @notice Amount of tokens must be approved to contract before calling this function
        @notice If function call is successful, an event is emitted and bridge API
        sends tokens on BSC
        @notice Can be called by anyone
        @param _to A receiver address on Binance Smart Chain
        @param _amount Amount of tokens to lock on Ethereum and mint on BSC
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

        token.transferFrom(_msgSender(), address(this), _amount);
    }

    /**
        @notice This function can be called only by Bridge API
        @notice Once an event is emitted on BSC, pointing that transaction is requested,
        some amount of tokens are burned on BSC and unlocked on Ethereum
        @param _from An address on BSC which sent a transaction. Required in order to check
        that transaction is valid
        @param _to A receiver address on Ethereum
        @param _amount Amount of tokens to be unlocked
        @param  BSCTransactionId Transaction nonce, required to check that transaction is valid
        @param _signature A message, signed by sender, required in order to make transaction
        secure
     */
    function unlockTokens(
        address _from,
        address _to,
        uint256 _amount,
        uint256 BSCTransactionId,
        bytes memory _signature
    ) external onlyOwner {
        require(!processedTransactions[_from][BSCTransactionId], "Transaction already processed");

        bytes32 message = keccak256(abi.encodePacked(_from, _to, _amount, BSCTransactionId));
        require(ECDSA.recoverAddress(message, _signature) == _from, "Signature mismatch");

        processedTransactions[_from][BSCTransactionId] = true;
        emit TransferRequested(_from, _to, _amount, block.timestamp, BSCTransactionId, _signature, Step.UNLOCK);
    
        token.transfer(_to, _amount);
    }
}
