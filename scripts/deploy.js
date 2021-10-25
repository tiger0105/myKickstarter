
const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Campaign = await ethers.getContractFactory("Campaign");
  const CampaignHQ = await ethers.getContractFactory("CampaignHQ");
  const campaign = await Campaign.deploy(deployer.address, 100, 50, 20, 365 * 24 * 60 * 60 * 1000);
  const campaignhq = await CampaignHQ.deploy();

  console.log("Campaign address:", campaign.address);
  console.log("CampaignHQ address:", campaignhq.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });