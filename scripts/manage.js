const yargs = require('yargs/yargs');
const {
    hideBin
} = require('yargs/helpers');
const path = require('path');
const fs = require('fs');
require("colors");

const {
    coerceAddress,
    coercePath,
    getConfig
} = require("./helpers");
const generateContractCommands = require('./generateContractsCommands');


let interimYargs = yargs(hideBin(process.argv))
    .command(["configure [vault] [strategy] [key] [provider] [path]", "cfg", "conf"], "set contract's addresses", (yargs) => {
            yargs.positional("vault", {
                    describe: "vault contract address",
                    type: "string",
                    coerce: coerceAddress
                })
                .positional("strategy", {
                    describe: "strategy contract address",
                    type: "string",
                    coerce: coerceAddress
                })
                .positional("key", {
                    describe: "private key to call contract",
                    type: "string"

                })
                .positional("provider", {
                    describe: "provider address (e.g. https://mainnet.infura.io/v3/a0bb216...)",
                    type: "string"

                })
                .positional("path", {
                    describe: "path to the .json config file",
                    type: "string",
                    coerce: coercePath,
                    conflicts: ["vault", "strategy"]
                })
        },
        configure)
    .command("showConf", "show current config", () => {}, () => {
        console.dir(getConfig())
    })
    .demandCommand(1, "You need at least one command before moving on".bgRed)
    .recommendCommands()
    .help();

let config = getConfig();
let isConfigured = true;

if (!(config.key && config.provider)) {
    console.log("Specify key and provider to get access to the contract's functions".bgRed);
    isConfigured = false;
}

if (isConfigured) {
    const contracts = ["yVault"];
    let addresses = getConfig();
    for (let i = 0; i < contracts.length; i++) {
        const contract = contracts[i];
        let address = addresses.vault;
        const abi = require(`../build/contracts/${contract}.json`).abi;
        interimYargs = generateContractCommands(interimYargs, abi, address);
    }
}

interimYargs.parse();

function configure(argv) {
    let oldConfig = {};

    try {
        oldConfig = getConfig();
    }
    // eslint-disable-next-line no-empty
    catch (err) {}

    let config;
    if (argv.path)
        config = {
            path: argv.path
        };

    else
        config = {
            vault: argv.vault || oldConfig.vault,
            strategy: argv.strategy || oldConfig.strategy,
            key: argv.key || oldConfig.key,
            provider: argv.provider || oldConfig.provider
        };
    console.log(`Configured`.yellow);
    fs.writeFileSync(path.join(__dirname, "config.json"), JSON.stringify(config));
}