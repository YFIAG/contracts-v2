const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

Number.prototype.fromScientific = function () {
  return this.valueOf().toLocaleString('fullwide', {
    useGrouping: false
  });
};

const constants = {
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  MAX_UINT256: '11579208923731619542357098500868790785326998466564056403945758\
4007913129639935',
};

const randomAddress = () => web3.eth.accounts.create().address;

// random number generated based on random Ethereum address
// The length of the number is always 16 digits
const randomNumber = (seed = web3.utils.randomHex(16)) =>
  Number(web3.utils.sha3(`${seed}`)).fromScientific().substr(0, 15);

function logBN(bn, fromWei = false) {
  if (fromWei) bn = web3.utils.fromWei(bn);
  console.log(bn.toString());
}

module.exports = {
  web3,
  constants,
  randomAddress,
  randomNumber,
  logBN
};