// SPDX-License-Identifier: None
pragma solidity ^0.6.12;

interface IComptroller {
    function claimVenus(address holder, address[] calldata vTokens) external;

    function venusAccrued(address holder) external view returns (uint256);

    function venusSupplierIndex(address vToken, address holder) external view returns (uint256);

    function venusBorrowerIndex(address vToken, address holder) external view returns (uint256);

    function treasuryPercent() external view returns (uint256);

    function venusSpeeds(address vToken) external view returns (uint256);

    /**
     * @notice Determine the current account liquidity wrt collateral requirements
     * @return (possible error code (semi-opaque),
                account liquidity in excess of collateral requirements,
     *          account shortfall below collateral requirements)
     */
    function getAccountLiquidity(address account)
        external
        view
        returns (
            uint256,
            uint256,
            uint256
        );

    function enterMarkets(address[] calldata vTokens) external returns (uint256[] calldata);

    function getHypotheticalAccountLiquidity(
        address account,
        address vTokenModify,
        uint256 redeemTokens,
        uint256 borrowAmount
    )
        external
        view
        returns (
            uint256,
            uint256,
            uint256
        );
}
