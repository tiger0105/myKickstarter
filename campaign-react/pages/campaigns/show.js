// UPDATING IN PROGRESS
// Show Details of Specific Campaign
import React, { Component } from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign.js";
import web3 from "../../ethereum/web3";

import { Card, Button, Grid } from "semantic-ui-react";
import ContributeForm from "../../components/ContributeForm.js";

import { Link } from "../../routes";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address); // Campaign address from URL - props.query.address
    const summary = await campaign.methods.getSummary().call();
    return {
      balance: summary[0],
      minimumContribution: summary[1],
      requestCount: summary[2],
      contributorCount: summary[3],
      manager: summary[4],
      quorum: summary[5],
      fundingGoal: summary[6],
      address: props.query.address
    };
  }

  renderCampaign() {
    const {
      balance,
      manager,
      minimumContribution,
      requestCount,
      contributorCount,
      fundingGoal,
      quorum
    } = this.props;

    const items = [
      {
        header: manager,
        description:
          "The manager created this campaign and can create requests to withdraw funds",
        meta: "Address of Manager",
        style: { overflowWrap: "break-word" }
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        description: "Campaign Funds",
        meta: "Balance"
      },
      {
        header: minimumContribution,
        description:
          "You must contribute at least this much in order to vote on spending requests",
        meta: "Minimum Contribution (wei)"
      },
      {
        header: fundingGoal,
        description: "The initial funding goal in ether",
        meta: "Funding Goal"
      },
      {
        header: contributorCount,
        description: "People who have already donated",
        meta: "Number of Contributors"
      },
      {
        header: requestCount,
        description: "Requests must be approved by campaign contributors",
        meta: "Number of Requests"
      },
      // UPDATE
      {
        header: `${quorum}%`,
        description:
          "The portion of contributors approval neccesary to finalize requests",
        meta: "Quorum"
      }
    ];
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Campaign Details</h3>
          <Grid>
            <Grid.Column width={10}>{this.renderCampaign()}</Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm
                address={this.props.address}
                style={{ marginTop: "50px" }}
              />
            </Grid.Column>
          </Grid>
          <Link route={`/campaigns/${this.props.address}/requests`}>
            <a>
              <Button style={{ marginTop: "20px" }}>View Requests</Button>
            </a>
          </Link>
        </div>
      </Layout>
    );
  }
}

export default CampaignShow;

// Summary Translation Layer

// Styling: Use <Grid.Row> if you want to get the button off the card

//   async renderCampaign() {
//     let instance, data;
//     const items = await this.props.campaigns.map(async address => {
//       instance = new web3.eth.Contract(JSON.parse(Campaign.interface), address);
//       data = await instance.methods.getSummary().call();
//       console.log(data);
//       return {
//         header: address,
//         description: { data },
//         fluid: true
//       };
//     });
//     console.log("ITEMS: ", items);
//     return <Card.Group items={items} />;
//   }
