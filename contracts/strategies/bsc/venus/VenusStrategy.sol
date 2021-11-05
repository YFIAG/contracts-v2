// SPDX-License-Identifier: None
pragma solidity 0.6.12;

import "../../BoilerplateStrategy.sol";
import "./VenusInteractor.sol";

import "../../../interfaces/bsc/IPancakeRouter.sol";

contract VenusStrategy is BoilerplateStrategy, VenusInteractor {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    /// @dev PancakeSwape Router address
    address public router;

    constructor(
        address _vault,
        address _underlying,
        address _strategist,
        address _vtoken,
        address _venusReward,
        address _router
    ) public 
      BoilerplateStrategy(_vault, _underlying, _strategist)
      VenusInteractor(_vtoken,  _venusReward)
    {
        router = _router;

        // set these tokens to be not salvagable
        unsalvageableTokens[_underlying] = true;
        unsalvageableTokens[_vtoken] = true;
        unsalvageableTokens[_venusReward] = true;
    }

    /*****
     * VIEW INTERFACE
     *****/

    function getNameStrategy() external view override returns(string memory){
      return "CompoundNoFoldStrategy";
    }

    function want() external override view returns(address){
      return address(underlying);
    }

    /**
     * Returns the current balance. Ignores COMP/CREAM that was not liquidated and invested.
     */
    function balanceOf() external override view returns (uint256) {
        uint256 currentVbal = IERC20(vToken).balanceOf(address(this));
        //The current exchange rate as an unsigned integer, scaled by 1e18.
        uint256 suppliedInUnderlying = currentVbal.mul(IVERC20(vToken).exchangeRateStored()).div(1e18);

        return IERC20(underlying).balanceOf(address(this)).add(suppliedInUnderlying);
    }

    /*****
     * DEPOSIT/WITHDRAW/HARVEST EXTERNAL
     *****/

    /**
     * The strategy invests by supplying the underlying as a collateral.
     */
     function deposit() public override restricted {
        _venusSupplies();
    }

    function withdraw(uint256 amount) external override restricted {
        if(harvestOnWithdraw && liquidationAllowed) {
            claimVenus();
            liquidateVenus();
        }

        uint256 balanceUnderlying = IVERC20(vToken).balanceOfUnderlying(address(this));
        uint256 looseBalance = IERC20(underlying).balanceOf(address(this));
        uint256 total = balanceUnderlying.add(looseBalance);

        if (amount > total) {
            //cant withdraw more than we own
            amount = total;
        }

        if (looseBalance >= amount) {
            IERC20(underlying).safeTransfer(vault, amount);
            return;
        }

        uint256 toWithdraw = amount.sub(looseBalance);
        _venusRedeemUnderlying(toWithdraw);

        looseBalance = IERC20(underlying).balanceOf(address(this));
        IERC20(underlying).safeTransfer(vault, looseBalance);
    }

    /**
     * Exits Compound and transfers everything to the vault.
     */
    function withdrawAll() external override restricted {
        if (harvestOnWithdraw && liquidationAllowed) {
            claimVenus();
            liquidateVenus();
        }

        _venusRedeem(IVERC20(vToken).balanceOf(address(this)));

        uint256 looseBalance = IERC20(underlying).balanceOf(address(this));
        IERC20(underlying).safeTransfer(vault, looseBalance);
    }

    function emergencyExit() external onlyGovernance {
        _venusRedeem(IVERC20(vToken).balanceOf(address(this)));

        uint256 looseBalance = IERC20(underlying).balanceOf(address(this));
        IERC20(underlying).safeTransfer(IVault(vault).governance(), looseBalance);
    }

    /**
     * Withdraws all assets, liquidates Venus, and invests again in the required ratio.
     */
    function earn() public restricted {
        if (liquidationAllowed) {
            claimVenus();
            liquidateVenus();
        }
        
        deposit();
    }

    function claimVenus() public { 
        address[] memory tokens = new address[](1);
        tokens[0] = vToken;
        IComptroller(comptroller).claimVenus(address(this), tokens);
    }

     function liquidateVenus() public {
        uint256 balanceBefore = IERC20(underlying).balanceOf(address(this));
        uint256 balance = IERC20(venusReward).balanceOf(address(this));
        if (balance < sellFloor) {
            return;
        }

        IERC20(venusReward).safeApprove(address(router), 0);
        IERC20(venusReward).safeApprove(address(router), balance);

        address[] memory path = new address[](3);
        path[0] = venusReward;
        path[1] = IPancakeRouter(router).WETH();
        path[2] = address(underlying);
        IPancakeRouter(router).swapExactTokensForTokens(
            balance,
            0,
            path,
            address(this),
            block.timestamp + 10
        );

        uint256 balanceAfter = IERC20(underlying).balanceOf(address(this));

        _profitSharing(balanceAfter.sub(balanceBefore));
    }

    function convert(address) external override returns(uint256){
      return 0;
    }

    function skim() external override {
      return;
    }
}