let fs = require("fs");
let path = require("path");
module.exports = function (gas) {
    for (const contractName in gas) {
        if (Object.hasOwnProperty.call(gas, contractName)) {
            const contractGasEstimate = gas[contractName];
            let docString = `# ${contractName} gas usage\n\n`;
            docString += `| Function name | Estimated gas usage |\n`;
            docString += `|-|-|\n`;
            for (const func in contractGasEstimate) {
                if (Object.hasOwnProperty.call(contractGasEstimate, func)) {
                    const gasValue = contractGasEstimate[func];
                    docString += ` | ${func} | ${gasValue} |\n`;
                }
            }
            docString += '\n';
            fs.writeFileSync(path.join(__dirname, `../docs/gas_estimates/${contractName}.md`), docString);
            console.log(`docs/gas_estimates/${contractName}.md created!`);
        }
    }
}