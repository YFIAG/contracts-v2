require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const provider = new HDWalletProvider(
    process.env.BSC_PRIVATE_KEY,
    'https://data-seed-prebsc-1-s1.binance.org:8545/'
);
const web3 = new Web3(provider);

const YVault = require('../../abi/yVault.json');
const Controller = require('../../abi/Controller.json');
const Strategy = require('../../abi/yTestStrategy.json');
const ERC20Mock = require('../../abi/ERC20Mock');

const user1 = "0xa1D12c00a03107aa19d922858b83ceED398F4825";
const user1_private_key = "f7976dd6059603295641c25e5e113fe45580591c1c69dfacc36fc45a2b1b9cbd";

let vault1, vault2, erc20_1, erc20_2, strategy1, strategy2, controller;
// Creating controller contract instance
controller = new web3.eth.Contract(Controller, process.env.TEST_CONTROLLER_ADDRESS);
 // Creating vaults contracts instances
vault1 = new web3.eth.Contract(YVault, process.env.TEST_VAULT1_ADDRESS);
vault2 = new web3.eth.Contract(YVault, process.env.TEST_VAULT2_ADDRESS);
// Creating ERC20 Mocks contracts instances
erc20_1 = new web3.eth.Contract(ERC20Mock, process.env.TEST_TOKEN1_ADDRESS);
erc20_2 = new web3.eth.Contract(ERC20Mock, process.env.TEST_TOKEN2_ADDRESS);
// Creating strategies contract instances
strategy1 = new web3.eth.Contract(Strategy, process.env.TEST_STRATEGY1_ADRESS);
strategy2 = new web3.eth.Contract(Strategy, process.env.TEST_STRATEGY2_ADRESS);

const send_to_strategy = async () => {
    // Send tokens from vault to the strategy
    let nonce = await web3.eth.getTransactionCount(process.env.BSC_ADMIN_ADDRESS);
    await vault1.methods.earn().send({
        from: process.env.BSC_ADMIN_ADDRESS,
        gas: 3000000,
        nonce
    });
    // Check balance of strategy
    let amount_strategy = (await controller.methods.balanceOf(
                        process.env.TEST_VAULT1_ADDRESS).call());
    console.log("Strategy balance: ", amount_strategy);
}

send_to_strategy();