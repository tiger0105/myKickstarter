// Compile Script - Multiple Contracts
// Obtain Contract Bytecode and ABI for 2 Smart Contracts
// This time compile contracts only once and save rather than compiling at every application startup
const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// Delete contents of `./build` directory
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath); // Remove directory and all contents

// Read Campaign.sol from `./contracts`
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");

// Compile both contracts with Solidity compiler
const output = solc.compile(source, 1).contracts; // Contains both contract objects

// Write output to the `./build` directory
fs.ensureDirSync(buildPath); // Creates directory
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.substring(1) + ".json"),
    output[contract] // Contents to be written to file
  );
}
