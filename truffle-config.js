const path = require("path");
// const fs = require('fs-extra');
// const HDWalletProvider = require('./@truffle/hdwallet-provider');

// let secrets;

// if(fs.existsSync('secrets.json')){
//   secrets = JSON.parse(fs.readFileSync('secrets.json','utf8'));
// }

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: { 
    development: { 
      network_id: "*", 
      host: 'localhost', 
      port: 8545,
      gas: 6721975,
      gasPrice: 20000000000
    }
  },
  compilers: {
    solc: {
      version: "0.4.17",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
 },
//  rinkeyby: {
//    provider: new HDWalletProvider(secrets.mnemonic, secrets.infuraApiKey),
//    network_id: '4'
//  }
};
