# Yagnostic contracts migration doc

## Set up repository

Follow README.md to set up project.

## Available networks to deploy

You can specify these networks in the `<network_name>` places.

 - kovan
 - rinkeby
 - mainnet
 - bsc_mainnet
 - bscTestnet

## Platform

Below you can see how to migrate platform to Ethereum and BSC step by step:controller, vaults, strategies and DAO contracts.

### Deploy Controller

Controller is the main point of management of all yAgnostic contracts.

#### Preparations

Before deploying Controller, make sure to set the following environment variables in the .env:

- PRIVATE_KEY - Private key for the deployment or several private keys separated with the comma.
- INFURA_ID - Infura API key.
- GAS_PRICE - Set the gas price for the deployment transaction.
- REWARDS_ADDRESS - address where to send rewards generated during earning

Also check that you have enough ETH on the balance to deploy contracts.

#### Deployment

Run `$ npm run deploy:base -- --network <network_name>` with `<network_name>` replaced with chain name. This will deploy Controller contract. In the console output you will see deployed contract's address along with the other migration data. Copy Controller's address and save it. You can search contract's by address in the Etherscan.

#### Verify Controller

Look `Verification` section.

### Deploy vault

Vault is the contract where users will make deposits in the underlying token. Underlying token must correspond to the strategy underlying token. Each underlying token must have its Vault and corresponding strategy.

#### Preparations

Before deploying, make sure to set the following environment variables in the .env:

- PRIVATE_KEY
- INFURA_ID
- GAS_PRICE
- TOKEN_ADDRESS - vault's underlying token address
- CONTROLLER_ADDRESS - deployed controller address

Also check that you have enough ETH on the balance.

#### Deployment

Run `$ npm run deploy:vault -- --network <network_name>` with `<network_name>` replaced with chain name.

#### Verify Vault

Look `Verification` section.

### Deploy strategy

Strategy is the contract which will receive underlying token and earn using it. Underlying token must correspond to the vault underlying token. You can leave default addresses where they set in the .env.example.

#### Preparations

Before deploying, make sure to set the following environment variables in the .env:

- PRIVATE_KEY
- INFURA_ID
- GAS_PRICE
- VAULT_ADDRESS - deployed Vault address
- UNDERLYING_ADDRESS - underlying token address, it must be the same as in the Vault
- STRATEGIST_ADDRESS - address of the strategist account, this account will have control over strategy
- UNISWAP_ADDRESS - UniswapV2Router's address

Also each strategy has its own unique variables, be sure to set them before deploying:

##### VenusStrategy

It's BSC strategy.
You can choose underlying token and corresponding vToken from Venus protocol tokens (app.venus.io). For example, there is BTCB pair: BTCB token (0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c) and vBTC token (0x882C173bC7Ff3b7786CA16dfeD3DFFfb9Ee7847B).
Also Venus strategy doesn't need Uniswap address.

- VTOKEN_ADDRESS - vToken contract's address, this one must correspond with the underlying token
- VENUS_REWARD - VenusReward contract address
- ROUTER_ADDRESS = 0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F


Also check that you have enough ETH on the balance.

###### Deployment

Run `$ npm run deploy:strategy:bsc-venus -- --network <network_name>` with `<network_name>` replaced with chain name.

Then go to the Controller page on the BSC scan, select `Contract` tab, then `Write Contract` and `Connect to Web3`. When connected, go to the `approveStrategy` function. Call it with the vaults and deployed strategy contracts addresses. Then call `setStrategy` with the same arguments. After that call `setVault` with the underlying token address and vault address. These calls must be sent from the governance address (by default - address that deployed Controller contract).

##### CompoundNoFoldStrategy

It's Ethereum strategy.
You can choose underlying token and corresponding cToken from Compound protocol tokens (https://app.compound.finance/). For example, there is WBTC pair: WBTC token (0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599) and CWBTC token (0xccF4429DB6322D5C611ee964527D42E5d685DD6a).

- CTOKEN_ADDRESS - cToken contract's address, this one must correspond with the underlying token

Also check that you have enough ETH on the balance.

###### Deployment

Run `$ npm run deploy:strategy:comp-no-fold -- --network <network_name>` with `<network_name>` replaced with chain name.

Then go to the Controller page on the Etherscan, select `Contract` tab, then `Write Contract` and `Connect to Web3`. When connected, go to the `approveStrategy` function. Call it with the vaults and deployed strategy contracts addresses. Then call `setStrategy` with the same arguments. After that call `setVault` with the underlying token address and vault address. These calls must be sent from the governance address (by default - address that deployed Controller contract).

##### CRVStrategyStable

It's Ethereum strategy.
You can choose underlying token and corresponding yToken from Curve protocol tokens (https://curve.fi/). You can use one of the following token addresses:
DAI - '0x6B175474E89094C44Da98b954EedeAC495271d0F'
USDC - '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
USDT - '0xdac17f958d2ee523a2206206994597c13d831ec7'
TUSD - '0x0000000000085d4780B73119b644AE5ecd22b376'

- CURVE_ADDRESS - leave default value
- SWAP_ADDRESS - leave default value
- YCRV_ADDRESS - leave default value
- YYCRV_ADDRESS - leave default value
- YTOKEN_ADDRESS -  look for corresponding yToken on the Curve
- TOKEN_INDEX_STABLE - underlying token index: DAI = 0, USDC = 1, USDT = 2, TUSD = 3

Also check that you have enough ETH on the balance.

###### Deployment

Run `$ npm run deploy:strategy:crv-stable -- --network <network_name>` with `<network_name>` replaced with chain name.

Then go to the Controller page on the Etherscan, select `Contract` tab, then `Write Contract` and `Connect to Web3`. When connected, go to the `approveStrategy` function. Call it with the vaults and deployed strategy contracts addresses. Then call `setStrategy` with the same arguments. After that call `setVault` with the underlying token address and vault address. These calls must be sent from the governance address (by default - address that deployed Controller contract).

##### CRVStrategyWRenBTCMix

It's Ethereum strategy.
You can use one of the following token addresses for underlying address:
WBTC:  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
RenBTC: '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D'
One of the addresses above must be underlying and other will be second asset.

- TOKEN_INDEX_WRENBTC - underlying token index: REN_BTC = 0, WBTC = 1
- CURVE_POOL_ADDRESS - leave default value
- GAUGE_ADDRESS - leave default value
- SECOND_ASSET - second token address

Also check that you have enough ETH on the balance.

###### Deployment

Run `$ npm run deploy:strategy:crv-wrenbtc -- --network <network_name>` with `<network_name>` replaced with chain name.

Then go to the Controller page on the Etherscan, select `Contract` tab, then `Write Contract` and `Connect to Web3`. When connected, go to the `approveStrategy` function. Call it with the vaults and deployed strategy contracts addresses. Then call `setStrategy` with the same arguments. After that call `setVault` with the underlying token address and vault address. These calls must be sent from the governance address (by default - address that deployed Controller contract).

##### CRVStrategyYCRV

It's Ethereum strategy.
You must set underlying to this address:
Underlying(yDAI): '0x9D25057e62939D3408406975aD75Ffe834DA4cDd'

- POOL_ADDRESS - leave default value
- CURVE_DEPOSIT_ADDRESS - leave default value
- DAI_ADDRESS - leave default value

Also check that you have enough ETH on the balance.

###### Deployment

Run `$ npm run deploy:strategy:crv-ycrv -- --network <network_name>` with `<network_name>` replaced with chain name.

Then go to the Controller page on the Etherscan, select `Contract` tab, then `Write Contract` and `Connect to Web3`. When connected, go to the `approveStrategy` function. Call it with the vaults and deployed strategy contracts addresses. Then call `setStrategy` with the same arguments. After that call `setVault` with the underlying token address and vault address. These calls must be sent from the governance address (by default - address that deployed Controller contract).

## Deploy DAO

#### Preparations

Before deploying, make sure to set the following environment variables in the .env:

- PRIVATE_KEY
- INFURA_ID
- GAS_PRICE
- REWARDS_ADDRESS - address where to send rewards
- YFIAG_ADDRESS - deployed YFIAG token address
- FEE_TOKEN_ADDRESS - deployed token address in which fees will be payed
- GOVERNANCE_ADDRESS - governance multisig wallet address

Also check that you have enough ETH on the balance.

#### Deployment

Run `$ npm run deploy:dao:mainnet -- --network <network_name>` with `<network_name>` replaced with chain name.

## Bridge

### Deploy YFIAG to BSC

#### Preparations

Before deploying, make sure to set the following environment variables in the .env:

- PRIVATE_KEY
- GAS_PRICE

Also check that you have enough BNB on the balance.

#### Deployment

Run `$ npm run deploy:bsc-yfiag -- --network <network_name>` with `<network_name>` replaced with chain name (most likely you want to use bsc_mainnet).

#### Verify token

Look `Verification` section.

### Deploy bridge to Ethereum

#### Preparations

Before deploying, make sure to set the following environment variables in the .env:

- PRIVATE_KEY
- INFURA_ID
- GAS_PRICE
- YFIAG_ADDRESS - deployed YFIAG token address

Also check that you have enough ETH on the balance.

#### Deployment

Run `$ npm run deploy:bridge:eth-main -- --network <network_name>` with `<network_name>` replaced with chain name (most likely you want to use mainnet). Don't forget to save ECDSA library address.

### Deploy bridge to BSC

#### Preparations

Before deploying, make sure to set the following environment variables in the .env:

- PRIVATE_KEY
- INFURA_ID
- GAS_PRICE
- YFIAG_ADDRESS - deployed YFIAG token address

Double check that you pasted **BSC** deployed YFIAG.
Also check that you have enough BNB on the balance.

#### Deployment

Run `$ npm run deploy:bridge:bsc-main -- --network <network_name>` with `<network_name>` replaced with chain name (most likely you want to use bsc_mainnet). Don't forget to save ECDSA library address.


#### BSC YFIAG token configuration

Go to the YFIAG page on the [BscScan](https://bscscan.com/), contract must be verified. Select `Contract` tab, then `Write Contract` and `Connect to Web3`. When connected, go to the `setBridge` function. Paste deployed bridge address in the field and click `Write` button, then confirm transaction.

## Verification

Copy the address of the deployed contract and paste it in the search field on the [Etherscan](https://etherscan.io/) or [BscScan](https://bscscan.com/), depending on the chain you used for deployment. On the contract page select `Contract` tab and then click `Verify and publish` link.

*For next steps in bridge contracts verification look `Bridge contracts verification` section below.*

Then select the following settings:
 - **`Compiler type`** - `Solidity (Standard-Json-Input)`
 - **`Compiler version`** - `v0.6.12+commit.27d51765`

Also select suitable license. Then click `Continue` button.

Upload `.json` file (you can choose the right one by the name) from the project's `json_inputs/` folder then pass captcha and click `Verify and Publish`.

### Bridge contracts verification

For bridge contracts select:

 - **`Compiler type`** - `Solidity (Single file)`
 - **`Compiler version`** - `v0.6.12+commit.27d51765`

Also select suitable license. Then click `Continue` button.

Select **`Optimization`** - `Yes`.

Generate flattened contract version (you can use trufflle-flattener) and past it in the code field. Then expand `Contract Library Address` item and past there `ECDSA` name and its address (saved from migration). Pass captcha and click `Verify and Publish`.