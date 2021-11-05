const fs = require("fs");
let path = require("path");
module.exports = function (deployer) {
    let addresses = require("./addresses.tmp.json");

    console.dir(addresses);

    fs.unlinkSync(path.join(__dirname,"addresses.tmp.json"));

}