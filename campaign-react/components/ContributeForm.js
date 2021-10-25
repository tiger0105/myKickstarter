// Contribute Form
// takes in required data from user for Campaign::contribute() method call
import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";

import Campaign from "../ethereum/campaign.js";
import web3 from "../ethereum/web3";

import { Router } from "../routes"; // Allow us to rerender page with next.js

class ContributeForm extends Component {
  state = {
    contribution: "",
    loading: false,
    errorMessage: ""
  };

  onSubmit = async () => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    const campaign = Campaign(this.props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.contribution, "ether")
      });
      Router.replaceRoute(`/campaigns/${this.props.address}`); // Refresh the page to rerender component
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false, contribution: "" });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to Contribute</label>
          <Input
            label="ether"
            labelPosition="right"
            value={this.state.contribution}
            onChange={event =>
              this.setState({ contribution: event.target.value })
            }
          />
        </Form.Field>
        <Message error header={"Oops!"} content={this.state.errorMessage} />
        <Button primary loading={this.state.loading}>
          Contribute!
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
