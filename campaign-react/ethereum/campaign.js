// Create access to Campaign for use by any part of appication
import web3 from "./web3.js";
import Campaign from "./build/Campaign.json";

export default address => {
  return new web3.eth.Contract(JSON.parse(Campaign.interface), address);
};

// Return an instance of the campaign contract at the given address
