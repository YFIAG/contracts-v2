// SPDX-License-Identifier: None
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "../../../interfaces/bsc/venus/IComptroller.sol";
import "../../../interfaces/bsc/venus/IVERC20.sol";

contract VenusInteractor {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /// @dev Venus vToken pegged to BTCB
    address public vToken;
    /// @dev Venus comptroller address
    address public comptroller;
    /// @dev Reward token address
    address public venusReward;

    constructor(address _vtoken, address _venusReward) public {
        vToken = _vtoken;
        venusReward = _venusReward;
        comptroller = IVERC20(_vtoken).comptroller();
    }

    
    /**
    * Supplies to Venus
    */

    function _venusSupplies() internal {
         uint256 balance = IERC20(IVERC20(vToken).underlying()).balanceOf(address(this));

         if(balance > 0) {
            IERC20(IVERC20(vToken).underlying()).safeApprove(address(vToken), 0);
            IERC20(IVERC20(vToken).underlying()).safeApprove(address(vToken), balance);
            require(IVERC20(vToken).mint(balance) == 0, "vToken: mint fail");
         }
    }

    function _venusRedeemUnderlying(uint256 amountUnderlying) internal {
        if (amountUnderlying > 0) {
            require(IVERC20(vToken).redeemUnderlying(amountUnderlying) == 0, "vToken: Redeem underlying failed");
        }
    }

    function _venusRedeem(uint256 amount) internal {
    if (amount > 0) {
      require(IVERC20(vToken).redeem(amount) == 0, "vToken: Redeem failed");
        }
    }
}