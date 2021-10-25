// Deploy Script
// Publish Smart Contract to Test Network
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledHQ = require("./build/CampaignHQ.json");

const provider = new HDWalletProvider(
  "train doctor kite vicious case try plastic limit amateur vendor cat stove",
  "https://rinkeby.infura.io/v3/e12a4f581ff546039c9189b70f19c53c"
);

const web3 = new Web3(provider);

// Need a function to use async/await so we will just make a function container
const deploy = async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from: ", accounts[0]);

  // Use one of those accounts to deploy the contract
  const result = await new web3.eth.Contract(JSON.parse(compiledHQ.interface))
    .deploy({ data: "0x" + compiledHQ.bytecode })
    .send({ from: accounts[0] }); // remove 'gas'

  console.log("Contract deployed to: ", result.options.address);
};
deploy();
