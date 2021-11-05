// SPDX-License-Identifier: None

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BSCYFIAG is ERC20, Ownable {

    address public bridge;

    modifier onlyOwnerOrBridge() {
        require(_msgSender() == owner() || _msgSender() == bridge, "Only owner or bridge");
        _;
    }

    constructor () public ERC20("YearnAgnostic","YFIAG"){}

    function setBridge(address _bridge) external onlyOwner {
        require(_bridge != bridge && _bridge != address(0), "Invalid address");
        bridge = _bridge;
    }

    function mint(address _account, uint256 _amount) public onlyOwnerOrBridge {
        _mint(_account, _amount);
    }

    function burn(address _account, uint256 _amount) public onlyOwnerOrBridge {
        _burn(_account, _amount);
    }
}