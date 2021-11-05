require('dotenv').config();
const Web3 = require('web3');

const EthBridge = require('../abi/EthBridge.json');
const BscBridge = require('../abi/BscBridge.json');

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

/*
    Listening to Ethereum bridge
 */
ethBridgeContract.events.TransferRequested(
    {
        filter: { step: 0 },
        fromBlock: 0
    }
)
.on('data', async event => {
    const {from, to, amount, date, transactionId, signature} = event.returnValues;
    let accounts;

    await web3.eth.getAccounts().then(
        (acc) => accounts = acc
    );
    let receipt;
    try {
        receipt = await bscBridgeContract.methods.unlockTokens(
            from,
            to,
            amount,
            transactionId,
            signature
        ).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 4700000,
        });
    }catch(err) {
        console.log("Error while processing tx from ETH to BSC: ", err);
        return;
    }

    console.log(`
    Transaction processed from ETH to BSC:
    - transaction hash ${receipt.transcationHash}
    - from ${from}
    - to ${to}
    - amount ${amount}
    - date ${date}
    `);
});

/*
    Listening to BSC Bridge
 */
bscBridgeContract.events.TransferRequested(
    {
        filter: { step: 0 },
        fromBlock: 0
    }
)
.on('data', async event => {
    const {from, to, amount, date, transactionId, signature} = event.returnValues;
    let accounts;

    await web3.eth.getAccounts().then(
        (acc) => accounts = acc
    );
    let receipt;
    try {
        receipt = await ethBridgeContract.methods.unlockTokens(
            from,    
            to,
            amount,
            transactionId,
            signature,
        ).send({
            from: accounts[0],
            gas: 3000000,
            gasPrice: 4700000,
        });
    }catch(err) {
        console.log("Error while processing tx from BSC to ETH: ", err);
    }

    console.log(`
    Transaction processed from BSC to ETH:
    - transaction hash ${receipt.transactionHash}
    - from ${from}
    - to ${to}
    - amount ${amount}
    - date ${date}
    `);
});