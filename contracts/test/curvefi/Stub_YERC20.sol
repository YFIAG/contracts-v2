// SPDX-License-Identifier: None
pragma solidity 0.6.12;

import "@openzeppelin/contracts/GSN/Context.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../../interfaces/curvefi/IYERC20.sol";

interface ERC20Mintable is IERC20 {
    function mint(address to, uint256 amount) external;
}

/**
 * @dev Simplified stub to imitate wrapped Y-token from yearn.finance
 */
contract Stub_YERC20 is IYERC20, Context, ERC20 {
    uint256 constant EXP_SCALE = 1e18;
    uint256 constant INITIAL_RATE = 1 * EXP_SCALE;
    uint256 prev_time;

    ERC20Mintable public underlying;
    uint256 created;

    constructor(
        address _underlying,
        string memory symb,
        uint8
    ) public ERC20("YToken", symb) {
        underlying = ERC20Mintable(_underlying);
        prev_time = now;
    }

    //yToken functions
    function token() public override returns (address) {
        return address(underlying);
    }

    function deposit(uint256 amount) public override {
        underlying.transferFrom(_msgSender(), address(this), amount);
        uint256 shares = amount.mul(EXP_SCALE).div(_exchangeRate());
        _mint(_msgSender(), shares);

        prev_time = now;
    }

    function withdraw(uint256 shares) public override {
        uint256 redeemAmount = shares.mul(_exchangeRate()).div(EXP_SCALE);
        _burn(_msgSender(), shares);
        _sendUnderlying(_msgSender(), redeemAmount);

        prev_time = now;
    }

    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }

    function getPricePerFullShare() public view override returns (uint256) {
        return _exchangeRate();
    }

    function _sendUnderlying(address recipient, uint256 amount) internal {
        uint256 underlyingBalance = underlying.balanceOf(address(this));
        if (amount > underlyingBalance) {
            underlying.mint(address(this), amount - underlyingBalance);
        }
        underlying.transfer(recipient, amount);
    }

    // Simplified calculation to imitate price changes
    function _exchangeRate() internal view returns (uint256) {
        uint256 sec = now.sub(prev_time) + 10;
        return INITIAL_RATE.add(INITIAL_RATE.mul(sec).div(365 days).div(EXP_SCALE));
    }
}
