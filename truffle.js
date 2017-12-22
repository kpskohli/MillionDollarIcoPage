var TestRPC = require('ethereumjs-testrpc');

module.exports = {
  networks: {
    test: {
      provider: TestRPC.provider(), // in-memory TestRPC provider
      network_id: "*" // Match any network id
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: 'localhost',
      port: 8545,
      network_id: 4,
      gas:6000000,
      gasPrice: "20000000000", // 20 gwei
      from:"0x666aaac09ba3a5526ecbcb3007f57ee791be17eb"
    },
    live: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "1", // Only mainnet
      gasPrice: "10000000000", // 10 gwei
      gas: "5000000", // 0.02 eth at 4 gwei price
    },
  }
};
