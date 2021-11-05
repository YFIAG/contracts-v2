// SPDX-License-Identifier: None
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract erc20_ETH_Mock is ERC20, Ownable {

    uint public _totalSupply;    

    constructor()
      ERC20("TestTokenETH", "TT") public {
         _totalSupply = 1000000e18;

         _mint(msg.sender, _totalSupply);
         emit Transfer(address(0), msg.sender, _totalSupply);
       }

    
}