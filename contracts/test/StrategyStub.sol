// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC20Mock.sol";
import "../interfaces/yearn/IStrategy.sol";

contract YTestStrategy is IStrategy {
    ERC20Mock public _want;
    address controller;
    address vault;
    string name;
    uint256 public performanceFee = 500;

    function setPerformanceFee(uint256 _performanceFee) external {
        performanceFee = _performanceFee;
    }

    constructor(address _token, address _controller, address _vault, string memory _name) public {
        _want = ERC20Mock(_token);
        controller = _controller;
        vault = _vault;
        name = _name;
    }

    modifier onlyController() {
        require(msg.sender == controller, "!controller");
        _;
    }

    function getNameStrategy() public view override returns (string memory){
        return name;
    }

    function want() public view override returns (address) {
        return address(_want);
    }

    function deposit() public override {}

    // Controller role - withdraw should return to Controller
    function withdraw(address _asset) public override onlyController {
        // require(_asset == address(_want), "!want");
        if (address(_want) != _asset) {
            IERC20(_asset).transfer(controller, 1000);
        }
        else {
        _want.mint(vault, 1000);
        _want.mint(controller, 1000);
        _want.transfer(vault, _want.balanceOf(address(this)));
        }

    }

    // Controller | Vault role - withdraw should always return to Vault
    function withdraw(uint256 _amount) public override onlyController {
        _want.transfer(vault, _amount);
    }

    function skim() public override {}

    function convert(address) external override returns(uint){
        return 0;
    }

    // Controller | Vault role - withdraw should always return to Vault
    function withdrawAll() external override {
        _want.transfer(vault, _want.balanceOf(address(this)));
        _want.mint(vault, 1000);
    }

    function balanceOf() external view override returns (uint256) {
        return IERC20(_want).balanceOf(address(this));
    }
}
