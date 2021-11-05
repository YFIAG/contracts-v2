// SPDX-License-Identifier: None
pragma solidity ^0.6.12;

import "./IVToken.sol";

interface IVERC20 is IVToken {
    function transfer(address dst, uint256 amount) external returns (bool);

    function transferFrom(
        address src,
        address dst,
        uint256 amount
    ) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function balanceOf(address owner) external view returns (uint256);

    function name() external returns (string calldata);

    function totalSupply() external view returns (uint256);
}
