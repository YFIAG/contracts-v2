// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract cERC20Mock is ERC20 {
    ERC20 public underlying;
    address public comptroller;
    bool failMint = false;
    uint256 cash = uint256(-1);

    constructor(
        string memory _name,
        string memory _symbol,
        ERC20 _underlying,
        address _comptroller
    ) public ERC20(_name, _symbol) {
        underlying = _underlying;
        comptroller = _comptroller;
    }

    function setCash(uint256 _cash) external {
        cash = _cash;
    }

    function getCash() external view returns (uint256) {
        return cash;
    }

    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }

    function setFailMint(bool _value) external {
        failMint = _value;
    }

    function mint(uint256 _mintAmount) external returns (uint256) {
        if (failMint) return 1;
        if (underlying.allowance(msg.sender, address(this)) >= _mintAmount) {
            underlying.transferFrom(msg.sender, address(this), _mintAmount);
            _mint(msg.sender, _mintAmount);
            return 0;
        } else {
            return 1;
        }
    }

    function balanceOfUnderlying(address owner) external view returns (uint256) {
        return balanceOf(owner);
    }

    function redeemUnderlying(uint256 _redeemAmount) public returns (uint256) {
        if (balanceOf(msg.sender) >= _redeemAmount) {
            _burn(msg.sender, _redeemAmount);
            underlying.transfer(msg.sender, _redeemAmount);
            return 0;
        } else {
            return 1;
        }
    }

    function redeem(uint256 redeemTokens) external returns (uint256) {
        return redeemUnderlying(redeemTokens);
    }

    function exchangeRateStored() external pure returns (uint256) {
        return 1e18;
    }
}
