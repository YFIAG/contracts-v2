require('dotenv').config();
const Web3 = require('web3');

const EthBridge = require('../abi/EthBridge.json');
const EthERC20 = require('../abi/erc20_ETH_Mock.json');

// eslint-disable-next-line
web3 = new Web3('ws://localhost:8545');

const ethBridgeContract = new web3.eth.Contract(
    EthBridge,
    process.env.ETH_BRIDGE_ADDRESS
);

const ethERC20Contract = new web3.eth.Contract(
    EthERC20,
    process.env.ERC20_ETH_ADDRESS
);



const sendFromEth = async () => {
    let accounts;

    await web3.eth.getAccounts().then(
        (acc) => accounts = acc
    );

    let amount = 100000;
    let nonce = await ethBridgeContract.methods.GetTransactionId().call();

    const message = web3.utils.soliditySha3(
        {t: 'address', v: accounts[0]},
        {t: 'address', v: accounts[1]},
        {t: 'uint256', v: amount},
        {t: 'uint256', v: nonce}
     ).toString('hex');
    console.log('Msg: ', message);

    const { signature } = web3.eth.accounts.sign(
        message,
        "0x0b0af78e3c0413e65c5e8aa559fa96bab42513eb7d1b744128f90e5968466ccc"
    );

    console.log('Sendind tokens from ETH to BSC');

    try {
    await ethERC20Contract.methods.approve(process.env.ETH_BRIDGE_ADDRESS, amount)
        .send({from: accounts[0]});
    }catch(err) {
        console.log("Error while approving: ", err);
        return;
    }
    try {
    await ethBridgeContract.methods.sendTokensToBSC(accounts[1], amount, signature)
        .send(
            {
                from: accounts[0],
                gas: 3000000,
                gasPrice: 4700000
            });
    }catch(err) {
        console.log("Error while calling sendTokensToBSC: ", err);
        return;
    }
    console.log("Succesfully requested transfer tokens from ETH to BSC");
};

sendFromEth();