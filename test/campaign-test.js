const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

let Campaign, campaign,  CampaignHQ, campaignhq

describe("Campaign", function () {
    it("Should be deployed", async function () {
        const [deployer] = await ethers.getSigners();

        Campaign = await ethers.getContractFactory("Campaign");
        campaign = await Campaign.deploy(deployer.address, 100, 50, 20, 365 * 24 * 60 * 60 * 1000);
        await campaign.deployed();

        CampaignHQ = await ethers.getContractFactory("CampaignHQ");
        campaignhq = await CampaignHQ.deploy();
        await campaignhq.deployed();
    });

    
});
