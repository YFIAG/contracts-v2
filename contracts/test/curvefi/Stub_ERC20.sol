// SPDX-License-Identifier: None
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Stub_ERC20 is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint8,
        uint256 _supply
    ) public ERC20(_name, _symbol) {
        _mint(_msgSender(), _supply);
    }

    function addMinter(address) public pure {
        return;
    }

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
