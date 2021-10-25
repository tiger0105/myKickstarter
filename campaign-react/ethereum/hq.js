// Create access to Campaign HQ for use by any part of appication
import web3 from "./web3.js";
import CampaignHQ from "./build/CampaignHQ.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignHQ.interface),
  "0xeA6cb38Aa591B086963151c6fe2d416D2e6F9Bd8" // Hard coded address of deployed CampaignHQ
);

export default instance; // If we ever need access to the deployed CampaignHQ import this file
