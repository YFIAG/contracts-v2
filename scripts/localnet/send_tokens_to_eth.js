require('dotenv').config();
const Web3 = require('web3');

const EthBridge = require('../abi/EthBridge.json');
const BscBridge = require('../abi/BscBridge.json');
const EthERC20 = require('../abi/erc20_ETH_Mock.json');
const BscERC20 = require('../abi/erc20_BSC_Mock.json');

// eslint-disable-next-line
web3 = new Web3('ws://localhost:8545');

const ethBridgeContract = new web3.eth.Contract(
    EthBridge,
    process.env.ETH_BRIDGE_ADDRESS
);

const bscBridgeContract = new web3.eth.Contract(
    BscBridge,
    process.env.BSC_BRIDGE_ADDRESS
);

const ethERC20Contract = new web3.eth.Contract(
    EthERC20,
    process.env.ERC20_ETH_ADDRESS
);

const bscERC20Contract = new web3.eth.Contract(
    BscERC20,
    process.env.ERC20_BSC_ADDRESS
);

const sendFromBsc = async () => {
    let accounts;

    await web3.eth.getAccounts().then(
        (acc) => accounts = acc
    );

    let amount = 100000;
    let nonce = await ethBridgeContract.methods.GetTransactionId()
        .call({from: accounts[1]});

    const message = web3.utils.soliditySha3(
        {t: 'address', v: accounts[1]},
        {t: 'address', v: accounts[1]},
        {t: 'uint256', v: amount},
        {t: 'uint256', v: nonce}
    ).toString('hex');
    console.log('Msg: ', message);

    const { signature } = web3.eth.accounts.sign(
        message,
        "0x3f73da75934839ca37958a57cd44c2f957fa8b8a12af8628e09987981a4a677e"
    );

    try {
        await bscBridgeContract.methods.SendTokensToEth(accounts[1], amount, signature)
            .send({
                from: accounts[1]
            });
    } catch(err) {
        console.log("Error while calling SendTokensToEth: ", err);
        return;
    }

    console.log("Succesfully requested transfer tokens from ETH to BSC");
};

sendFromBsc();