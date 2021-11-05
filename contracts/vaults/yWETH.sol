// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../interfaces/weth/IWETH.sol";
import "../interfaces/yearn/IController.sol";
import "./yVault.sol";

// NOTE: The name of this contract was modified from yVault so as not to conflict with yVault.sol
contract yWETH is yVault {

    constructor(address _token, address _controller) yVault(_token,_controller) public {}

    /// @notice Wraps sent amount of Eth into the WETH ERC20 and performs regular deposit.
    function depositETH() nonReentrant public payable {
        uint256 _pool = balance();
        uint256 _before = IERC20(token).balanceOf(address(this));
        uint256 _amount = msg.value;
        IWETH(address(token)).deposit{value: _amount}();
        uint256 _after = IERC20(token).balanceOf(address(this));
        _amount = _after.sub(_before); // Additional check for deflationary tokens
        uint256 shares = 0;
        if (totalSupply() == 0) {
            shares = _amount;
        } else {
            shares = (_amount.mul(totalSupply())).div(_pool);
        }
        _mint(_msgSender(), shares);
    }

    /// @notice Withdraws the sender's shares in a form of Eth.
    function withdrawAllETH() external {
        withdrawETH(balanceOf(_msgSender()));
    }

    // No rebalance implementation for lower fees and faster swaps
    /// @notice Wraps sent amount of Eth into the WETH ERC20 and performs regular deposit.
    /// @param _shares Vault shares which will be withdraw in a form of Eth
    function withdrawETH(uint256 _shares) public {
        uint256 r = (balance().mul(_shares)).div(totalSupply());
        _burn(_msgSender(), _shares);

        // Check balance
        uint256 b = IERC20(token).balanceOf(address(this));
        if (b < r) {
            uint256 _withdraw = r.sub(b);
            IController(controller).withdraw(_withdraw);
            uint256 _after = IERC20(token).balanceOf(address(this));
            uint256 _diff = _after.sub(b);
            if (_diff < _withdraw) {
                r = b.add(_diff);
            }
        }

        IWETH(address(token)).withdraw(r);

        (bool success, ) = _msgSender().call{value: r}("");
        require(success, "Transfer failed");
    }

    /// @notice Payable function to receive Eth directly from the user (insted of depositETH)
    receive() external payable {
        if (_msgSender() != address(token)) {
            depositETH();
        }
    }
}