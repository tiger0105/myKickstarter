// UPDATE IN PROGRESS
// Create A New Campaign
import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Button, Form, Input, Message } from "semantic-ui-react";

import hq from "../../ethereum/hq";
import web3 from "../../ethereum/web3";
import CampaignForm from "../../components/CampaignForm.js";

import { Router } from "../../routes";

class CampaignNew extends Component {
  render() {
    return (
      <Layout>
        <h3>Create a New Campaign</h3>
        <CampaignForm />
      </Layout>
    );
  }
}

export default CampaignNew;
