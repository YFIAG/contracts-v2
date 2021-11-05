const HDWalletProvider = require("@truffle/hdwallet-provider");
const {
    assert
} = require("assert").strict;
const Web3 = require("web3");
const {
    coerceAddress,
    getConfig
} = require("./helpers");
require("colors");


module.exports = function (yargs, abi, contractAddress) {

    let config = getConfig();
    if (!(config.key && config.provider)) {
        return yargs;
    }


    let web3 = new Web3(new HDWalletProvider(config.key, config.provider));
    let Contract = web3.eth.Contract;
    const contractInstance = new Contract(abi, contractAddress);



    const funcs = abi.filter((el) => {
        return (el.type == "function")
    })
    funcs.forEach(func => {

        const inputsNames = func.inputs.map(input => `<${input.name}>`).join(' ');
        yargs = yargs.command(`${func.name} [send|s] ${inputsNames}`, "contract's function", (yargs) => {
                for (let i = 0; i < func.inputs.length; i++) {
                    const input = func.inputs[i];
                    yargs = yargs.positional(input.name, {
                        describe: "function's argument",
                        type: "string",
                        coerce: input.type == "address" ? coerceAddress : undefined
                    });
                }
                yargs.positional("send", {
                    describe: 'If specified the function will be called',
                    type: "boolean"
                })
            },
            handlerFactory(func));

    });
    return yargs;

    function handlerFactory(func) {
        return async function handler(argv) {
            contractInstance.options.from = (await web3.eth.getAccounts())[0];
            const args = func.inputs.map(input => {
                return argv[input.name];
            });
            let tx = contractInstance.methods[func.name](...args);
            console.log(argv.send);
            if (argv.send)
                console.log( await contractInstance.methods[func.name](...args).send());
            else
                console.log(await tx.call());
        };
    }
}