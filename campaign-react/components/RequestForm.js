// Request Form
// takes in required data from user for Campaign::createRequest(string,string uint) method call
import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";

import Campaign from "../ethereum/campaign.js";
import web3 from "../ethereum/web3";

import { Router } from "../routes";

class RequestForm extends Component {
  state = {
    description: "",
    spendAmount: "",
    recipient: "",
    loading: false,
    errorMessage: ""
  };

  onSubmit = async () => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    const campaign = Campaign(this.props.address);
    const { description, spendAmount, recipient } = this.state;

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(
          description,
          recipient,
          web3.utils.toWei(spendAmount, "ether")
        )
        .send({
          from: accounts[0]
        });
      Router.pushRoute(`/campaigns/${this.props.address}/requests`); // Return to Campaign Page
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({
      loading: false,
      spendAmount: "",
      recipient: "",
      description: ""
    });
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Spend Amount</label>
          <Input
            label="ether"
            labelPosition="right"
            value={this.state.spendAmount}
            onChange={event =>
              this.setState({ spendAmount: event.target.value })
            }
          />
        </Form.Field>
        <Form.Field>
          <label>Recipient</label>
          <Input
            value={this.state.recipient}
            onChange={event => this.setState({ recipient: event.target.value })}
          />
        </Form.Field>
        <Form.Field>
          <label>Description</label>
          <Input
            value={this.state.description}
            onChange={event =>
              this.setState({ description: event.target.value })
            }
          />
        </Form.Field>
        <Message error header={"Oops!"} content={this.state.errorMessage} />
        <Button primary loading={this.state.loading}>
          Create Request!
        </Button>
      </Form>
    );
  }
}

export default RequestForm;
