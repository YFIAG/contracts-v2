
const {
  toHex,
  toWei
} = require("web3-utils");
const Web3 = require('web3');
require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');
const PrivateKeyProvider = require('web3-privatekey-provider');

// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */
  plugins: ["solidity-coverage", "truffle-contract-size"],

  networks: {
    development: {
      host: "127.0.0.1",
      gas: "6000000",
      gasPrice: toHex(toWei("1", "gwei")),
      network_id: "*",
      port: "8545",
      skipDryRun: true,
    },
    soliditycoverage: {
      host: "127.0.0.1",
      network_id: "*",
      port: "8545",
      gas: 0xfffffffffff,
      gasPrice: 0x01
    },
    kovan: {
      provider: () => new HDWalletProvider({
        privateKeys: process.env.PRIVATE_KEY.split(','),
        providerOrUrl: "https://kovan.infura.io/v3/" + process.env.INFURA_ID
      }),
      networkId: 42, // Kovan's id
      network_id: 42,
      gasPrice: process.env.GAS_PRICE,
    },
    rinkeby: {
      provider: () => new HDWalletProvider({
        privateKeys: process.env.PRIVATE_KEY.split(','),
        providerOrUrl: "https://rinkeby.infura.io/v3/" + process.env.INFURA_ID
      }),
      networkId: 4, // Rinkeby's id
      network_id: 4,
      skipDryRun: true,
      gasPrice: process.env.GAS_PRICE,
    },
    mainnet: {
      provider: () => new HDWalletProvider({
        privateKeys: process.env.PRIVATE_KEY.split(','),
        providerOrUrl: "https://mainnet.infura.io/v3/" + process.env.INFURA_ID
      }),
      networkId: 1, // Mainnet's id
      network_id: 1,
      gasPrice: process.env.GAS_PRICE,
    },
    mainnetFork: {
      host: "127.0.0.1",
      port: "8545",
      gasPrice: 10,
      gas: 8e6,
      network_id: 1,
      skipDryRun: true,
      unlocked_accounts:["0xca06411bd7a7296d7dbdd0050dfc846e95febeb7"]
    },
    bsc_mainnet: {
      provider: () => new HDWalletProvider({
        privateKeys: process.env.PRIVATE_KEY.split(','),
        providerOrUrl: 'https://bsc-dataseed.binance.org/'
      }),
      network_id: "56",
      gas: 3000000,
      //    gasPrice: process.env.BSC_GAS_PRICE,
      confirmations: 3,
      timeOutBlocks: 300
    },
    bscTestnet: {
      provider: () => new HDWalletProvider({
        privateKeys: process.env.PRIVATE_KEY.split(','),
        providerOrUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      }),
      network_id: "97",
      gas: 5000000,
      gasPrice: process.env.GAS_PRICE,
      timeoutBlocks: 200,
      networkCheckTimeout: 10000000,
      skipDryRun: true,
      websokets: true
    }
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    timeout: 10000000000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6.12", // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      settings: { // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
        //  evmVersion: "byzantium"
        // }
      }
    }
  }
}