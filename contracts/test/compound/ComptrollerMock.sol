// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "../ERC20Mock.sol";

contract ComptrollerMock {

    ERC20Mock comp;
    uint256 claimAmount;

    constructor(
        ERC20Mock _comp,
        uint256 _claimAmount
    ) public {
        comp = _comp;
        claimAmount = _claimAmount;
    }

    function getCompAddress() external view returns(address){
        return address(comp);
    }

    function enterMarkets(address[] memory cTokens) external returns(uint[] memory) {

    }

    function setClaimAmount(uint256 _claimAmount) external{
        claimAmount = _claimAmount;
    }

    function claimComp(address _holder) external {
        comp.mint(_holder,claimAmount);
    }

}
