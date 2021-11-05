// SPDX-License-Identifier: None
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract erc20_BSC_Mock is ERC20, Ownable {

    address public bridge;

    modifier onlyOwnerOrBridge() {
        require(_msgSender() == owner() || _msgSender() == bridge, "Only owner or bridge");
        _;
    }

    constructor() 
    ERC20("TestTokenBSC", "TT") public {
    }

    function setBridge(address _bridge) external onlyOwner {
        require(_bridge != bridge && _bridge != address(0), "Invalid address");
        bridge = _bridge;
    }

    function mint(address account, uint256 amount) public onlyOwnerOrBridge {
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) public onlyOwnerOrBridge {
        _burn(account, amount);
    }
}