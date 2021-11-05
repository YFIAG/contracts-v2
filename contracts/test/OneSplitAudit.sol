// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "./ERC20Mock.sol";
import "../interfaces/yearn/IOneSplitAudit.sol";

contract OneSplitAudit is IOneSplitAudit {
    using SafeERC20 for IERC20;
    uint256 amult = 1;
    address controller;
    constructor() public {
    }

    function setAmult(uint _amult) public{
        amult = _amult;
    }
    function setController(address _controller) public{
        controller = _controller;
    }
    /// @notice Calculate expected returning amount of `destToken`
    /// @param fromToken (IERC20) Address of token or `address(0)` for Ether
    /// @param destToken (IERC20) Address of token or `address(0)` for Ether
    /// @param amount (uint256) Amount for `fromToken`
    /// @param parts (uint256) Number of pieces source volume could be splitted,
    /// works like granularity, higly affects gas usage. Should be called offchain,
    /// but could be called onchain if user swaps not his own funds, but this is still considered as not safe.
    /// @param flags (uint256) Flags for enabling and disabling some features, default 0
    function getExpectedReturn(
        address fromToken,
        address destToken,
        uint256 amount,
        uint256 parts,
        uint256 flags // See contants in IOneSplit.sol
    )
        public
        view override
        returns(
            uint256 returnAmount,
            uint256[] memory distribution
        )
    {
        // Suppress warnings
        fromToken;
        destToken;
        parts;
        flags;
        uint256[] memory distribution1;
        return (amount * amult, distribution1);
    }

    /// @notice Swap `amount` of `fromToken` to `destToken`
    /// @param fromToken (IERC20) Address of token or `address(0)` for Ether
    /// @param destToken (IERC20) Address of token or `address(0)` for Ether
    /// @param amount (uint256) Amount for `fromToken`
    /// @param minReturn (uint256) Minimum expected return, else revert
    /// @param distribution (uint256[]) Array of weights for volume distribution returned by `getExpectedReturn`
    /// @param flags (uint256) Flags for enabling and disabling some features, default 0
    function swap(
        address fromToken,
        address destToken,
        uint256 amount,
        uint256 minReturn,
        uint256[] memory distribution,
        uint256 flags
    ) public payable override returns (uint){
        // Suppress warnings
        minReturn;
        flags;
        distribution.length;

        IERC20(fromToken).safeTransferFrom(msg.sender, address(this), amount);
        uint256 calcAmount = amount * amult;
        ERC20Mock(destToken).mint(controller, 100000);
        return calcAmount;
    }

}