// Configure Web3 using Metamask/Infura Provider
import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && window.web3 !== "undefined") {
  // We are running in the browser and user has Metamask
  web3 = new Web3(window.web3.currentProvider); // Browser only global variable
} else {
  // We are on the Server OR user is not running Metamask
  const provider = new Web3.providers.HttpProvider( // Make our own provider - Infura
    "https://rinkeby.infura.io/v3/e12a4f581ff546039c9189b70f19c53c"
  );
  web3 = new Web3(provider);
}

export default web3;
