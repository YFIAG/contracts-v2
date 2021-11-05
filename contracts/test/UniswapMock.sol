// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "./ERC20Mock.sol";
/// @title Uniswap mock for compound no fold strategy test
contract UniswapMock {

    uint256 claimAmount;
    address public WETH = address(1);
    constructor() public {
    }

    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256,
        address[] calldata path,
        address,
        uint256
    ) external returns (uint256[] memory){
        ERC20Mock(path[0]).transferFrom(msg.sender,address(this),amountIn);
        ERC20Mock(path[2]).mint(msg.sender,amountIn);
    }
}
