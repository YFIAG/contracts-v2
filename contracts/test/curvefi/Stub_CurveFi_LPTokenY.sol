// SPDX-License-Identifier: None
pragma solidity 0.6.12;

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";




/**
 * @dev Simplified stub to imitate Curve.Fi LP-token
 */
contract Stub_CurveFi_LPTokenY is Context, ERC20 {
    constructor() public ERC20("Curve.fi yDAI/yUSDC/yUSDT/yTUSD", "yDAI+yUSDC+yUSDT+yTUSD") {

    }
    function addMinter(address) public pure{
        return;
    }
    function mint(address _to, uint256 _amount) public {
        _mint(_to,_amount);
    }
}