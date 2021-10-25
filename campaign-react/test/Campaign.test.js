// Campaign Contract - Mocha Unit Testing
// Smart Contracts were tested using both this and Remix IDE
const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledHQ = require("../ethereum/build/CampaignHQ.json");
const compiledCampaign = require("../ethereum/build/Campaign.json"); // Could see about importing only bytecode and abi like before

let accounts, campaignHQ, campaign, campaignAddress;
beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  campaignHQ = await new web3.eth.Contract(JSON.parse(compiledHQ.interface))
    .deploy({ data: compiledHQ.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await campaignHQ.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  [campaignAddress] = await campaignHQ.methods.getActiveCampaigns().call(); // Array destructure gets first element

  // Create Local Contract Instance - A JS object which is defined ONLY within our browser
  // which acts as a representation of our deployed contract
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});

describe("Campaigns", () => {
  // Test 0 - Successfully Deploys Contracts
  it("deploys a CampaignHQ and a Campaign", () => {
    assert.ok(campaignHQ.options.address);
    assert.ok(campaign.options.address);
  });

  // Test 1 - Caller is Campaign Manager
  it("records caller as manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  //   // Test 2 - Successfully Contribute to Campaign
  it("allows campaign contributions", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "1000" });

    const isContributor = await campaign.methods
      .contributors(accounts[1])
      .call();

    assert(isContributor);
  });

  // Test 3 - Require Minimum Contribution
  it("requires minimum contribution", async () => {
    try {
      await campaign.methods
        .contribute()
        .send({ from: accounts[0], value: 10, gas: "1000000" });
      assert(false);
    } catch (err) {
      //   console.log(err); // Logged error is unhelpful
      assert(err);
    }
  });

  // Test 4 - Successfully createRequest
  it("allows manager to create spending request", async () => {
    await campaign.methods
      .createRequest("Pay Me", accounts[0], "100")
      .send({ from: accounts[0], gas: "1000000" });

    const request = await campaign.methods.requests(0).call();
    assert(request);
  });

  // Test 5 - Require only manager can createRequest
  it("rejects non-manager spending requests", async () => {
    try {
      await campaign.methods
        .createRequest("Pay Me", "accounts[0]", 100)
        .send({ from: accounts[1], gas: "1000000" });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  // Test 6 - Successfully approveRequest
  it("allows contributor to approve spending requests", async () => {
    const amountPaid = "1000";
    // Contribute
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "100" });
    // Create Request (try to do this beforeEach)
    await campaign.methods
      .createRequest("Pay Me", accounts[0], amountPaid)
      .send({ from: accounts[0], gas: "1000000" });
    // Approve request
    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[1], gas: "1000000" });

    // Check that request approvals[address] is true and that approval count increments
    const request = await campaign.methods.requests(0).call();
    const requestValue = request.value;
    console.log("Request Value: ", requestValue);
    assert.equal(request.approvalCount, 1);
    assert.equal(requestValue, amountPaid);
    // EVM does not allow this if nothing is contributed, however if we create a Request
    // with more value than is in the contract this is still allowed (FIX THIS)
  });

  // Test 7 - Only contributors can approveRequest
  it("rejects non-contributors attempt to approve spending requests", async () => {
    const amountPaid = "1000";
    try {
      // Contribute
      await campaign.methods
        .contribute()
        .send({ from: accounts[1], value: "100" });
      // Create Request (try to do this beforeEach)
      await campaign.methods
        .createRequest("Pay Me", accounts[0], amountPaid)
        .send({ from: accounts[0], gas: "1000000" });
      // Approve request without donating
      await campaign.methods
        .approveRequest(0)
        .send({ from: accounts[0], gas: "1000000" });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  // Test 8 - Can only vote once per request
  it("rejects contributors attempt to approve spending requests more than once", async () => {
    const amountPaid = "100";
    try {
      // Contribute
      await campaign.methods
        .contribute()
        .send({ from: accounts[1], value: amountPaid });
      // Create Request (try to do this beforeEach)
      await campaign.methods
        .createRequest("Pay Me", accounts[0], amountPaid)
        .send({ from: accounts[0], gas: "1000000" });
      // Approve request
      await campaign.methods
        .approveRequest(0)
        .send({ from: accounts[1], gas: "1000000" });
      // Approve request again
      await campaign.methods
        .approveRequest(0)
        .send({ from: accounts[1], gas: "1000000" });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  // Test 9 - Only counts unique contributors
  it("rejects contributors attempt to approve spending requests more than once", async () => {
    // Contribute once
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "100" });
    // Contribute again
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "100" });

    const uniqueContributorCount = await campaign.methods
      .contributorCount()
      .call();
    console.log("Unique Contributors: ", uniqueContributorCount);
    assert.equal(uniqueContributorCount, 1);
    // NOTE: We should allow multiple contributions from the same user but not count each
    // contribution as a unique contributor
  });

  // Test 10 - Successfully finalizeRequest
  it("allows manager to finalize spending requests", async () => {
    const amountPaid = web3.utils.toWei("10", "ether");
    let currentBalance, previousBalance;
    // Contribute
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: amountPaid });
    // Create Request (try to do this beforeEach)
    await campaign.methods
      .createRequest("Pay Me", accounts[0], amountPaid)
      .send({ from: accounts[0], gas: "1000000" });
    // Approve request
    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[1], gas: "1000000" });
    //Finalize request
    previousBalance = await web3.eth.getBalance(accounts[0]);
    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    // Check that request is complete and that user is paid
    const request = await campaign.methods.requests(0).call();
    currentBalance = await web3.eth.getBalance(accounts[0]);
    previousBalance = web3.utils.fromWei(previousBalance, "ether");
    previousBalance = parseFloat(previousBalance);
    currentBalance = web3.utils.fromWei(currentBalance, "ether");
    currentBalance = parseFloat(currentBalance);
    // console.log("Previous Balance: ", previousBalance);
    // console.log("Current Balance: ", currentBalance);
    assert(request.complete);
    assert(currentBalance > previousBalance);
  });

  // Test 11 - Only manager can finalizeRequest
  it("rejects non-manager attempts to finalize requests", async () => {
    const amountPaid = "100000000000000000";
    try {
      // Contribute
      await campaign.methods
        .contribute()
        .send({ from: accounts[1], value: amountPaid });
      // Create Request (try to do this beforeEach)
      await campaign.methods
        .createRequest("Pay Me", accounts[0], amountPaid)
        .send({ from: accounts[0], gas: "1000000" });
      // Approve request
      await campaign.methods
        .approveRequest(0)
        .send({ from: accounts[1], gas: "1000000" });
      assert(false);
      //Finalize request
      const previousBalance = await web3.eth.getBalance(accounts[0]);
      await campaign.methods
        .finalizeRequest(0)
        .send({ from: accounts[1], gas: "1000000" });
    } catch (err) {
      assert(err);
    }
  });

  // Test 12 - Requires quorum to finalizeRequest
  // Test 13 - Cannot finalizeRequest multiple times
});

// Try to use beforeEach() for tests 6 and onward
