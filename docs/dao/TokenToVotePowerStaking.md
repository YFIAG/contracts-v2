# TokenToVotePowerStaking
*ERC20 token staking to receive voting power*

*Description*: This contracts allow to get voting power for DAO voting

**Dev doc**: Voting power non-transferable, user can't send or receive it from another user, only get it from staking.

## Table of contents:
- [Variables](#variables)
- [Functions:](#functions)
  - [`getStakingToken() → contract IERC20 _stakingToken` (external) ](#tokentovotepowerstaking-getstakingtoken--)
  - [`constructor(contract IERC20 _stakingToken)` (public) ](#tokentovotepowerstaking-constructor-contract-ierc20-)
  - [`totalSupply() → uint256` (public) ](#tokentovotepowerstaking-totalsupply--)
  - [`balanceOf(address account) → uint256` (public) ](#tokentovotepowerstaking-balanceof-address-)
  - [`stake(uint256 amount)` (public) ](#tokentovotepowerstaking-stake-uint256-)
  - [`withdraw(uint256 amount)` (public) ](#tokentovotepowerstaking-withdraw-uint256-)

## Variables <a name="variables"></a>
- `contract IERC20 stakingToken`

## Functions <a name="functions"></a>

### `getStakingToken() → contract IERC20 _stakingToken` (external) <a name="tokentovotepowerstaking-getstakingtoken--"></a>

*Description*: Returns staking token address

#### Returns
 - _stakingToken - staking token address

### `constructor(contract IERC20 _stakingToken)` (public) <a name="tokentovotepowerstaking-constructor-contract-ierc20-"></a>

*Description*: Contract constructor


#### Params
 - `_stakingToken`: Sets staking token

### `totalSupply() → uint256` (public) <a name="tokentovotepowerstaking-totalsupply--"></a>

*Description*: Returns amount of the voting power in the system

**Dev doc**: Returns _totalSupply variable

#### Returns
 - Voting power amount

### `balanceOf(address account) → uint256` (public) <a name="tokentovotepowerstaking-balanceof-address-"></a>

*Description*: Returns account's voting power balance


#### Params
 - `account`: The address of the user

#### Returns
 - Voting power balance of the user

### `stake(uint256 amount)` (public) <a name="tokentovotepowerstaking-stake-uint256-"></a>

*Description*: Stakes token and adds voting power (with a 1:1 ratio)

**Dev doc**: Token amount must be approved to this contract before staking.


#### Params
 - `amount`: Amount to stake

### `withdraw(uint256 amount)` (public) <a name="tokentovotepowerstaking-withdraw-uint256-"></a>

*Description*: Withdraws token and subtracts voting power (with a 1:1 ratio)


#### Params
 - `amount`: Amount to withdraw
